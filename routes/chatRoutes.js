"use strict";
exports.__esModule = true;
var express_1 = require("express");
var chatController_1 = require("../controllers/chat/chatController");
var chatRouter = express_1["default"].Router();
chatRouter.post('/connectionlist', chatController_1["default"].connnectionList);
chatRouter.post('/startchat', chatController_1["default"].startChat);
chatRouter.post('/sendmessage', chatController_1["default"].sendMessage);
exports["default"] = chatRouter;
