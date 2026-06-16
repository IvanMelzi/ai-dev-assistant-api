import { ragPrompt } from '../prompts/rag.prompt'
import { model } from '../services/langchain-chat.service'

export const ragChain = ragPrompt.pipe(model)