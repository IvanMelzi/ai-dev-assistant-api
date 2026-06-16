import { StateGraph, START, END } from '@langchain/langgraph'

import { model } from '../services/langchain-chat.service'

type AgentState = {
  input: string
  output?: string
}

async function agentNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const response = await model.invoke(state.input)

  return {
    output: String(response.content),
  }
}

export const llmAgent = new StateGraph<AgentState>({
  channels: {
    input: null,
    output: null,
  },
})
  .addNode('agent', agentNode)
  .addEdge(START, 'agent')
  .addEdge('agent', END)
  .compile()