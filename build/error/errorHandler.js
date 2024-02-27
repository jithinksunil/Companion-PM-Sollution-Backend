"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorResponse_1 = __importDefault(require("./ErrorResponse"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof ErrorResponse_1.default) {
        res.status(err.status).json({ message: err.message });
    }
    else {
        res.status(500).json();
    }
};
exports.default = errorHandler;
