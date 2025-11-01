import { prisma } from '../plugins/prisma';

function generateAIResponse(userMessage: string): string {
  const responses = [
    "Interessante! Conte mais.",
    "Não tenho certeza, mas parece legal!",
    "Hmm, e se tentássemos outra abordagem?",
    "Entendi parcialmente. Você pode explicar melhor?",
  ];

  const random = Math.floor(Math.random() * responses.length);
  return responses[random];
}

export const chatService = {
  async createChat(userId: string) {
    const chat = await prisma.chat.create({
      data: { userId },
      select: { id: true, createdAt: true },
    });
    return chat;
  },

  async addMessage(chatId: string, userId: string, content: string) {
    const userMsg = await prisma.message.create({
      data: {
        chatId,
        content,
        role: 'user',
      },
    });

    // Gera resposta da IA simulada
    const aiResponse = generateAIResponse(content);

    const aiMsg = await prisma.message.create({
      data: {
        chatId,
        content: aiResponse,
        role: 'assistant',
      },
    });

    return { userMsg, aiMsg };
  },

  async getMessages(chatId: string, userId: string) {
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chat) return null;
    return chat.messages;
  },
};
