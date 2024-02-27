"use strict";
exports.__esModule = true;
exports.projectManagerVerifyToken = void 0;
var ErrorResponse_1 = require("../../error/ErrorResponse");
var jsonwebtoken_1 = require("jsonwebtoken");
var projectManagerVerifyToken = function (req, res, next) {
    var projectManagerToken = req.cookies.projectManagerToken;
    if (projectManagerToken) {
        jsonwebtoken_1["default"].verify(projectManagerToken, 'mySecretKeyForProjectManager', function (err, decoded) {
            if (err) {
                console.log(err);
                next(ErrorResponse_1["default"].forbidden('Failed to varify projectmanger token'));
            }
            else {
                console.log('Projectmanger Token Verified');
                next();
            }
        });
    }
    else {
        next(ErrorResponse_1["default"].unauthorized('Failed to varify projectmanger token'));
    }
};
exports.projectManagerVerifyToken = projectManagerVerifyToken;
