import OpenAI from 'openai'
import { tools, executeToolCall } from './tools.service'
import { getConversationHistory } from './conversation-history.service'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function runAgent(conversationId: string, message: string) {

  const history = await getConversationHistory(conversationId)

const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: `
You are an AI assistant.

Use recent conversation history to answer follow-up questions.
Use tools whenever they help answer the question.
`,
  },
  ...history.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  })),
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