import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware";
import { chatService } from "../services/chatService";

const prisma = new PrismaClient();

export async function messageRoutes(fastify: FastifyInstance) {
  fastify.get("/messages", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const { chatId } = req.query;
      const messages = await prisma.message.findMany({
        where: {
          chat: { userId: req.user.id },
          ...(chatId && { chatId }),
        },
        include: {
          chat: {
            select: {
              id: true,
              userId: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
      return messages;
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      reply.code(500).send({ error: "Erro ao carregar mensagens" });
    }
  });

  fastify.post("/messages", { preHandler: [authMiddleware] }, async (req: any, reply) => {
    try {
      const { content, chatId } = req.body;
      const userId = req.user.id;

      if (!chatId || !content) {
        return reply.code(400).send({ error: "chatId e content são obrigatórios" });
      }

      const chat = await prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat || chat.userId !== userId) {
        return reply.code(403).send({ error: "Acesso negado a este chat" });
      }

      const { userMsg, aiMsg } = await chatService.addMessage(chatId, userId, content);

      return { userMsg, aiMsg };
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      reply.code(500).send({ error: "Erro ao enviar mensagem" });
    }
  });
}
