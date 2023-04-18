import express from 'express'
import chatController from '../controllers/chat/chatController'

const chatRouter = express.Router()
chatRouter.post('/connectionlist', chatController.connnectionList)
chatRouter.post('/startchat', chatController.startChat)
chatRouter.post('/sendmessage', chatController.sendMessage)

export default chatRouter
