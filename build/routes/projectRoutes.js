"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = __importDefault(require("../controllers/projects/projectController"));
const projectRouter = express_1.default.Router();
projectRouter.get('/', projectController_1.default.projects);
projectRouter.post('/create', projectController_1.default.createProject);
exports.default = projectRouter;
