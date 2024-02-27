"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
var adminCollection = mongoose_1["default"].model('admin_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = adminCollection;
