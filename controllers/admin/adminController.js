"use strict";
exports.__esModule = true;
var adminSchema_1 = require("../../models/adminSchema");
var superUserSchema_1 = require("../../models/superUserSchema");
var jsonwebtoken_1 = require("jsonwebtoken");
var adminController = {
    verifyToken: function (req, res) {
        res.json({ tokenVerified: true });
    },
    logIn: function (req, res) {
        var password = req.body.password;
        var email = req.body.email;
        adminSchema_1["default"].findOne({ email: email }).then(function (admin) {
            if (admin) {
                if (password === admin.password) {
                    req.session.admin = admin.toObject(); // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    var adminData = admin.toObject();
                    var token = jsonwebtoken_1["default"].sign(adminData, 'mySecretKeyForAdmin', { expiresIn: '1h' });
                    res.json({ verified: true, admin: admin, message: 'Succesfully logged in', token: token });
                }
                else {
                    res.json({ verified: false, message: 'Wrong email or password' });
                }
            }
            else {
                res.json({ verified: false, message: 'User does not exist' });
            }
        })["catch"](function (reject) {
            console.log(reject);
            res.json({ verified: false, message: 'Sorry for Interuption ,Database facing issues' });
        });
    },
    adminDashBoard: function (req, res) {
        var adminData = req.session.admin;
        res.json({ tokenVerified: true, adminData: adminData });
    },
    adminProfile: function (req, res) {
        var adminData = req.session.admin;
        res.json({ tokenVerified: true, adminData: adminData });
    },
    superUserManagement: function (req, res) {
        var search = req.query.search;
        if (!search)
            search = '';
        superUserSchema_1["default"].find({
            $or: [
                {
                    email: {
                        $regex: search,
                        $options: 'i'
                    }
                }, {
                    companyName: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        }).then(function (superUsersData) {
            res.json({ tokenVerified: true, superUsersData: superUsersData });
        })["catch"](function (err) {
            console.log(err);
            res.json({ tokenVerified: true, message: 'Sorry, connot retrieve datas now, Database facing issues' });
        });
    },
    blockOrUnblock: function (req, res) {
        superUserSchema_1["default"].updateOne({
            _id: req.query.id
        }, { status: req.query.status }).then(function () {
            res.json({ action: true, message: 'updated' });
        })["catch"](function (err) {
            console.log(err);
            res.json({ action: false, message: 'Sorry for connot retrieve datas now, Database facing issues' });
        });
    }
};
exports["default"] = adminController;
