"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminVerifyToken = void 0;
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminVerifyToken = (req, res, next) => {
    const adminToken = req.cookies.adminToken;
    if (adminToken) {
        jsonwebtoken_1.default.verify(adminToken, 'mySecretKeyForAdmin', (err, decoded) => {
            if (err) {
                next(ErrorResponse_1.default.forbidden('Admin token verification failed'));
            }
            else {
                console.log('Admin token Verified');
                next();
            }
        });
    }
    else {
        next(ErrorResponse_1.default.unauthorized('Admin token verification failed'));
    }
};
exports.adminVerifyToken = adminVerifyToken;
