import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get("/profile", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return reply.code(404).send({ error: "Usuário não encontrado" });
      }

      return user;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      reply.code(500).send({ error: "Erro ao buscar perfil" });
    }
  });

  fastify.put("/profile", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return reply.code(400).send({ error: "Nome e e-mail são obrigatórios" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { name, email },
        select: { id: true, name: true, email: true },
      });

      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      reply.code(500).send({ error: "Erro ao atualizar perfil" });
    }
  });
}
