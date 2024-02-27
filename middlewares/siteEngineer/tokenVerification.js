"use strict";
exports.__esModule = true;
exports.siteEngineerVerifyToken = void 0;
var ErrorResponse_1 = require("../../error/ErrorResponse");
var jsonwebtoken_1 = require("jsonwebtoken");
var siteEngineerVerifyToken = function (req, res, next) {
    var siteEngineerToken = req.cookies.siteEngineerToken;
    if (siteEngineerToken) {
        jsonwebtoken_1["default"].verify(siteEngineerToken, 'mySecretKeyForSiteEngineer', function (err, decoded) {
            if (err) {
                console.log(err);
                next(ErrorResponse_1["default"].forbidden('Failed to varify site engineer token'));
            }
            else {
                console.log('site engineer Token Verified');
                next();
            }
        });
    }
    else {
        next(ErrorResponse_1["default"].unauthorized('Failed to varify site engineer token'));
    }
};
exports.siteEngineerVerifyToken = siteEngineerVerifyToken;
