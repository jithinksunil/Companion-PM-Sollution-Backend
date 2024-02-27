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
        required: true,
        "default": 'GuestCompany'
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        "default": true
    },
    membership: {
        type: String,
        required: true,
        "default": 'Free'
    },
    position: { type: String, "default": "superUser" },
    guestToken: { type: String },
    createdAt: { type: Date }
}, { timestamps: true });
var superUserCollection = mongoose_1["default"].model('super_user_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = superUserCollection;
