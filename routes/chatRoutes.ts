import express from 'express'
import chatController from '../controllers/chat/chatController'

const chatRouter = express.Router()
chatRouter.post('/connectionlist', chatController.connnectionList)

export default chatRouter
