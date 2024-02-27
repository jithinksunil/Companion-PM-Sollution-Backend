"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superUserSessionCheck = void 0;
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const superUserSessionCheck = (req, res, next) => {
    if (req.session.superUser) {
        console.log('session verified');
        next();
    }
    else {
        next(ErrorResponse_1.default.unauthorized('Un-authorised access'));
    }
};
exports.superUserSessionCheck = superUserSessionCheck;
