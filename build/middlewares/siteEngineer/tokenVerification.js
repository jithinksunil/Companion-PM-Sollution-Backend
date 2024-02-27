"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteEngineerVerifyToken = void 0;
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const siteEngineerVerifyToken = (req, res, next) => {
    const siteEngineerToken = req.cookies.siteEngineerToken;
    if (siteEngineerToken) {
        jsonwebtoken_1.default.verify(siteEngineerToken, 'mySecretKeyForSiteEngineer', (err, decoded) => {
            if (err) {
                console.log(err);
                next(ErrorResponse_1.default.forbidden('Failed to varify site engineer token'));
            }
            else {
                console.log('site engineer Token Verified');
                next();
            }
        });
    }
    else {
        next(ErrorResponse_1.default.unauthorized('Failed to varify site engineer token'));
    }
};
exports.siteEngineerVerifyToken = siteEngineerVerifyToken;
