import {
    getConversationMessages,
    getRecentConversations,
} from './conversation.tools';

type ToolName = 'getRecentConversations' | 'getConversationMessages';

type ToolArguments = {
    conversationId?: string;
};

export const tools = [
    {
        type: 'function' as const,
        function: {
            name: 'getRecentConversations',
            description: 'Get the most recent conversations from the database',
            parameters: {
                type: 'object',
                properties: {},
                required: [],
            },
        },
    },
    {
        type: 'function' as const,
        function: {
            name: 'getConversationMessages',
            description: 'Get all messages from a specific conversation',
            parameters: {
                type: 'object',
                properties: {
                    conversationId: {
                        type: 'string',
                        description: 'The conversation id',
                    },
                },
                required: ['conversationId'],
            },
        },
    },
];

export async function executeTool(
    toolName: ToolName,
    args: ToolArguments,
) {
    if (toolName === 'getRecentConversations') {
        return getRecentConversations();
    }

    if (toolName === 'getConversationMessages') {
        if (!args.conversationId) {
            throw new Error('conversationId is required');
        }

        return getConversationMessages(args.conversationId);
    }

    throw new Error(`Tool ${toolName} not found`);
}