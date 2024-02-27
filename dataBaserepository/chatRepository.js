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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.messageSend = exports.messagesAndChatDetails = exports.findAllConnections = void 0;
var mongoose_1 = require("mongoose");
var projectManagerSchema_1 = require("../models/projectManagerSchema");
var siteEngineerSchema_1 = require("../models/siteEngineerSchema");
var superUserSchema_1 = require("../models/superUserSchema");
var conversationShema_1 = require("../models/conversationShema");
var messageShema_1 = require("../models/messageShema");
var findAllConnections = function (superUserId) { return __awaiter(void 0, void 0, void 0, function () {
    var projectmanagers, siteEngineers, superUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, projectManagerSchema_1["default"].find({ superUserId: new mongoose_1.Types.ObjectId(superUserId) })];
            case 1:
                projectmanagers = _a.sent();
                return [4 /*yield*/, siteEngineerSchema_1["default"].find({ superUserId: new mongoose_1.Types.ObjectId(superUserId) })];
            case 2:
                siteEngineers = _a.sent();
                return [4 /*yield*/, superUserSchema_1["default"].findOne({ _id: new mongoose_1.Types.ObjectId(superUserId) })];
            case 3:
                superUser = _a.sent();
                return [2 /*return*/, Promise.resolve(__spreadArray(__spreadArray(__spreadArray([], projectmanagers, true), siteEngineers, true), [superUser], false))];
            case 4:
                error_1 = _a.sent();
                return [2 /*return*/, Promise.reject(error_1)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.findAllConnections = findAllConnections;
var messagesAndChatDetails = function (senderId, recieverId) { return __awaiter(void 0, void 0, void 0, function () {
    var conversation, messages, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                senderId = new mongoose_1.Types.ObjectId(senderId);
                recieverId = new mongoose_1.Types.ObjectId(recieverId);
                return [4 /*yield*/, conversationShema_1["default"].findOne({ members: { $all: [senderId, recieverId] } })];
            case 1:
                conversation = _a.sent();
                if (!!conversation) return [3 /*break*/, 3];
                return [4 /*yield*/, conversationShema_1["default"].insertMany([{ members: [senderId, recieverId] }])];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, conversationShema_1["default"].findOne({ members: [senderId, recieverId] })];
            case 4:
                conversation = _a.sent();
                if (!conversation) return [3 /*break*/, 6];
                return [4 /*yield*/, messageShema_1["default"].find({ conversationId: conversation._id })];
            case 5:
                messages = _a.sent();
                return [2 /*return*/, Promise.resolve({ messages: messages, recieverId: recieverId, conversationId: conversation._id })];
            case 6: return [2 /*return*/, Promise.resolve({ messages: [] })];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                return [2 /*return*/, Promise.reject(error_2)];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.messagesAndChatDetails = messagesAndChatDetails;
var messageSend = function (messageObject) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                messageObject.conversationId = new mongoose_1.Types.ObjectId(messageObject.conversationId);
                return [4 /*yield*/, messageShema_1["default"].insertMany([messageObject])];
            case 1:
                _a.sent();
                return [4 /*yield*/, messageShema_1["default"].find({ conversationId: messageObject.conversationId })];
            case 2:
                messages = _a.sent();
                return [2 /*return*/, Promise.resolve(messages)];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, Promise.reject(error_3)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.messageSend = messageSend;
