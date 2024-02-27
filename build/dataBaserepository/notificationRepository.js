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
exports.createNotification = exports.getAllNotification = void 0;
const mongoose_1 = require("mongoose");
const notificationCollection_1 = __importDefault(require("../models/notificationCollection"));
const getAllNotification = (notifiedIndividualId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let notifications = yield notificationCollection_1.default.find({ notifiedIndividualId }).sort({ $natural: -1 });
        return Promise.resolve(notifications);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getAllNotification = getAllNotification;
const createNotification = (requestObject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        requestObject.notifiedIndividualId = new mongoose_1.Types.ObjectId(requestObject.notifiedIndividualId);
        yield notificationCollection_1.default.insertMany([requestObject]);
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createNotification = createNotification;
