import { searchDocuments } from '../utils/searchDocuments'
import { searchConversationMessages } from './conversation-search.service'

export const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'search_documents',
      description: 'Search relevant information from indexed documents.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find relevant documents.',
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'search_conversations',
      description: 'Search previous conversation messages from the database.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find previous messages.',
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
    },
  },
]

export async function executeToolCall(
  name: string,
  args: { query: string },
) {
  switch (name) {
    case 'search_documents': {
      const docs = await searchDocuments(args.query)

      return docs.map((doc) => ({
        content: doc.document.content,
      }))
    }

    case 'search_conversations': {
      const messages = await searchConversationMessages(args.query)

      return messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
      }))
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}