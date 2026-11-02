import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireRoles, assertProjectAccess } from "../middleware/rbac.js";
import { notFound } from "../lib/errors.js";
import { writeAudit } from "../services/audit.js";

export async function projectRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  /** List projects visible to the current user. */
  app.get("/projects", async (request) => {
    const user = request.authUser;
    if (user.role === "DIRECTOR") {
      return prisma.project.findMany({
        where: { archivedAt: null },
        orderBy: { updatedAt: "desc" },
      });
    }
    return prisma.project.findMany({
      where: {
        archivedAt: null,
        OR: [
          { assignments: { some: { userId: user.id, active: true } } },
          ...(user.role === "CUSTOMER" ? [{ customerId: user.id }] : []),
        ],
      },
      orderBy: { updatedAt: "desc" },
    });
  });

  app.get<{ Params: { projectId: string } }>(
    "/projects/:projectId",
    async (request) => {
      await assertProjectAccess(request, request.params.projectId);
      const project = await prisma.project.findUnique({
        where: { id: request.params.projectId },
        include: {
          assignments: {
            where: { active: true },
            include: { user: { select: { id: true, name: true, role: true } } },
          },
        },
      });
      if (!project) throw notFound("Project not found");
      // Customers must not see internal financial detail via this endpoint later —
      // Phase 1 returns core fields; financial filtering lands with expense APIs.
      return project;
    },
  );

  app.post(
    "/projects",
    { preHandler: [requireRoles("DIRECTOR")] },
    async (request) => {
      const schema = z.object({
        projectCode: z.string().min(2),
        name: z.string().min(2),
        description: z.string().optional(),
        location: z.string().optional(),
        approvedBudget: z.number().nonnegative().optional(),
        startDate: z.string().optional(),
        expectedCompletionDate: z.string().optional(),
      });
      const body = schema.parse(request.body);
      const project = await prisma.project.create({
        data: {
          projectCode: body.projectCode,
          name: body.name,
          description: body.description,
          location: body.location,
          approvedBudget: body.approvedBudget ?? 0,
          startDate: body.startDate ? new Date(body.startDate) : undefined,
          expectedCompletionDate: body.expectedCompletionDate
            ? new Date(body.expectedCompletionDate)
            : undefined,
          createdById: request.authUser.id,
        },
      });
      await writeAudit({
        userId: request.authUser.id,
        action: "CREATE",
        entityType: "Project",
        entityId: project.id,
        newValues: project,
      });
      return project;
    },
  );

  app.post<{ Params: { projectId: string } }>(
    "/projects/:projectId/assignments",
    { preHandler: [requireRoles("DIRECTOR")] },
    async (request) => {
      await assertProjectAccess(request, request.params.projectId);
      const schema = z.object({
        userId: z.string().cuid(),
        assignmentRole: z.enum(["PROJECT_MANAGER", "SITE_SUPERVISOR", "CUSTOMER"]),
      });
      const body = schema.parse(request.body);
      const assignment = await prisma.projectAssignment.upsert({
        where: {
          projectId_userId_assignmentRole: {
            projectId: request.params.projectId,
            userId: body.userId,
            assignmentRole: body.assignmentRole,
          },
        },
        create: {
          projectId: request.params.projectId,
          userId: body.userId,
          assignmentRole: body.assignmentRole,
        },
        update: { active: true },
      });
      await writeAudit({
        userId: request.authUser.id,
        action: "ASSIGN",
        entityType: "ProjectAssignment",
        entityId: assignment.id,
        newValues: assignment,
      });
      return assignment;
    },
  );
}
