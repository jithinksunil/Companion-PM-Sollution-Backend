"use strict";
exports.__esModule = true;
exports.superUserSessionCheck = void 0;
var ErrorResponse_1 = require("../../error/ErrorResponse");
var superUserSessionCheck = function (req, res, next) {
    if (req.session.superUser) {
        console.log('session verified');
        next();
    }
    else {
        next(ErrorResponse_1["default"].unauthorized('Un-authorised access'));
    }
};
exports.superUserSessionCheck = superUserSessionCheck;
