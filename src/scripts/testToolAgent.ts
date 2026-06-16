import { toolAgent } from "../agents/tool.agent"

async function main() {
  console.log(
    await toolAgent.invoke({
      input: 'What time is it?',
    })
  )

  console.log(
    await toolAgent.invoke({
      input: 'What is React?',
    })
  )
}

main()