"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSessionCheck = void 0;
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const adminSessionCheck = (req, res, next) => {
    if (req.session.admin) {
        next();
        console.log('session verified');
    }
    else {
        next(ErrorResponse_1.default.unauthorized('Un-authorised access'));
    }
};
exports.adminSessionCheck = adminSessionCheck;
