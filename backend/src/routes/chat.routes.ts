import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.get("/chats", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const chats = await prisma.chat.findMany({
        where: { userId: req.user.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return chats;
    } catch (error) {
      reply.code(500).send({ error: "Erro ao carregar chats" });
    }
  });

  fastify.get("/chats/:id", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const { id } = req.params;
      const chat = await prisma.chat.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      if (!chat || chat.userId !== req.user.id) {
        return reply.code(403).send({ error: "Acesso negado a este chat" });
      }
      return chat;
    } catch (error) {
      reply.code(500).send({ error: "Erro ao carregar chat" });
    }
  });

  fastify.post("/chats", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const chat = await prisma.chat.create({
        data: {
          userId: req.user.id,
        },
      });
      return chat;
    } catch (error) {
      reply.code(500).send({ error: "Erro ao criar chat" });
    }
  });

  fastify.delete("/chats/:id", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const { id } = req.params;
      const chat = await prisma.chat.findUnique({ where: { id } });
      if (!chat || chat.userId !== req.user.id) {
        return reply.code(403).send({ error: "Acesso negado a este chat" });
      }
      await prisma.chat.delete({ where: { id } });
      return { message: "Chat deletado com sucesso" };
    } catch (error) {
      reply.code(500).send({ error: "Erro ao deletar chat" });
    }
  });
}
