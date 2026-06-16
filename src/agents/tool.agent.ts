import { Annotation, END, START, StateGraph } from '@langchain/langgraph'

import { model } from '../services/langchain-chat.service'
import { getCurrentTime } from '../tools/time.tool'

const ToolAgentState = Annotation.Root({
  input: Annotation<string>,
  output: Annotation<string | undefined>,
  route: Annotation<string | undefined>,
})

type ToolAgentStateType = typeof ToolAgentState.State

async function routerNode(
  state: ToolAgentStateType
): Promise<Partial<ToolAgentStateType>> {
  const response = await model.invoke(`
You are a router.

Return ONLY one word:
tool
or
llm

Use "tool" only when the user asks about the current time or current date.
Use "llm" for everything else.

Question:
${state.input}
`)

  return {
    route: String(response.content).trim().toLowerCase(),
  }
}

async function toolNode(): Promise<Partial<ToolAgentStateType>> {
  return {
    output: await getCurrentTime(),
  }
}

async function llmNode(
  state: ToolAgentStateType
): Promise<Partial<ToolAgentStateType>> {
  const response = await model.invoke(state.input)

  return {
    output: String(response.content),
  }
}

export const toolAgent = new StateGraph(ToolAgentState)
  .addNode('router', routerNode)
  .addNode('tool', toolNode)
  .addNode('llm', llmNode)
  .addEdge(START, 'router')
  .addConditionalEdges('router', (state) =>
    state.route === 'tool' ? 'tool' : 'llm'
  )
  .addEdge('tool', END)
  .addEdge('llm', END)
  .compile()