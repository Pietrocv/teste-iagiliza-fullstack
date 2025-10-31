import { prisma } from '../plugins/prisma';
import { updateProfileSchema } from '../schemas/userSchemas';
import { FastifyRequest, FastifyReply } from 'fastify';

export const profileController = {
  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }

    return reply.send(user);
  },

  async updateMe(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;

    const data = updateProfileSchema.parse(request.body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true },
    });

    return reply.send(updatedUser);
  },
};
