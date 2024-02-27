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
var superUserSchema_1 = require("../../models/superUserSchema");
var jsonwebtoken_1 = require("jsonwebtoken");
var cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
var nodeMailer_1 = require("../../config/nodeMailer");
var projectManagerSchema_1 = require("../../models/projectManagerSchema");
var projectSchema_1 = require("../../models/projectSchema");
var mongoose_1 = require("mongoose");
var siteEngineerSchema_1 = require("../../models/siteEngineerSchema");
var taskShema_1 = require("../../models/taskShema");
var ErrorResponse_1 = require("../../error/ErrorResponse");
var guestRepository_1 = require("../../dataBaserepository/guestRepository");
var superUseController = {
    verifyToken: function (req, res) {
        res.status(200).json({ tokenVerified: true, message: 'Super user token verified' });
    },
    logout: function (req, res) {
        req.session.destroy();
        res.status(200).json({ status: true, message: 'Succesfully Logged Out' });
    },
    signUp: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var email, superUserExist, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    email = req.body.email;
                    console.log(req.body);
                    return [4 /*yield*/, superUserSchema_1["default"].findOne({ email: email })];
                case 1:
                    superUserExist = _a.sent();
                    if (superUserExist) {
                        res.status(409).json({ status: false, message: 'User already exist' });
                    }
                    else {
                        superUserSchema_1["default"].insertMany([req.body]).then(function () {
                            console.log('added');
                            res.status(200).json({ status: true, message: 'Signin Successfullllll' });
                        })["catch"](function () {
                            next(ErrorResponse_1["default"].internalError('Database facing issues'));
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    next(ErrorResponse_1["default"].internalError('Database facing issues'));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    logIn: function (req, res) {
        console.log('reached');
        var password = req.body.password;
        var email = req.body.email;
        superUserSchema_1["default"].findOne({ email: email }).then(function (superUserData) {
            if (superUserData) {
                if (password === superUserData.password) {
                    req.session.superUser = superUserData.toObject(); // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    var superUser = superUserData.toObject();
                    var token = jsonwebtoken_1["default"].sign(superUser, 'mySecretKeyForSuperUser', { expiresIn: '1h' });
                    res.json({ verified: true, data: superUser, message: 'Succesfully logged in', token: token });
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
    guestLogin: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var token, guest, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    token = req.cookies.superUserToken;
                    return [4 /*yield*/, (0, guestRepository_1.findGuest)(token)];
                case 1:
                    guest = _a.sent();
                    if (guest && guest.position === 'guest') {
                        return [2 /*return*/, res.status(200).json({ verified: true, data: guest, token: token })];
                    }
                    token = jsonwebtoken_1["default"].sign({ name: 'guest', createdAt: Date.now() }, 'mySecretKeyForSuperUser', { expiresIn: '30m' });
                    return [4 /*yield*/, (0, guestRepository_1.createAndGetGuest)(token)];
                case 2:
                    guest = _a.sent();
                    req.session.superUser = guest === null || guest === void 0 ? void 0 : guest.toObject();
                    res.status(200).json({ verified: true, data: guest, token: token, message: 'Logged in as Guest' });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    res.status(500).json({ message: 'Error on creating guest,try later' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    superUserDashBoard: function (req, res) {
        var message;
        if (req.remainingTime) {
            message = "You have ".concat(req.remainingTime, " minutes remaining");
        }
        res.json({ tokenVerified: true, message: message });
    },
    superUserProfile: function (req, res) {
        superUserSchema_1["default"].findOne({ _id: req.session.superUser._id }).then(function (superUserData) {
            var message = req.query.message;
            res.json({ tokenVerified: true, data: superUserData, status: true, message: message });
        })["catch"](function () {
            res.json({ tokenVerified: true, message: 'Cannot fetch data now data base issue' });
        });
    },
    updateImage: function (req, res) {
        var userId = req.session.superUser._id;
        console.log(req.file);
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
                superUserSchema_1["default"].updateOne({
                    _id: userId
                }, { image: result.secure_url }).then(function () {
                    res.redirect('/profile?message=successfully updated');
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
    updateProfile: function (req, res) {
        var _a = req.body, name = _a.name, email = _a.email, companyName = _a.companyName, password = _a.password;
        if (req.session.superUser.password === password) {
            superUserSchema_1["default"].findOneAndUpdate({ _id: req.session.superUser._id }, { $set: { name: name, email: email, companyName: companyName } }, { returnOriginal: false }).then(function (superUser) {
                res.json({ status: true, message: 'Succesfully updated', data: superUser });
            })["catch"](function () {
                res.json({ status: false, message: 'Cannot update database facing issues' });
            });
        }
        else {
            res.json({ status: false, message: 'Password does not matches' });
        }
    },
    connections: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var superUserId, projectManagers, data, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    superUserId = new mongoose_1.Types.ObjectId(req.session.superUser._id);
                    return [4 /*yield*/, projectManagerSchema_1["default"].aggregate([{ $match: { superUserId: superUserId } },
                            {
                                $lookup: {
                                    from: 'project_collections',
                                    let: { projectManagerId: '$_id' },
                                    pipeline: [{ $match: { $expr: { $in: ['$$projectManagerId', '$projectManagers.projectManagerId'] } } }, {
                                            $project: {
                                                name: 1, projectManagers: {
                                                    $filter: {
                                                        input: "$projectManagers",
                                                        as: "pm",
                                                        cond: {
                                                            $and: [{ $eq: ["$$pm.projectManagerId", "$$projectManagerId"] },
                                                                { $eq: ["$$pm.status", true] }]
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            $match: { "projectManagers.status": true }
                                        }
                                    ],
                                    as: 'projects'
                                }
                            }])];
                case 1:
                    projectManagers = _a.sent();
                    data = {};
                    projectManagers.forEach(function (item) {
                        data[item.name] = item.projects;
                    });
                    message = req.query.message;
                    res.json({ tokenVerified: true, status: true, data: data, message: message });
                    return [2 /*return*/];
            }
        });
    }); },
    siteEngineerList: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var superUserId, projects, unAssignedSiteEngineers, data, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    superUserId = new mongoose_1.Types.ObjectId(req.session.superUser._id);
                    return [4 /*yield*/, projectSchema_1["default"].aggregate([{ $match: { superUserId: superUserId } }, {
                                $lookup: {
                                    from: 'site_engineer_collections',
                                    let: { projectId: '$_id' },
                                    pipeline: [{ $match: { $expr: { $in: ['$$projectId', "$projects.projectId"] } } }, {
                                            $project: {
                                                name: 1, projects: {
                                                    $filter: {
                                                        input: "$projects",
                                                        as: "project",
                                                        cond: {
                                                            $and: [{ $eq: ["$$project.projectId", "$$projectId"] },
                                                                { $eq: ["$$project.status", true] }]
                                                        }
                                                    }
                                                }
                                            }
                                        }, {
                                            $match: { "projects.status": true }
                                        }],
                                    as: 'siteEngineers'
                                }
                            }])];
                case 1:
                    projects = _a.sent();
                    return [4 /*yield*/, siteEngineerSchema_1["default"].aggregate([{ $match: { superUserId: superUserId } }, {
                                $project: {
                                    name: 1, projects: {
                                        $filter: {
                                            input: "$projects",
                                            as: 'project',
                                            cond: { $eq: ["$$project.status", true] }
                                        }
                                    }
                                }
                            }, { $match: { projects: [] } }])];
                case 2:
                    unAssignedSiteEngineers = _a.sent();
                    console.log(unAssignedSiteEngineers);
                    data = {};
                    data.unAssigned = unAssignedSiteEngineers;
                    projects.map(function (item) {
                        data[item.name] = item.siteEngineers;
                    });
                    message = req.query.message;
                    res.json({ tokenVerified: true, data: data, message: message, status: true });
                    return [2 /*return*/];
            }
        });
    }); },
    siteEngineerAssignment: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, startColumn, dragStartIndex, movingItem, endColumn, dragEnterIndex, endProject, startProject, movingItemId, siteEngineer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, startColumn = _a.startColumn, dragStartIndex = _a.dragStartIndex, movingItem = _a.movingItem, endColumn = _a.endColumn, dragEnterIndex = _a.dragEnterIndex;
                    return [4 /*yield*/, projectSchema_1["default"].findOne({ name: endColumn })];
                case 1:
                    endProject = _b.sent();
                    return [4 /*yield*/, projectSchema_1["default"].findOne({ name: startColumn })];
                case 2:
                    startProject = _b.sent();
                    movingItemId = new mongoose_1.Types.ObjectId(movingItem._id);
                    if (!(startColumn !== endColumn)) return [3 /*break*/, 8];
                    if (!startProject) return [3 /*break*/, 5];
                    return [4 /*yield*/, siteEngineerSchema_1["default"].updateOne({ _id: movingItemId, "projects.projectId": startProject._id }, { $set: { "projects.$.status": false, currentTaskOrder: [] } })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskShema_1["default"].updateMany({ projectId: startProject._id, "siteEngineers.siteEngineerId": new mongoose_1.Types.ObjectId(movingItemId) }, { $set: { "siteEngineers.$.status": false } })];
                case 4:
                    _b.sent();
                    console.log(typeof (movingItemId));
                    console.log(typeof (movingItem));
                    _b.label = 5;
                case 5:
                    siteEngineer = void 0;
                    if (!endProject) return [3 /*break*/, 8];
                    return [4 /*yield*/, siteEngineerSchema_1["default"].findOneAndUpdate({ _id: movingItemId, "projects.projectId": endProject._id }, { $set: { "projects.$.status": true } })];
                case 6:
                    siteEngineer = _b.sent();
                    if (!!siteEngineer) return [3 /*break*/, 8];
                    return [4 /*yield*/, siteEngineerSchema_1["default"].updateOne({ _id: movingItemId }, { $push: { projects: { projectId: endProject._id, status: true } } })];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    res.redirect('/siteengineerlist?message=Succesfully updated');
                    return [2 /*return*/];
            }
        });
    }); },
    updateProjectAssingment: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, startColumn, dragStartIndex, movingItem, endColumn, dragEnterIndex, superUserId, movingItemId, endProjectManager, startProjectManager, project, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 11, , 12]);
                    _a = req.body, startColumn = _a.startColumn, dragStartIndex = _a.dragStartIndex, movingItem = _a.movingItem, endColumn = _a.endColumn, dragEnterIndex = _a.dragEnterIndex;
                    superUserId = new mongoose_1.Types.ObjectId(req.session.superUser._id);
                    movingItemId = new mongoose_1.Types.ObjectId(movingItem._id);
                    return [4 /*yield*/, projectManagerSchema_1["default"].findOne({ name: endColumn })];
                case 1:
                    endProjectManager = _b.sent();
                    return [4 /*yield*/, projectManagerSchema_1["default"].findOne({ name: startColumn })];
                case 2:
                    startProjectManager = _b.sent();
                    if (!startProjectManager) return [3 /*break*/, 4];
                    return [4 /*yield*/, projectSchema_1["default"].updateOne({ _id: movingItemId, "projectManagers.projectManagerId": startProjectManager._id }, { $set: { "projectManagers.$.status": false } })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    project = void 0;
                    if (!endProjectManager) return [3 /*break*/, 7];
                    return [4 /*yield*/, projectSchema_1["default"].findOneAndUpdate({ _id: movingItemId, "projectManagers.projectManagerId": endProjectManager._id }, { $set: { "projectManagers.$.status": true } })];
                case 5:
                    project = _b.sent();
                    if (!!project) return [3 /*break*/, 7];
                    return [4 /*yield*/, projectSchema_1["default"].updateOne({ _id: movingItemId }, { $push: { projectManagers: { projectManagerId: endProjectManager._id, status: true } } })];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    if (!(endColumn == "unAssigned")) return [3 /*break*/, 10];
                    return [4 /*yield*/, siteEngineerSchema_1["default"].updateMany({ superUserId: superUserId, "projects.projectId": movingItemId }, { $set: { "projects.$.status": false, currentTaskOrder: [] } })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, taskShema_1["default"].updateMany({ projectId: movingItemId, "siteEngineers.status": true }, { $set: { "siteEngineers.$.status": false } })];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    res.redirect('/connections?message=Succesfully updated');
                    return [3 /*break*/, 12];
                case 11:
                    err_3 = _b.sent();
                    res.json({ status: false, message: 'updation failed' });
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); },
    addConnection: function (req, res) {
        var email = req.body.connection;
        var position = req.body.designation;
        if (email && position) {
            var _a = req.session.superUser, _id = _a._id, companyName = _a.companyName;
            var connectionObject = (0, nodeMailer_1.newConnectionObject)(companyName);
            var logginUserName = connectionObject.logginUserName, password = connectionObject.password;
            var mailOptions = (0, nodeMailer_1.newConnectionMailObject)(email, connectionObject);
            var name_1 = email.split('@');
            var newConnectionData_1 = {
                email: email,
                name: name_1[0],
                companyName: companyName,
                superUserId: _id,
                logginUserName: logginUserName,
                password: password,
                position: position
            };
            (0, nodeMailer_1.mailService)(mailOptions).then(function () {
                if (position == 'projectManager') {
                    projectManagerSchema_1["default"].insertMany([newConnectionData_1]).then(function () {
                        res.redirect('/connections?message=Site engineer added successfully');
                    })["catch"](function () {
                        res.json({ status: false, message: 'Connection cannot be added right now-database issue' });
                    });
                }
                else if (position == 'siteEngineer') {
                    siteEngineerSchema_1["default"].insertMany([newConnectionData_1]).then(function () {
                        res.json({ status: true, message: 'SiteEngineer added succesfully' });
                    })["catch"](function () {
                        res.json({ status: false, message: 'Connection cannot be added right now-database issue' });
                    });
                }
            })["catch"](function () {
                res.json({ status: false, message: 'Connection cannot be added right, nodemailer issue' });
            });
        }
        else {
            res.json({ status: false, message: 'Invalid email or designation' });
        }
    },
    paymentComplete: function (req, res) {
        superUserSchema_1["default"].updateOne({ _id: req.session.superUser._id }, { $set: { membership: req.body.plan } }).then(function () {
            res.json({ superUserToken: true, status: true, message: 'Your membership is updated' });
        })["catch"](function () {
            res.json({ superUserToken: true, status: false, message: 'Cannot update the membership' });
        });
    }
};
exports["default"] = superUseController;
