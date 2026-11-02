import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authPlugin } from "./plugins/auth.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { projectRoutes } from "./routes/projects.js";
import { AppError } from "./lib/errors.js";
import { ZodError } from "zod";

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? true,
});
await app.register(authPlugin);

await app.register(healthRoutes);
await app.register(authRoutes);
await app.register(projectRoutes);

app.setErrorHandler((err, _request, reply) => {
  if (err instanceof ZodError) {
    return reply.status(400).send({
      error: "VALIDATION_ERROR",
      message: "Invalid request",
      details: err.flatten(),
    });
  }
  if (err instanceof AppError) {
    return reply.status(err.statusCode).send({
      error: err.code ?? "APP_ERROR",
      message: err.message,
    });
  }
  app.log.error(err);
  return reply.status(500).send({
    error: "INTERNAL_ERROR",
    message: "Something went wrong",
  });
});

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

await app.listen({ port, host });
app.log.info(`DVC API listening on http://${host}:${port}`);
