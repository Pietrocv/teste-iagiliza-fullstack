import Fastify from "fastify";
import cors from "@fastify/cors";
import { prismaPlugin } from "./plugins/prisma";
import { rootRoutes } from "./routes/root.routes";
import { authRoutes } from "./routes/auth.routes";
import { profileRoutes } from './routes/profiles.routes';
import { chatRoutes } from './routes/chat.routes';


export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(prismaPlugin);
  app.register(rootRoutes);
  app.register(authRoutes);
  app.register(profileRoutes);
  app.register(chatRoutes);
  return app;
}
