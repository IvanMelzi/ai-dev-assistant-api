import { Request, Response } from 'express'
import { streamChat } from '../services/ai.service'
import { saveMessage } from '../services/message.service'
import { planUserRequest } from '../services/planner.service'
import { buildContext } from '../services/context-builder.service'
import { runAgent } from '../services/agent.service'

export async function chatController(req: Request, res: Response) {
  const { conversationId, message } = req.body

  await saveMessage(conversationId, 'user', message)

  const plan = await planUserRequest(message)

  console.log('Planner result:', plan)

  const context = await buildContext(
    plan,
    message,
  )

  const stream = await streamChat([
    {
      role: 'system',
      content: `
    You are an AI assistant.

    Planner action:
    ${plan.action}

    Planner reason:
    ${plan.reason}

    Retrieved Context:
    ${context}
      `,
    },
    {
      role: 'user',
      content: message,
    },
  ])

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Transfer-Encoding', 'chunked')

  const response = await runAgent(conversationId, message)

  await saveMessage(conversationId, 'user', message)
  await saveMessage(conversationId, 'assistant', response)

  console.log(response)

  let fullResponse = ''

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''

    fullResponse += content

    res.write(content)
  }

  await saveMessage(conversationId, 'assistant', fullResponse)

  res.end()
}