// src/scripts/testRag.ts

import 'dotenv/config'

import { askKnowledgeBase } from '../chains/langchain-rag.chain'

async function main() {
  const result = await askKnowledgeBase(
    'What is Qdrant used for?'
  )

  console.log('\nANSWER:\n')
  console.log(result.answer)

  console.log('\nSOURCES:\n')

  result.docs.forEach((doc, index) => {
    console.log(`Document ${index + 1}`)
    console.log(doc.metadata)
  })
}

main()