"use strict";
exports.__esModule = true;
var ErrorResponse_1 = require("./ErrorResponse");
var errorHandler = function (err, req, res, next) {
    if (err instanceof ErrorResponse_1["default"]) {
        res.status(err.status).json({ message: err.message });
    }
    else {
        res.status(500).json();
    }
};
exports["default"] = errorHandler;
