"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var newSchema = new mongoose_1["default"].Schema({
    date: {
        type: String,
        required: true
    },
    attendences: [
        {
            _id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String
            }
        }
    ]
});
var attendenceCollection = mongoose_1["default"].model('attendence_collection', newSchema); // creating collection using the defined schema and assign to new Model
exports["default"] = attendenceCollection;
