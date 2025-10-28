import { FastifyInstance } from "fastify";

export async function rootRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return { message: "API running ✅" };
  });

  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
}
