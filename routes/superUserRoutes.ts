import express from 'express'
import uploadSuperUser from '../config/multer';
import superUseController from "../controllers/superUser/superUserController";
import {superUserSessionCheck} from '../middlewares/superUser/sessionCheck';
import {superUserVerifyToken} from '../middlewares/superUser/tokenVerification';

const superUserRouter = express.Router()
superUserRouter.post('/signup', superUseController.signUp)
superUserRouter.post('/login', superUseController.logIn)
superUserRouter.get('/login/guest', superUseController.guestLogin)
superUserRouter.get('/logout', superUseController.logout)

superUserRouter.get('/verifyToken', superUserVerifyToken, superUserSessionCheck, superUseController.verifyToken)
superUserRouter.get('/dashboard', superUserVerifyToken, superUserSessionCheck, superUseController.superUserDashBoard)
superUserRouter.get('/profile', superUserVerifyToken, superUserSessionCheck, superUseController.superUserProfile)
superUserRouter.post('/updateimage', superUserVerifyToken, superUserSessionCheck,uploadSuperUser.single('file'), superUseController.updateImage)
superUserRouter.post('/updateprofile', superUserVerifyToken, superUserSessionCheck, superUseController.updateProfile)
superUserRouter.get('/connections', superUseController.connections)
superUserRouter.get('/siteengineerlist', superUseController.siteEngineerList)
superUserRouter.post('/updatesiteengineerassignment', superUseController.siteEngineerAssignment)
superUserRouter.post('/updateprojectassignment', superUserVerifyToken, superUserSessionCheck, superUseController.updateProjectAssingment)
superUserRouter.post('/addConnection', superUserVerifyToken, superUserSessionCheck, superUseController.addConnection)
superUserRouter.post('/paymentcomplete', superUserVerifyToken, superUserSessionCheck, superUseController.paymentComplete)

export default superUserRouter
