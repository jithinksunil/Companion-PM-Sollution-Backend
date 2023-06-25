import express from 'express'
import uploadSiteEngineer from '../config/multer';
import siteEngineerController from "../controllers/siteEngineer/siteEngineerController";
import {siteEngineerVerifyToken} from '../middlewares/siteEngineer/tokenVerification';

const siteEngineerRouter = express.Router()
siteEngineerRouter.post('/login', siteEngineerController.logIn)

siteEngineerRouter.use(siteEngineerVerifyToken)
siteEngineerRouter.get('/verifyToken',  siteEngineerController.verifyToken)
siteEngineerRouter.get('/dashboard',  siteEngineerController.siteEngineerDashBoard)
siteEngineerRouter.get('/project',  siteEngineerController.project)
siteEngineerRouter.get('/profile',  siteEngineerController.siteEngineerProfile)
siteEngineerRouter.post('/updateImage', uploadSiteEngineer.single('file'), siteEngineerController.updateImage)
siteEngineerRouter.get('/attendence', siteEngineerController.markAttendence)
siteEngineerRouter.post('/updateProfile', siteEngineerController.updateProfile)

export default siteEngineerRouter
