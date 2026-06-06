import { getConversations } from "../services/conversation.service"

export async function getConversationsTool() {
  const conversations =
    await getConversations()

  return JSON.stringify(conversations)
}