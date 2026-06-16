import { ChatPromptTemplate } from '@langchain/core/prompts'

export const ragPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
You are an AI assistant.

Answer ONLY using the provided context.

If the answer is not present in the context, say:
"I don't have enough information in the knowledge base."
`,
  ],
  [
    'user',
    `
Context:
{context}

Question:
{question}
`,
  ],
])