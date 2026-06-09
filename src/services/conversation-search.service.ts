import { prisma } from "../db/prisma";

export async function searchConversationMessages(
  query: string,
  limit = 20,
) {
  return prisma.message.findMany({
    where: {
      content: {
        contains: query,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}