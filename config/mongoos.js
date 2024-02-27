"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var mongodb = function () {
    mongoose_1["default"].set('strictQuery', true);
    mongoose_1["default"].connect(process.env.MONGO_URL, {
        retryWrites: true,
        w: 'majority'
    }).then(function () {
        console.log('Data Base connected');
    })["catch"](function () {
        console.log('Cannot connect to Data Base');
    });
};
exports["default"] = mongodb;
