import { FastifyRequest, FastifyReply } from 'fastify';
import { chatService } from '../services/chatService';
import { messageSchema } from '../schemas/chatSchemas';

export const chatController = {
  async createChat(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const chat = await chatService.createChat(userId);
    return reply.code(201).send(chat);
  },

  async sendMessage(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const chatId = (request.params as any).id;

    const data = messageSchema.parse(request.body);
    const result = await chatService.addMessage(chatId, userId, data.content);

    return reply.code(201).send(result);
  },

  async listMessages(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;
    const chatId = (request.params as any).id;

    const messages = await chatService.getMessages(chatId, userId);
    if (!messages) return reply.code(404).send({ error: 'Chat not found' });

    return reply.send(messages);
  },
};
