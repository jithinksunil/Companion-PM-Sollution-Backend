"use strict";
exports.__esModule = true;
exports.projectManagerSessionCheck = void 0;
var ErrorResponse_1 = require("../../error/ErrorResponse");
var projectManagerSessionCheck = function (req, res, next) {
    if (req.session.projectManager) {
        next();
        console.log('session verified');
    }
    else {
        next(ErrorResponse_1["default"].unauthorized('Un-authorised access'));
    }
};
exports.projectManagerSessionCheck = projectManagerSessionCheck;
