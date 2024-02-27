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
        type: String,
        required: true
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
    projects: [{
            projectId: mongoose_1.Schema.Types.ObjectId,
            status: Boolean
        }],
    currentTaskOrder: { type: [mongoose_1.Schema.Types.ObjectId], "default": [] },
    position: { type: String, "default": "siteEngineer" }
});
var siteEngineerCollection = mongoose_1["default"].model('site_engineer_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = siteEngineerCollection;
