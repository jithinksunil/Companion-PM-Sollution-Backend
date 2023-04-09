import express from 'express'
import projectController from "../controllers/projects/projectController";

const projectRouter = express.Router()
projectRouter.get('/', projectController.projects)
projectRouter.post('/create', projectController.createProject)

export default projectRouter
