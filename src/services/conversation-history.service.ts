import { prisma } from "../db/prisma"

export async function getConversationHistory(
  conversationId: string,
  limit = 20,
) {
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })

  return messages.reverse()
}