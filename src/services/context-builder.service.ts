import { searchDocuments } from '../utils/searchDocuments'
import { searchConversationMessages } from './conversation-search.service'
import { PlannerResult } from './planner.service'

export async function buildContext(
  plan: PlannerResult,
  message: string,
) {
  switch (plan.action) {
    case 'SEARCH_DOCUMENTS': {
      const docs = await searchDocuments(
        plan.query || message,
      )

      return docs
        .map((doc) => doc.document.content)
        .join('\n\n')
    }

    case 'SEARCH_CONVERSATIONS': {
      const messages = await searchConversationMessages(
        plan.query || message,
      )

      return messages
        .map(
          (msg) =>
            `[${msg.role}] ${msg.content}`,
        )
        .join('\n')
    }

    default:
      return ''
  }
}