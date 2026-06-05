import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import chatRoutes from './routes/chat.routes'
import conversationRoutes from './routes/conversation.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/chat', chatRoutes)
app.use('/conversations', conversationRoutes)
app.use('/conversations/:id', conversationRoutes)

app.listen(3000, () => {
  console.log('AI API running on port 3000')
})