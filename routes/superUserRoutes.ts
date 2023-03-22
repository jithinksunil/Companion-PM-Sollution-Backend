import express from 'express'
import uploadSuperUser from '../config/multer';
import superUseController from "../controllers/superUser/superUserController";
import { superUserSessionCheck } from '../middlewares/superUser/sessionCheck';
import { superUserVerifyToken } from '../middlewares/superUser/tokenVerification';

const superUserRouter=express.Router()
superUserRouter.post('/signup',superUseController.signUp)
superUserRouter.post('/login',superUseController.logIn)
superUserRouter.post('/updateimage/:id',uploadSuperUser.single('file'),superUseController.updateImage)

superUserRouter.use(superUserVerifyToken,superUserSessionCheck)
superUserRouter.get('/verifyToken',superUseController.verifyToken)
superUserRouter.get('/dashboard', superUseController.superUserDashBoard)
superUserRouter.get('/profile',superUseController.superUserProfile)
superUserRouter.get('/connections',superUseController.connections)
superUserRouter.post('/addConnection',superUseController.addConnection)
export default superUserRouter

