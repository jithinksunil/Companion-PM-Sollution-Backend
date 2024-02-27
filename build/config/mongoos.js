"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb = () => {
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connect(process.env.MONGO_URL, {
        retryWrites: true,
        w: 'majority'
    }).then(() => {
        console.log('Data Base connected');
    }).catch(() => {
        console.log('Cannot connect to Data Base');
    });
};
exports.default = mongodb;
