"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const newSchema = new mongoose_1.default.Schema({
    members: [mongoose_1.default.Types.ObjectId],
}, { timestamps: true });
const conversationCollection = mongoose_1.default.model('conversation_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports.default = conversationCollection;
