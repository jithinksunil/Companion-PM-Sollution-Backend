"use strict";
exports.__esModule = true;
var express_1 = require("express");
var taskController_1 = require("../controllers/tasks/taskController");
var taskRouter = express_1["default"].Router();
taskRouter.get('/', taskController_1["default"].tasks);
taskRouter.post('/updateTaskAssignment', taskController_1["default"].taskAssignment);
taskRouter.post('/add', taskController_1["default"].add);
exports["default"] = taskRouter;
