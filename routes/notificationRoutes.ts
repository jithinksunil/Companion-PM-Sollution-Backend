import express from 'express'
import notificationController from '../controllers/notifications/notificationController'
const notificationRouter = express.Router()
notificationRouter.post('/', notificationController.notifications)
notificationRouter.post('/create', notificationController.create)

export default notificationRouter
