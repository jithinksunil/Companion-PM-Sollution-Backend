"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    conversationId: mongoose_1.Types.ObjectId,
    senderId: mongoose_1.Types.ObjectId,
    recieverId: mongoose_1.Types.ObjectId,
    message: String
}, { timestamps: true });
var messageCollection = mongoose_1["default"].model('message_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = messageCollection;
