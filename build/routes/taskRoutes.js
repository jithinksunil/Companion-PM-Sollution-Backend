"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = __importDefault(require("../controllers/tasks/taskController"));
const taskRouter = express_1.default.Router();
taskRouter.get('/', taskController_1.default.tasks);
taskRouter.post('/updateTaskAssignment', taskController_1.default.taskAssignment);
taskRouter.post('/add', taskController_1.default.add);
exports.default = taskRouter;
