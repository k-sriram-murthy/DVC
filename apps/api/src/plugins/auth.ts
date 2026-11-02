import fp from "fastify-plugin";
import fjwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { unauthorized } from "../lib/errors.js";

export type AuthUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string | null;
  mobile: string | null;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: UserRole; typ: "access" | "refresh" };
    user: { sub: string; role: UserRole; typ: "access" | "refresh" };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    authUser: AuthUser;
  }
}

export const authPlugin = fp(async (app) => {
  await app.register(fjwt, {
    secret: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret",
  });

  app.decorate("authenticate", async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      const payload = await request.jwtVerify<{ sub: string; role: UserRole; typ: string }>();
      if (payload.typ !== "access") {
        throw unauthorized("Invalid token type");
      }
      const user = await prisma.user.findFirst({
        where: { id: payload.sub, active: true },
        select: { id: true, role: true, name: true, email: true, mobile: true },
      });
      if (!user) {
        throw unauthorized("User not found or inactive");
      }
      // Role always comes from DB, never from a client picker.
      request.authUser = user;
    } catch (err) {
      if (err instanceof Error && "statusCode" in err) throw err;
      throw unauthorized("Invalid or expired token");
    }
  });
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
