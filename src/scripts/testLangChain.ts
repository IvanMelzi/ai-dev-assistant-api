import 'dotenv/config'

import { model } from '../services/langchain-chat.service'

async function main() {
  const response = await model.invoke(
    'What is React?'
  )

  console.log(response.content)
}

main()