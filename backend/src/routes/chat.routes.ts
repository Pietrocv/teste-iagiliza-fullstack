import { FastifyInstance } from 'fastify';
import { chatController } from '../controllers/chatController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function chatRoutes(app: FastifyInstance) {
  app.post('/chats', { preHandler: [authMiddleware] }, chatController.createChat);
  app.post('/chats/:id/messages', { preHandler: [authMiddleware] }, chatController.sendMessage);
  app.get('/chats/:id/messages', { preHandler: [authMiddleware] }, chatController.listMessages);
}
