import { Request, Response } from 'express';

import { generateResponse } from '../services/chat.service';
import { saveMessage } from '../services/message.service';
import { searchDocuments } from '../utils/searchDocuments';

export async function chatController(req: Request, res: Response) {
    const { conversationId, message } = req.body;

    await saveMessage(conversationId, 'user', message);

    const relevantDocs = await searchDocuments(message);

    const context = relevantDocs
        .map((item) => item.document.content)
        .join('\n\n');

    const assistantResponse = await generateResponse(message, context);

    await saveMessage(conversationId, 'assistant', assistantResponse);

    res.json({
        message: assistantResponse,
    });
}