"use strict";
exports.__esModule = true;
exports.adminVerifyToken = void 0;
var ErrorResponse_1 = require("../../error/ErrorResponse");
var jsonwebtoken_1 = require("jsonwebtoken");
var adminVerifyToken = function (req, res, next) {
    var adminToken = req.cookies.adminToken;
    if (adminToken) {
        jsonwebtoken_1["default"].verify(adminToken, 'mySecretKeyForAdmin', function (err, decoded) {
            if (err) {
                next(ErrorResponse_1["default"].forbidden('Admin token verification failed'));
            }
            else {
                console.log('Admin token Verified');
                next();
            }
        });
    }
    else {
        next(ErrorResponse_1["default"].unauthorized('Admin token verification failed'));
    }
};
exports.adminVerifyToken = adminVerifyToken;
