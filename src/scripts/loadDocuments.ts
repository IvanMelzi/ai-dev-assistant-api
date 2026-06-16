import { storeDocument } from '../services/vector.service'

async function main() {
  await storeDocument(
    'React is a JavaScript library for building user interfaces.'
  )

  await storeDocument(
    'TypeScript adds static typing to JavaScript.'
  )

  await storeDocument(
    'Qdrant is a vector database used for similarity search.'
  )

  console.log('Documents inserted')
}

main()