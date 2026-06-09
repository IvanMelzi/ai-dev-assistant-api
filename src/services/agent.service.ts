import OpenAI from 'openai'
import { tools, executeToolCall } from './tools.service'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function runAgent(message: string) {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `
You are an AI assistant.

Use tools whenever they help answer the question.
`,
    },
    {
      role: 'user',
      content: message,
    },
  ]

  const firstResponse =
    await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      tools,
    })

  const assistantMessage =
    firstResponse.choices[0].message

  messages.push(assistantMessage)

  const toolCalls =
    assistantMessage.tool_calls || []

    if (toolCalls.length === 0) {
        return assistantMessage.content || ''
    }

  for (const toolCall of toolCalls) {

    if (toolCall.type !== 'function') {
        continue;
    }

    const toolName =
      toolCall.function.name

    const args = JSON.parse(
      toolCall.function.arguments,
    )

    const result =
      await executeToolCall(
        toolName,
        args,
      )

    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(result),
    })
  }

  const finalResponse =
    await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
    })

  return (
    finalResponse.choices[0].message.content ||
    ''
  )
}