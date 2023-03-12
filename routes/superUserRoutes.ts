import express from 'express'
import superUseController from "../controllers/superUserController";

const superUserRouter=express.Router()

superUserRouter.get('/',superUseController.backend)
superUserRouter.post('/signup',superUseController.signUp)

export default superUserRouter
