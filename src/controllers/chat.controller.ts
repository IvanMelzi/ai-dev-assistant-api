import { Request, Response } from 'express'
import { streamChat } from '../services/ai.service'
import { saveMessage } from '../services/message.service'

export async function chatController(req: Request, res: Response) {
  const { conversationId, message } = req.body

  await saveMessage(conversationId, 'user', message)

  const stream = await streamChat([
    {
      role: 'user',
      content: message,
    },
  ])

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Transfer-Encoding', 'chunked')

  let assistantResponse = ''

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content

    if (content) {
      assistantResponse += content
      res.write(content)
    }
  }

  await saveMessage(conversationId, 'assistant', assistantResponse)

  res.end()
}