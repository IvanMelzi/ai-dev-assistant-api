import { randomUUID } from 'crypto'
import { qdrant } from '../config/qdrant'
import { generateEmbedding } from './embedding.service'

const COLLECTION = 'documents'

export async function storeDocument(content: string) {
  const embedding = await generateEmbedding(content)

  await qdrant.upsert(COLLECTION, {
    wait: true,
    points: [
      {
        id: randomUUID(),
        vector: embedding,
        payload: {
          content,
        },
      },
    ],
  })
}