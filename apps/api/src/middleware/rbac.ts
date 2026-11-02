import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { forbidden, unauthorized } from "../lib/errors.js";

/** Require one of the listed roles (server-side RBAC). */
export function requireRoles(...roles: UserRole[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.authUser) {
      throw unauthorized();
    }
    if (!roles.includes(request.authUser.role)) {
      throw forbidden("Insufficient role permissions");
    }
  };
}

/**
 * Project-scoped access stub used from day one.
 * Directors: org-wide. Others: must have an active project assignment
 * (customers also via assignment or project.customerId).
 */
export async function assertProjectAccess(
  request: FastifyRequest,
  projectId: string,
): Promise<void> {
  const user = request.authUser;
  if (!user) throw unauthorized();

  if (user.role === "DIRECTOR") {
    const exists = await prisma.project.findFirst({
      where: { id: projectId },
      select: { id: true },
    });
    if (!exists) throw forbidden("Project not accessible");
    return;
  }

  const assignment = await prisma.projectAssignment.findFirst({
    where: { projectId, userId: user.id, active: true },
    select: { id: true },
  });
  if (assignment) return;

  if (user.role === "CUSTOMER") {
    const asCustomer = await prisma.project.findFirst({
      where: { id: projectId, customerId: user.id },
      select: { id: true },
    });
    if (asCustomer) return;
  }

  throw forbidden("Project not accessible");
}

/** Middleware factory: reads `projectId` from params or query. */
export function requireProjectAccess(paramName = "projectId") {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const params = request.params as Record<string, string | undefined>;
    const query = request.query as Record<string, string | undefined>;
    const projectId = params[paramName] ?? query[paramName];
    if (!projectId) {
      throw forbidden("projectId required for scoped access");
    }
    await assertProjectAccess(request, projectId);
  };
}
