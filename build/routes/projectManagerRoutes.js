"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../config/multer"));
const projectManagerController_1 = __importDefault(require("../controllers/projectManager/projectManagerController"));
const sessionCheck_1 = require("../middlewares/projectManager/sessionCheck");
const tokenVerification_1 = require("../middlewares/projectManager/tokenVerification");
const projectManagerRouter = express_1.default.Router();
projectManagerRouter.post('/signup', projectManagerController_1.default.signUp);
projectManagerRouter.post('/login', projectManagerController_1.default.logIn);
projectManagerRouter.use(tokenVerification_1.projectManagerVerifyToken, sessionCheck_1.projectManagerSessionCheck);
projectManagerRouter.get('/verifyToken', projectManagerController_1.default.verifyToken);
projectManagerRouter.get('/dashboard', projectManagerController_1.default.projectManagerDashBoard);
projectManagerRouter.get('/profile', projectManagerController_1.default.projectManagerProfile);
projectManagerRouter.post('/updateimage', multer_1.default.single('file'), projectManagerController_1.default.updateImage);
projectManagerRouter.get('/attendence', projectManagerController_1.default.markAttendence);
projectManagerRouter.post('/updateprofile', projectManagerController_1.default.updateProfile);
exports.default = projectManagerRouter;