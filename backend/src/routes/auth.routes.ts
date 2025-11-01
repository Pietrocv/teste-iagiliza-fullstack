import { FastifyInstance } from "fastify";
import { registerSchema, loginSchema } from "../schemas/authSchemas";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { prisma } from "../plugins/prisma";

export async function authRoutes(app: FastifyInstance) {
  
  app.post("/register", async (request, reply) => {
    try {
      const data = registerSchema.parse(request.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return reply.status(400).send({ error: "Email already registered" });
      }

      const hashed = await hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashed,
        },
        select: { id: true, name: true, email: true },
      });

      const token = generateToken({ id: user.id, email: user.email });

      return reply.status(201).send({
        message: "User created successfully",
        token,
        user,
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      return reply.status(400).send({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/login", async (request, reply) => {
    try {
      const data = loginSchema.parse(request.body);

      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      const valid = await comparePassword(data.password, user.password);

      if (!valid) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      const token = generateToken({ id: user.id, email: user.email });

      return reply.status(200).send({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return reply.status(400).send({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
