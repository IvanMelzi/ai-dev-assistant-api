import { qdrant } from "../config/qdrant"
import { prisma } from "../db/prisma"
import { generateEmbedding } from "../services/embedding.service"
import { cosineSimilarity } from "./cosineSimilarity"

const COLLECTION = 'documents'

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

export async function searchDocumentsWithQdrant(query: string) {
  const queryEmbedding = await generateEmbedding(query)

  const results = await qdrant.search(COLLECTION, {
    vector: queryEmbedding,
    limit: 3,
    with_payload: true,
  })

  return results
    .filter((result) => result.score > 0.7)
    .map((result) => ({
      score: result.score,
      document: {
        content: result.payload?.content,
      },
    }))
}