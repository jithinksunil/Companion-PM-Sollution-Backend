"use strict";
exports.__esModule = true;
exports.adminSessionCheck = void 0;
var ErrorResponse_1 = require("../../error/ErrorResponse");
var adminSessionCheck = function (req, res, next) {
    if (req.session.admin) {
        next();
        console.log('session verified');
    }
    else {
        next(ErrorResponse_1["default"].unauthorized('Un-authorised access'));
    }
};
exports.adminSessionCheck = adminSessionCheck;
