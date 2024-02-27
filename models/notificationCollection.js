"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    notifiedIndividualId: mongoose_1.Types.ObjectId,
    senderId: mongoose_1.Types.ObjectId,
    notification: String,
    url: String
}, { timestamps: true });
var notificationCollection = mongoose_1["default"].model('notification_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = notificationCollection;
