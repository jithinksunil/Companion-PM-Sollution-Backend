"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = __importDefault(require("../controllers/chat/chatController"));
const chatRouter = express_1.default.Router();
chatRouter.post('/connectionlist', chatController_1.default.connnectionList);
chatRouter.post('/startchat', chatController_1.default.startChat);
chatRouter.post('/sendmessage', chatController_1.default.sendMessage);
exports.default = chatRouter;
