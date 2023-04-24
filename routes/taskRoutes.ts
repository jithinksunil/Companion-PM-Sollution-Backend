import express from 'express'
import taskController from '../controllers/tasks/taskController'
const taskRouter = express.Router()
taskRouter.get('/', taskController.tasks)
taskRouter.post('/updatetaskassignment', taskController.taskAssignment)
taskRouter.post('/create', taskController.create)

export default taskRouter
