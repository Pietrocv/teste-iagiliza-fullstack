import Fastify from "fastify";
import cors from "@fastify/cors";
import { prismaPlugin } from "./plugins/prisma";
import { rootRoutes } from "./routes/root.routes";
import { authRoutes } from "./routes/auth.routes";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(prismaPlugin);
  app.register(rootRoutes);
  app.register(authRoutes);

  return app;
}
