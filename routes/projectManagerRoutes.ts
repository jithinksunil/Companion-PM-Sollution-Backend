import express from 'express'
import uploadProjectManager from '../config/multer';
import projectManagerController from "../controllers/projectManager/projectManagerController";
import { projectManagerSessionCheck } from '../middlewares/projectManager/sessionCheck';
import { projectManagerVerifyToken } from '../middlewares/projectManager/tokenVerification';

const projectManagerRouter=express.Router()
projectManagerRouter.get('/verifyToken',projectManagerVerifyToken,projectManagerSessionCheck,projectManagerController.verifyToken)
projectManagerRouter.post('/signup',projectManagerController.signUp)
projectManagerRouter.post('/login',projectManagerController.logIn)
projectManagerRouter.get('/dashboard',projectManagerVerifyToken,projectManagerSessionCheck, projectManagerController.projectManagerDashBoard)
projectManagerRouter.get('/profile',projectManagerVerifyToken,projectManagerSessionCheck,projectManagerController.projectManagerProfile)
projectManagerRouter.post('/updateimage/:id',uploadProjectManager.single('file'),projectManagerController.updateImage)
projectManagerRouter.get('/connections',projectManagerVerifyToken,projectManagerSessionCheck,projectManagerController.connections)
export default projectManagerRouter

