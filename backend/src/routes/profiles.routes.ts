import { FastifyInstance } from 'fastify';
import { profileController } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/me', { preHandler: [authMiddleware] }, profileController.getMe);
  app.patch('/me', { preHandler: [authMiddleware] }, profileController.updateMe);
}
