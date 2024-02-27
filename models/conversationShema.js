"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    members: [mongoose_1["default"].Types.ObjectId]
}, { timestamps: true });
var conversationCollection = mongoose_1["default"].model('conversation_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = conversationCollection;
