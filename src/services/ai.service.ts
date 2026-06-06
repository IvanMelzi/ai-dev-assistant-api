import { openai } from '../ai/openai'
import type { ChatCompletionTool } from 'openai/resources/chat/completions'
import { getConversationsTool } from '../tools/conversation'

const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getConversations',
      description: 'Get all conversations',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
]

export async function streamChat(messages: any[]) {
  return openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    stream: true,
    messages,
  })
}

export async function runChatWithTools(messages: any[]) {
  const firstResponse = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages,
    tools,
  })

  const assistantMessage = firstResponse.choices[0].message
  const toolCall = assistantMessage.tool_calls?.[0]

  if (
    toolCall?.type === 'function' &&
    toolCall.function.name === 'getConversations'
  ) {
    const conversations = await getConversationsTool()

    const secondResponse = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        ...messages,
        assistantMessage,
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: conversations,
        },
      ],
    })

    return secondResponse.choices[0].message.content
  }

  return assistantMessage.content
}