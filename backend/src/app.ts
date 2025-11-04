import Fastify from "fastify";
import cors from "@fastify/cors";
import { prismaPlugin } from "./plugins/prisma";
import { rootRoutes } from "./routes/root.routes";
import { authRoutes } from "./routes/auth.routes";
import { profileRoutes } from './routes/profile.routes';
import { chatRoutes } from './routes/chat.routes';
import { messageRoutes } from "./routes/message.routes";


export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(prismaPlugin);
  app.register(rootRoutes);
  app.register(authRoutes);
  app.register(chatRoutes);
  app.register(messageRoutes);
  app.register(profileRoutes);
  return app;
}
