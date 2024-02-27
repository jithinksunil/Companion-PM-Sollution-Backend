"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controllers/admin/adminController"));
const sessionCheck_1 = require("../middlewares/admin/sessionCheck");
const tokenVerification_1 = require("../middlewares/admin/tokenVerification");
const adminRouter = express_1.default.Router();
adminRouter.post('/login', adminController_1.default.logIn);
adminRouter.use(tokenVerification_1.adminVerifyToken, sessionCheck_1.adminSessionCheck);
adminRouter.get('/verifyToken', adminController_1.default.verifyToken);
adminRouter.get('/dashboard', adminController_1.default.adminDashBoard);
adminRouter.get('/profile', adminController_1.default.adminProfile);
adminRouter.get('/superusermanagement', adminController_1.default.superUserManagement);
adminRouter.get('/blockorunblock', adminController_1.default.blockOrUnblock);
exports.default = adminRouter;
