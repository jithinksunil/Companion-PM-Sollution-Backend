import express from 'express'
import taskController from '../controllers/tasks/taskController'
const taskRouter = express.Router()
taskRouter.get('/', taskController.tasks)
taskRouter.post('/updateTaskAssignment', taskController.taskAssignment)
taskRouter.post('/add', taskController.add)

export default taskRouter
