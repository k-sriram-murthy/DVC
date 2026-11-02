import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { badRequest, unauthorized } from "../lib/errors.js";
import { writeAudit } from "../services/audit.js";

const loginSchema = z.object({
  identifier: z.string().min(3), // email or mobile
  password: z.string().min(6),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request) => {
    const body = loginSchema.parse(request.body);
    const user = await prisma.user.findFirst({
      where: {
        active: true,
        OR: [{ email: body.identifier }, { mobile: body.identifier }],
      },
    });
    if (!user) {
      throw unauthorized("Invalid credentials");
    }
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) {
      throw unauthorized("Invalid credentials");
    }

    const accessToken = await app.jwt.sign(
      { sub: user.id, role: user.role, typ: "access" },
      { expiresIn: process.env.JWT_ACCESS_TTL ?? "15m" },
    );
    const refreshToken = await app.jwt.sign(
      { sub: user.id, role: user.role, typ: "refresh" },
      {
        expiresIn: process.env.JWT_REFRESH_TTL ?? "7d",
        // Same secret for scaffold; split secrets in production hardening.
      },
    );

    await writeAudit({
      userId: user.id,
      action: "LOGIN",
      entityType: "User",
      entityId: user.id,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    };
  });

  app.get(
    "/auth/me",
    { preHandler: [app.authenticate] },
    async (request) => {
      const u = request.authUser;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        role: u.role,
      };
    },
  );

  /** Dev-only bootstrap: create the first Director if none exists. */
  app.post("/auth/bootstrap-director", async (request) => {
    const existing = await prisma.user.count({ where: { role: "DIRECTOR" } });
    if (existing > 0) {
      throw badRequest("Director already exists; use login or admin user APIs");
    }
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      mobile: z.string().min(8).optional(),
      password: z.string().min(8),
    });
    const body = schema.parse(request.body);
    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        passwordHash,
        role: "DIRECTOR",
      },
    });
    await writeAudit({
      userId: user.id,
      action: "BOOTSTRAP_DIRECTOR",
      entityType: "User",
      entityId: user.id,
      newValues: { email: user.email, role: user.role },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  });
}
