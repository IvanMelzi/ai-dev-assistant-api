import 'dotenv/config'
import { searchDocumentsWithQdrant } from '../utils/searchDocuments'

async function main() {
  const results = await searchDocumentsWithQdrant('What is Qdrant used for?')

  console.log(JSON.stringify(results, null, 2))
}

main()