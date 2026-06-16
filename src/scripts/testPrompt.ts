import 'dotenv/config'

import { ragPrompt } from '../prompts/rag.prompt'

async function main() {
  const messages = await ragPrompt.formatMessages({
    context: 'React is a JavaScript library.',
    question: 'What is React?'
  })

  console.log(messages)
}

main()