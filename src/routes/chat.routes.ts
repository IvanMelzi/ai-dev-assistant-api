import { Router } from 'express'
import { chatController } from '../controllers/chat.controller'
import { chatControllerWithTools } from '../controllers/chat_tools.controller'

const router = Router()

router.post('/', chatController)
router.post('/tools', chatControllerWithTools)

export default router