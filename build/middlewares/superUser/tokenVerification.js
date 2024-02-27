"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superUserVerifyToken = void 0;
const guestRepository_1 = require("../../dataBaserepository/guestRepository");
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const superUserVerifyToken = (req, res, next) => {
    const superUserToken = req.cookies.superUserToken;
    console.log(superUserToken);
    if (superUserToken) {
        jsonwebtoken_1.default.verify(superUserToken, 'mySecretKeyForSuperUser', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                next(ErrorResponse_1.default.forbidden('Session expired'));
            }
            else {
                const payload = decoded;
                if (payload === null || payload === void 0 ? void 0 : payload.createdAt) {
                    //only for guest users
                    let remainingTime = (payload === null || payload === void 0 ? void 0 : payload.createdAt) + 30 * 60 * 1000 - Date.now();
                    remainingTime = Math.floor(remainingTime / 1000 / 60);
                    if (remainingTime < 0) {
                        yield (0, guestRepository_1.updateGuest)(superUserToken);
                        return next(ErrorResponse_1.default.forbidden('Full access expired'));
                    }
                    req.remainingTime = remainingTime;
                }
                next();
            }
        }));
    }
    else {
        next(ErrorResponse_1.default.unauthorized('Un-authorised access'));
    }
};
exports.superUserVerifyToken = superUserVerifyToken;
