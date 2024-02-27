"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = __importDefault(require("../controllers/notifications/notificationController"));
const notificationRouter = express_1.default.Router();
notificationRouter.post('/', notificationController_1.default.notifications);
notificationRouter.post('/create', notificationController_1.default.create);
exports.default = notificationRouter;
