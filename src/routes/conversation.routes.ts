import { Router } from 'express'
import { createConversation, getConversation } from '../services/conversation.service'

const router = Router()

router.post('/', async (_req, res) => {
  const conversation = await createConversation()

  res.json(conversation)
})

router.get('/:id', async (req, res) => {
  const conversation = await getConversation(req.params.id)

  res.json(conversation)
})

export default router