import OpenAI from 'openai';

import { executeTool, tools } from '../tools';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResponse(message: string, context: string) {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: `
                You are an AI assistant.

                Use the following context to answer the user's question.
                If the answer is not in the context and no tool can help, say that you don't have enough information.

                Context:
                ${context}
            `,
        },
        {
            role: 'user',
            content: message,
        },
    ];

    const firstResponse = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages,
        tools,
    });

    const assistantMessage = firstResponse.choices[0].message;

    if (!assistantMessage.tool_calls?.length) {
        return assistantMessage.content ?? '';
    }

    messages.push(assistantMessage);

    for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== 'function') {
            continue;
        }

        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments || '{}');

        const result = await executeTool(toolName as never, args);

        messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
        });
    }

    const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages,
    });

    return finalResponse.choices[0].message.content ?? '';
}