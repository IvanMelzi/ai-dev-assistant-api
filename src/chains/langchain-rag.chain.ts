import { ragPrompt } from '../prompts/rag.prompt'
import { model } from '../services/langchain-chat.service'
import { createVectorStore } from '../services/langchain-qdrant.service'

export async function askKnowledgeBase(
  question: string
) {
  const vectorStore = await createVectorStore()

  const retriever = vectorStore.asRetriever(3)

  const docs = await retriever.invoke(question)

  const context = docs
    .map((doc) => doc.pageContent)
    .join('\n\n')

  const response = await ragPrompt
    .pipe(model)
    .invoke({
      context,
      question,
    })

  return {
    answer: response.content,
    docs,
  }
}