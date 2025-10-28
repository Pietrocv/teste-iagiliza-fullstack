import Fastify from "fastify";
import cors from "@fastify/cors";
import prisma from "./plugins/prisma";
import { rootRoutes } from "./routes/root.routes";

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: true });
  app.register(prisma);
  app.register(rootRoutes);
  return app;
}
