"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    projectId: mongoose_1.Types.ObjectId,
    siteEngineers: [{ siteEngineerId: mongoose_1.Schema.Types.Mixed, status: { type: Boolean, "default": true } }],
    name: String,
    status: String,
    progress: Number
}, { timestamps: true });
var taskCollection = mongoose_1["default"].model('task_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = taskCollection;
