import { prisma } from '../db/prisma'

export async function saveMessage(
  conversationId: string,
  role: string,
  content: string,
) {
  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  })
}