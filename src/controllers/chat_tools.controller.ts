import { Request, Response } from 'express'
import { runChatWithTools } from '../services/ai.service'
import { saveMessage } from '../services/message.service'
import { searchDocumentsWithQdrant } from '../utils/searchDocuments'

export async function chatControllerWithTools(req: Request, res: Response) {
  const { conversationId, message } = req.body

  await saveMessage(conversationId, 'user', message)

  // const relevantDocs = await searchDocuments(message)
  const relevantDocs = await searchDocumentsWithQdrant(message)

  const context = relevantDocs
    .map((item) => item.document.content)
    .join('\n\n')

  const response = await runChatWithTools([
    {
      role: 'system',
      content: `
        You are an AI assistant.

        Answer ONLY using the provided context.

        If the answer is not present in the context,
        say:

        "I don't have enough information in the knowledge base."

        Context:
        ${context}
      `,
    },
    {
      role: 'user',
      content: message,
    },
  ])

  res.setHeader('Content-Type', 'text/plain')

  await saveMessage(conversationId, 'assistant', response || "")
  res.write(response)

  res.end()
}