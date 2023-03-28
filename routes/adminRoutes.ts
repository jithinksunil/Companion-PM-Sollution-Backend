import express from 'express'
import adminController from "../controllers/admin/adminController";
import {adminSessionCheck} from '../middlewares/admin/sessionCheck';
import {adminVerifyToken} from '../middlewares/admin/tokenVerification';

const adminRouter = express.Router()

adminRouter.post('/login', adminController.logIn)

adminRouter.use(adminVerifyToken, adminSessionCheck)
adminRouter.get('/verifyToken',  adminController.verifyToken)
adminRouter.get('/dashboard',  adminController.adminDashBoard)
adminRouter.get('/profile',  adminController.adminProfile)
adminRouter.get('/superusermanagement',  adminController.superUserManagement)
adminRouter.get('/blockorunblock',  adminController.blockOrUnblock)

export default adminRouter
