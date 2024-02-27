"use strict";
exports.__esModule = true;
var express_1 = require("express");
var notificationController_1 = require("../controllers/notifications/notificationController");
var notificationRouter = express_1["default"].Router();
notificationRouter.post('/', notificationController_1["default"].notifications);
notificationRouter.post('/create', notificationController_1["default"].create);
exports["default"] = notificationRouter;
