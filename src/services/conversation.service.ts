import { prisma } from '../db/prisma'

export async function createConversation() {
  return prisma.conversation.create({
    data: {},
  })
}

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: {
      id,
    },
    include: {
      messages: true,
    },
  })
}

export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: {
      createdAt: 'desc',
    },
        include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        take: 1,
      },
    },
  })
}