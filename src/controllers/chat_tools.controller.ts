import { Request, Response } from 'express'
import { runChatWithTools, streamChat } from '../services/ai.service'
import { saveMessage } from '../services/message.service'
import { searchDocuments } from '../utils/searchDocuments'

export async function chatControllerWithTools(req: Request, res: Response) {
  const { conversationId, message } = req.body

  await saveMessage(conversationId, 'user', message)

  const relevantDocs = await searchDocuments(message)

  const context = relevantDocs
    .map((item) => item.document.content)
    .join('\n\n')

  const response = await runChatWithTools([
    {
      role: 'system',
      content: `
        You are an AI assistant.

        Use the following context to answer the user's question.
        If the answer is not in the context, say that you don't have enough information.

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