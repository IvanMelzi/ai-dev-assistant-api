import { simpleAgent } from '../agents/simple-agent'

async function main() {
  const result = await simpleAgent.invoke({
    input: 'Hello agent',
  })

  console.log(result)
}

main()