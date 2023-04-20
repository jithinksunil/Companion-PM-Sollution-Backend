import express from 'express'
import uploadProjectManager from '../config/multer';
import projectManagerController from "../controllers/projectManager/projectManagerController";
import {projectManagerSessionCheck} from '../middlewares/projectManager/sessionCheck';
import {projectManagerVerifyToken} from '../middlewares/projectManager/tokenVerification';

const projectManagerRouter = express.Router()
projectManagerRouter.post('/signup', projectManagerController.signUp)
projectManagerRouter.post('/login', projectManagerController.logIn)

projectManagerRouter.use(projectManagerVerifyToken, projectManagerSessionCheck)
projectManagerRouter.get('/verifyToken',  projectManagerController.verifyToken)
projectManagerRouter.get('/dashboard',  projectManagerController.projectManagerDashBoard)
projectManagerRouter.get('/profile',  projectManagerController.projectManagerProfile)
projectManagerRouter.post('/updateimage', uploadProjectManager.single('file'), projectManagerController.updateImage)
projectManagerRouter.get('/attendence', projectManagerController.markAttendence)
projectManagerRouter.post('/updateprofile', projectManagerController.updateProfile)

export default projectManagerRouter
