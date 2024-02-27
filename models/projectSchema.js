"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    name: { type: String, required: true },
    location: { lati: { type: Number, required: true }, longi: { type: Number, required: true } },
    place: { type: String, required: true },
    budget: { type: Number, required: true },
    progress: { type: Number, "default": 0 },
    projectManagers: [{ projectManagerId: mongoose_1.Schema.Types.ObjectId, status: { type: Boolean, "default": true } }],
    superUserId: { type: mongoose_1.Schema.Types.ObjectId },
    status: { type: String, "default": 'Not started' }
});
var projectCollection = mongoose_1["default"].model('project_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = projectCollection;
