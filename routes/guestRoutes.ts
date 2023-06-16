import express from 'express'
import { login,dashboard } from '../controllers/guest/guestController'
import { guestVerifyToken } from '../middlewares/guest/tokenVerification'
const guestRouter=express.Router()
guestRouter.get('/login',login)
guestRouter.use(guestVerifyToken)
guestRouter.get('/dashboard',dashboard)
export default guestRouter