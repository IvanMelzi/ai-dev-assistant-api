import { StateGraph, START, END } from '@langchain/langgraph'

type AgentState = {
  input: string
  output?: string
}

async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
  return {
    output: `You said: ${state.input}`,
  }
}

export const simpleAgent = new StateGraph<AgentState>({
  channels: {
    input: null,
    output: null,
  },
})
  .addNode('agent', agentNode)
  .addEdge(START, 'agent')
  .addEdge('agent', END)
  .compile()