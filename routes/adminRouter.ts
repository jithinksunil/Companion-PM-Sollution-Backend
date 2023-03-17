import express from 'express'
import adminController from "../controllers/admin/adminController";
import { adminSessionCheck } from '../middlewares/admin/sessionCheck';
import { adminVerifyToken } from '../middlewares/admin/tokenVerification';

const adminRouter=express.Router()

adminRouter.get('/verifyToken',adminVerifyToken,adminSessionCheck ,adminController.verifyToken)
adminRouter.post('/login',adminController.logIn)
adminRouter.get('/dashboard',adminVerifyToken, adminSessionCheck, adminController.adminDashBoard)
adminRouter.get('/profile',adminVerifyToken, adminSessionCheck, adminController.adminProfile)

export default adminRouter