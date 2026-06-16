import { QdrantVectorStore } from '@langchain/qdrant'

import { embeddings } from './langchain-embeddings.service'

export async function createVectorStore() {
  return await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: 'http://localhost:6333',
      collectionName: 'documents',
    }
  )
}