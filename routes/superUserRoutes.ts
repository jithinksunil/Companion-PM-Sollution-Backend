import express from 'express'
import superUseController from "../controllers/superUser/superUserController";
import { superUserSessionCheck } from '../middlewares/superUser/sessionCheck';
import { superUserVerifyToken } from '../middlewares/superUser/tokenVerification';

const superUserRouter=express.Router()

superUserRouter.get('/verifyToken',superUserVerifyToken,superUserSessionCheck ,superUseController.verifyToken)
superUserRouter.post('/signup',superUseController.signUp)
superUserRouter.post('/login',superUseController.logIn)
superUserRouter.get('/dashboard',superUserVerifyToken, superUserSessionCheck, superUseController.superUserDashBoard)
superUserRouter.get('/profile',superUserVerifyToken, superUserSessionCheck, superUseController.superUserProfile)

export default superUserRouter

