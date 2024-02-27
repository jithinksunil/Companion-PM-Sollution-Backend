"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectManagerSessionCheck = void 0;
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const projectManagerSessionCheck = (req, res, next) => {
    if (req.session.projectManager) {
        next();
        console.log('session verified');
    }
    else {
        next(ErrorResponse_1.default.unauthorized('Un-authorised access'));
    }
};
exports.projectManagerSessionCheck = projectManagerSessionCheck;
