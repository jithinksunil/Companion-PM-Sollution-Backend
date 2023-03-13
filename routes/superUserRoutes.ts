import express from 'express'
import superUseController from "../controllers/superUserController";
import { superUserSessionCheck } from '../middlewares/sessionCheck';
import { superUserVerifyToken } from '../middlewares/tokenVerification';

const superUserRouter=express.Router()

superUserRouter.get('/verifyToken',superUserVerifyToken,superUserSessionCheck ,superUseController.verifyToken)
superUserRouter.post('/signup',superUseController.signUp)
superUserRouter.post('/login',superUseController.logIn)
superUserRouter.get('/profile',superUserVerifyToken, superUserSessionCheck, superUseController.superUserProfile)

export default superUserRouter

