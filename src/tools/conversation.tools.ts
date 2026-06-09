import { prisma } from "../db/prisma";

export async function getRecentConversations() {
  return prisma.conversation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}

export async function getConversationMessages(conversationId: string) {
  return prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}