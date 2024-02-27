"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    // defining structure of collections
    name: {
        type: String
    },
    image: {
        type: String
    },
    email: {
        type: String
    },
    companyName: {
        type: String
    },
    superUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    logginUserName: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        "default": true
    },
    position: { type: String, "default": "projectManager" }
});
var projectManagerCollection = mongoose_1["default"].model('project_manager_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = projectManagerCollection;
