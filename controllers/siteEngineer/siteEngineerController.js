"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var jsonwebtoken_1 = require("jsonwebtoken");
var cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
var siteEngineerSchema_1 = require("../../models/siteEngineerSchema");
var AttendeceSchema_1 = require("../../models/AttendeceSchema");
var projectSchema_1 = require("../../models/projectSchema");
var siteEngineerController = {
    verifyToken: function (req, res) {
        res.json({ tokenVerified: true });
    },
    logIn: function (req, res) {
        var password = req.body.password;
        var logginUserName = req.body.userName;
        siteEngineerSchema_1["default"].findOne({ logginUserName: logginUserName }).then(function (siteEngineer) {
            if (siteEngineer) {
                if (password === siteEngineer.password) {
                    req.session.siteEngineer = siteEngineer.toObject(); // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    var siteEngineerData = siteEngineer.toObject();
                    var token = jsonwebtoken_1["default"].sign(siteEngineerData, 'mySecretKeyForSiteEngineer', { expiresIn: '1h' });
                    res.json({ verified: true, data: siteEngineer, message: 'Succesfully logged in', token: token });
                }
                else {
                    res.json({ verified: false, message: 'Wrong email or password' });
                }
            }
            else {
                res.json({ verified: false, message: 'User does not exist' });
            }
        })["catch"](function () {
            res.json({ verified: false, message: 'Sorry for Interuption ,Database facing issues' });
        });
    },
    siteEngineerDashBoard: function (req, res) {
        var siteEngineerData = req.session.siteEngineer;
        res.json({ tokenVerified: true, data: siteEngineerData });
    },
    project: function (req, res) {
        projectSchema_1["default"].findOne({ _id: req.session.siteEngineer.projectId }).then(function (project) {
            res.json({ tokenVerified: true, data: project });
        })["catch"](function () {
            res.json({ tokenVerified: true, message: 'cannot fetch project details from the database now' });
        });
    },
    siteEngineerProfile: function (req, res) {
        siteEngineerSchema_1["default"].findOne({ _id: req.session.siteEngineer._id }).then(function (siteEngineerData) {
            var message = req.query.message;
            res.json({ tokenVerified: true, data: siteEngineerData, status: true, message: message });
        })["catch"](function () {
            res.json({ tokenVerified: true, message: 'Cannot fetch data now data base issue' });
        });
    },
    updateImage: function (req, res) {
        var userId = req.session.siteEngineer._id;
        if (req.file) {
            cloudinaryConfig_1["default"].uploader.upload(req.file.path, {
                transformation: [
                    {
                        width: 485,
                        height: 485,
                        gravity: "face",
                        crop: "fill"
                    }
                ]
            }).then(function (result) {
                siteEngineerSchema_1["default"].updateOne({
                    _id: userId
                }, { image: result.secure_url }).then(function () {
                    res.redirect("/siteEngineer/profile?message=successfully updated");
                })["catch"](function () {
                    res.json({ staus: false, message: 'data base facing issue try later' });
                });
            })["catch"](function (err) {
                res.json({ status: false, message: 'cannot upload now to cloudinary' });
            });
        }
        else {
            res.json({ status: false, message: 'Select a jpeg format' });
        }
    },
    markAttendence: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var currentDate, _a, _id, name_1, attendeceSheet, result, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    currentDate = new Date().toJSON().slice(0, 10);
                    _a = req.session.siteEngineer, _id = _a._id, name_1 = _a.name;
                    return [4 /*yield*/, AttendeceSchema_1["default"].findOne({ date: currentDate })];
                case 1:
                    attendeceSheet = _b.sent();
                    if (!attendeceSheet) return [3 /*break*/, 6];
                    return [4 /*yield*/, AttendeceSchema_1["default"].findOne({ date: currentDate, "attendences._id": _id })];
                case 2:
                    result = _b.sent();
                    if (!result) return [3 /*break*/, 3];
                    res.json({ status: true, message: 'Attendece already marked' });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, AttendeceSchema_1["default"].updateOne({ date: currentDate }, { $push: { attendences: { _id: _id, name: name_1 } } })];
                case 4:
                    _b.sent();
                    res.json({ status: true, message: 'Attendece Marked' });
                    _b.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, AttendeceSchema_1["default"].insertMany([{ date: currentDate, attendences: [{ _id: _id, name: name_1 }] }])];
                case 7:
                    _b.sent();
                    res.json({ status: true, message: 'Attendece Marked' });
                    _b.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _b.sent();
                    console.log(err_1);
                    res.json({ status: false, message: 'Attendence cannot be marked now' });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); },
    updateProfile: function (req, res) {
        var _a = req.body, name = _a.name, email = _a.email, companyName = _a.companyName, password = _a.password;
        if (req.session.siteEngineer.password === password) {
            siteEngineerSchema_1["default"].findOneAndUpdate({ _id: req.session.siteEngineer._id }, { $set: { name: name, email: email, companyName: companyName } }, { returnOriginal: false }).then(function (siteEngineer) {
                console.log(siteEngineer);
                res.json({ status: true, message: 'Succesfully updated', data: siteEngineer });
            })["catch"](function () {
                res.json({ status: false, message: 'Cannot update database facing issues' });
            });
        }
        else {
            res.json({ status: false, message: 'Password doesnot matches' });
        }
    }
};
exports["default"] = siteEngineerController;
