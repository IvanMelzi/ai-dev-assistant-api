import { qdrant } from '../config/qdrant'

async function main() {
  await qdrant.createCollection('documents', {
    vectors: {
      size: 1536,
      distance: 'Cosine',
    },
  })

  console.log('Collection created')
}

main()