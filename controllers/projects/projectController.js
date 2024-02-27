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
var projectSchema_1 = require("../../models/projectSchema");
var projectManagerSchema_1 = require("../../models/projectManagerSchema");
var mongoose_1 = require("mongoose");
var projectController = {
    projects: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var search, unAssignedProjectManager, projectManagersList, projectsList, data, message, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    search = req.query.search;
                    if (!search) {
                        search = '';
                    }
                    return [4 /*yield*/, projectManagerSchema_1["default"].findOne({ superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id), name: 'unAssigned' })];
                case 1:
                    unAssignedProjectManager = _a.sent();
                    if (!!unAssignedProjectManager) return [3 /*break*/, 3];
                    console.log(Date.now());
                    console.log(typeof (unAssignedProjectManager));
                    console.log(unAssignedProjectManager);
                    return [4 /*yield*/, projectManagerSchema_1["default"].insertMany([{ name: 'unAssigned', superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id) }])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, projectManagerSchema_1["default"].aggregate([{ $match: { superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id) } }, { $project: { name: 1 } }])];
                case 4:
                    projectManagersList = _a.sent();
                    return [4 /*yield*/, projectSchema_1["default"].aggregate([{ $match: { $and: [{ superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id) }, { $or: [{ name: {
                                                        $regex: search,
                                                        $options: 'i'
                                                    } }, { place: {
                                                        $regex: search,
                                                        $options: 'i'
                                                    } }] }] } }, { $unwind: "$projectManagers" }, { $match: { "projectManagers.status": true } }, { $lookup: {
                                    from: 'project_manager_collections',
                                    foreignField: '_id',
                                    localField: 'projectManagers.projectManagerId',
                                    as: 'projectManager'
                                } }, { $project: {
                                    projectManagerName: '$projectManager.name',
                                    name: 1,
                                    place: 1,
                                    location: 1,
                                    budget: 1,
                                    status: 1,
                                    progress: 1
                                } }])];
                case 5:
                    projectsList = _a.sent();
                    data = { projectsList: projectsList, projectManagersList: projectManagersList };
                    message = void 0;
                    if (req.query.message) {
                        message = req.query.message;
                    }
                    res.json({ tokenVerified: true, data: data, message: message, status: true });
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    res.json({ tokenVerified: true, message: 'Cannot get details now ' });
                    console.log(err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    createProject: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, name_1, place, _b, projectManagerId, lati, longi, budget, unAssignedPm, superUserId, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    console.log(req.body);
                    _a = req.body, name_1 = _a.name, place = _a.place;
                    _b = req.body, projectManagerId = _b.projectManagerId, lati = _b.lati, longi = _b.longi, budget = _b.budget;
                    if (!(!projectManagerId || projectManagerId == "unAssigned")) return [3 /*break*/, 2];
                    return [4 /*yield*/, projectManagerSchema_1["default"].findOne({ name: "unAssigned" })];
                case 1:
                    unAssignedPm = _c.sent();
                    projectManagerId = unAssignedPm === null || unAssignedPm === void 0 ? void 0 : unAssignedPm.toObject()._id;
                    return [3 /*break*/, 3];
                case 2:
                    projectManagerId = new mongoose_1.Types.ObjectId(projectManagerId);
                    _c.label = 3;
                case 3:
                    superUserId = new mongoose_1.Types.ObjectId(req.session.superUser._id);
                    lati = parseFloat(lati);
                    longi = parseFloat(longi);
                    budget = parseFloat(budget);
                    console.log(projectManagerId);
                    return [4 /*yield*/, projectSchema_1["default"].insertMany([{ name: name_1, place: place, budget: budget, location: { lati: lati, longi: longi }, projectManagers: [{ projectManagerId: projectManagerId, status: true }], superUserId: superUserId }])];
                case 4:
                    _c.sent();
                    res.redirect('/project?message=Project added');
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _c.sent();
                    console.log(err_2);
                    res.json({ tokenVerified: true, status: false, message: 'Project cannotbe added to data base right now' });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }
};
exports["default"] = projectController;
