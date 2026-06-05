import { prisma } from '../db/prisma'
import { generateEmbedding } from './embedding.service'

export async function createDocument(
  title: string,
  content: string,
) {

    const embedding =
        await generateEmbedding(content)

  return prisma.document.create({
    data: {
      title,
      content,
      embedding: JSON.stringify(embedding),
    },
  })
}

export async function getDocuments() {
  return prisma.document.findMany()
}

export async function getRelevantDocuments(
  question: string,
) {
  const docs = await prisma.document.findMany()

  return docs.filter((doc) =>
    doc.content
      .toLowerCase()
      .includes(question.toLowerCase())
  )
}