"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectManagerVerifyToken = void 0;
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const projectManagerVerifyToken = (req, res, next) => {
    const projectManagerToken = req.cookies.projectManagerToken;
    if (projectManagerToken) {
        jsonwebtoken_1.default.verify(projectManagerToken, 'mySecretKeyForProjectManager', (err, decoded) => {
            if (err) {
                console.log(err);
                next(ErrorResponse_1.default.forbidden('Failed to varify projectmanger token'));
            }
            else {
                console.log('Projectmanger Token Verified');
                next();
            }
        });
    }
    else {
        next(ErrorResponse_1.default.unauthorized('Failed to varify projectmanger token'));
    }
};
exports.projectManagerVerifyToken = projectManagerVerifyToken;
