import * as jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET não carregado no ambiente!');
      return reply.status(500).send({ error: 'Configuração do servidor ausente (JWT_SECRET)' });
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    (request as any).user = decoded;
  } catch (err) {
    console.error('Erro no JWT:', err);
    return reply.status(401).send({ error: 'Token inválido' });
  }
}
