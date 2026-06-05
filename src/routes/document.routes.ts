import { Router } from 'express'
import { createDocument, getDocuments } from '../services/document.service'

const router = Router()

router.post('/', async (req, res) => {
  const { title, content } = req.body

  const document = await createDocument(title, content)

  res.status(201).json(document)
})

router.get('/', async (_req, res) => {
  const document = await getDocuments()

  res.json(document)
})

export default router