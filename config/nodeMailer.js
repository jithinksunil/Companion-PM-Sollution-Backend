"use strict";
exports.__esModule = true;
exports.mailService = exports.newConnectionMailObject = exports.OtpMailObject = exports.newConnectionObject = exports.otp = void 0;
var nodemailer_1 = require("nodemailer");
function otp() {
    var otpgen = Math.floor(1000 + Math.random() * 9000);
    return otpgen;
}
exports.otp = otp;
function newConnectionObject(companyName) {
    var firstFourLetter = companyName.toUpperCase().substring(0, 4);
    var connectionSerial = Math.floor(1000 + Math.random() * 9000);
    var logginUserName = firstFourLetter + connectionSerial + 'CMPN';
    var password4Leters = Math.random().toString(36).substring(2, 7);
    var password4Digits = Math.floor(1000 + Math.random() * 9000);
    var password = password4Leters + password4Digits;
    return { logginUserName: logginUserName, password: password };
}
exports.newConnectionObject = newConnectionObject;
function OtpMailObject(email, otpgen) {
    var mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: 'YOUR OTP',
        html: "<p>".concat(otpgen, "</p>")
    };
    return mailOptions;
}
exports.OtpMailObject = OtpMailObject;
function newConnectionMailObject(email, data) {
    var mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: 'Your Login Credentials',
        html: "<p>\n        Your loggin user name:".concat(data.logginUserName, "<br>\n        Your Password:").concat(data.password, "<br>\n        Use the following link to loggin:<br>\n        ").concat(process.env.CORS_LINK, "/projectmanager/login</p>")
    };
    return mailOptions;
}
exports.newConnectionMailObject = newConnectionMailObject;
function mailService(mailOptions) {
    var transporter = nodemailer_1["default"].createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODE_MAILER_EMAIL,
            pass: process.env.NODE_MAILER_CONFIG_PASSWORD // password from gmail
        }
    });
    var promiseObect = new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                resolve(error);
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(info.response);
            }
        });
    });
    return promiseObect;
}
exports.mailService = mailService;
