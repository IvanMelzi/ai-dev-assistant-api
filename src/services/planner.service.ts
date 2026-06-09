import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type PlannerAction =
  | 'ANSWER_DIRECTLY'
  | 'SEARCH_DOCUMENTS'
  | 'SEARCH_CONVERSATIONS'
  | 'CREATE_TASK'
  | 'ASK_CLARIFICATION'

export type PlannerResult = {
  action: PlannerAction
  reason: string
  query?: string
}

export async function planUserRequest(message: string): Promise<PlannerResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `
You are a planner agent.

Your job is to decide the best next action for the user's message.

Available actions:
- ANSWER_DIRECTLY: Use when the question can be answered without external context.
- SEARCH_DOCUMENTS: Use when the user asks something that may be in uploaded or indexed documents.
- SEARCH_CONVERSATIONS: Use when the user asks about previous conversations or history.
- CREATE_TASK: Use when the user asks to create, schedule, or remember a task.
- ASK_CLARIFICATION: Use when the request is unclear.

Return only valid JSON with this shape:
{
  "action": "ACTION_NAME",
  "reason": "short explanation",
  "query": "optional search query"
}
        `,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    response_format: {
      type: 'json_object',
    },
  })

  const content = response.choices[0]?.message?.content

  if (!content) {
    return {
      action: 'ANSWER_DIRECTLY',
      reason: 'No planner response was returned.',
    }
  }

  return JSON.parse(content) as PlannerResult
}