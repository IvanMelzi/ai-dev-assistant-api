import { openai } from '../ai/openai'

export async function streamChat(messages: any[]) {
  return openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    stream: true,
    messages,
  })
}