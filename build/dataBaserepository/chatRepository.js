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
exports.messageSend = exports.messagesAndChatDetails = exports.findAllConnections = void 0;
const mongoose_1 = require("mongoose");
const projectManagerSchema_1 = __importDefault(require("../models/projectManagerSchema"));
const siteEngineerSchema_1 = __importDefault(require("../models/siteEngineerSchema"));
const superUserSchema_1 = __importDefault(require("../models/superUserSchema"));
const conversationShema_1 = __importDefault(require("../models/conversationShema"));
const messageShema_1 = __importDefault(require("../models/messageShema"));
const findAllConnections = (superUserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectmanagers = yield projectManagerSchema_1.default.find({ superUserId: new mongoose_1.Types.ObjectId(superUserId) });
        const siteEngineers = yield siteEngineerSchema_1.default.find({ superUserId: new mongoose_1.Types.ObjectId(superUserId) });
        const superUser = yield superUserSchema_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(superUserId) });
        return Promise.resolve([...projectmanagers, ...siteEngineers, superUser]);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.findAllConnections = findAllConnections;
const messagesAndChatDetails = (senderId, recieverId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        senderId = new mongoose_1.Types.ObjectId(senderId);
        recieverId = new mongoose_1.Types.ObjectId(recieverId);
        let conversation = yield conversationShema_1.default.findOne({ members: { $all: [senderId, recieverId] } });
        if (!conversation) {
            yield conversationShema_1.default.insertMany([{ members: [senderId, recieverId] }]);
        }
        conversation = yield conversationShema_1.default.findOne({ members: [senderId, recieverId] });
        if (conversation) { //conversation can possibly null
            const messages = yield messageShema_1.default.find({ conversationId: conversation._id });
            return Promise.resolve({ messages, recieverId, conversationId: conversation._id });
        }
        else {
            return Promise.resolve({ messages: [] });
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.messagesAndChatDetails = messagesAndChatDetails;
const messageSend = (messageObject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        messageObject.conversationId = new mongoose_1.Types.ObjectId(messageObject.conversationId);
        yield messageShema_1.default.insertMany([messageObject]);
        const messages = yield messageShema_1.default.find({ conversationId: messageObject.conversationId });
        return Promise.resolve(messages);
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.messageSend = messageSend;
