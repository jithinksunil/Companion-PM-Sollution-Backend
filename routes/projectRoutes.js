"use strict";
exports.__esModule = true;
var express_1 = require("express");
var projectController_1 = require("../controllers/projects/projectController");
var projectRouter = express_1["default"].Router();
projectRouter.get('/', projectController_1["default"].projects);
projectRouter.post('/create', projectController_1["default"].createProject);
exports["default"] = projectRouter;
