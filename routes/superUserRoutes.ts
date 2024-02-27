import express from 'express'
import uploadSuperUser from '../config/multer';
import superUseController from "../controllers/superUser/superUserController";
import {superUserVerifyToken} from '../middlewares/superUser/tokenVerification';

const superUserRouter = express.Router()
superUserRouter.post('/signup', superUseController.signUp)
superUserRouter.post('/login', superUseController.logIn)
superUserRouter.get('/login/guest', superUseController.guestLogin)
superUserRouter.get('/logout', superUseController.logout)

superUserRouter.get('/verifyToken', superUserVerifyToken, superUseController.verifyToken)
superUserRouter.get('/dashboard', superUserVerifyToken, superUseController.superUserDashBoard)
superUserRouter.get('/profile', superUserVerifyToken, superUseController.superUserProfile)
superUserRouter.post('/updateimage', superUserVerifyToken,uploadSuperUser.single('file'), superUseController.updateImage)
superUserRouter.post('/updateprofile', superUserVerifyToken, superUseController.updateProfile)
superUserRouter.get('/connections', superUseController.connections)
superUserRouter.get('/siteengineerlist', superUseController.siteEngineerList)
superUserRouter.post('/updatesiteengineerassignment', superUseController.siteEngineerAssignment)
superUserRouter.post('/updateprojectassignment', superUserVerifyToken, superUseController.updateProjectAssingment)
superUserRouter.post('/addConnection', superUserVerifyToken, superUseController.addConnection)
superUserRouter.post('/paymentcomplete', superUserVerifyToken, superUseController.paymentComplete)

export default superUserRouter
