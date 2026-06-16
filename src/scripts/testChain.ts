import 'dotenv/config'

import { ragChain } from '../chains/rag.chain'

async function main() {
  const response = await ragChain.invoke({
    context: 'React is a JavaScript library.',
    question: 'What is React?',
  })

  console.log(response.content)
}

main()