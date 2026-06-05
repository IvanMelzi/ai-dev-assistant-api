import { prisma } from "../db/prisma"
import { generateEmbedding } from "../services/embedding.service"
import { cosineSimilarity } from "./cosineSimilarity"

export async function searchDocuments(
  question: string,
) {
  const questionEmbedding =
    await generateEmbedding(question)

  const documents =
    await prisma.document.findMany()

  const scoredDocuments = documents.map(
    (document) => {
      const embedding = JSON.parse(
        document.embedding ?? '[]'
      )

      const score = cosineSimilarity(
        questionEmbedding,
        embedding,
      )

      return {
        document,
        score,
      }
    },
  )

  return scoredDocuments
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}