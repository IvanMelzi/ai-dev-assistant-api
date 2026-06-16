import 'dotenv/config'

import { createVectorStore } from '../services/langchain-qdrant.service'

async function main() {
  const vectorStore = await createVectorStore()

  const retriever = vectorStore.asRetriever(3)

  const docs = await retriever.invoke(
    'What is Qdrant used for?'
  )

  console.log(docs)
}

main()