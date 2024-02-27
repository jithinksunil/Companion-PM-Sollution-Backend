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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var projectSchema_1 = require("../../models/projectSchema");
var siteEngineerSchema_1 = require("../../models/siteEngineerSchema");
var taskShema_1 = require("../../models/taskShema");
var mongoose_1 = require("mongoose");
var taskController = {
    tasks: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var projectManagerId;
        return __generator(this, function (_a) {
            projectManagerId = new mongoose_1.Types.ObjectId(req.session.projectManager._id);
            projectSchema_1["default"].aggregate([
                { $match: { "projectManagers.projectManagerId": projectManagerId } },
                {
                    $project: {
                        name: 1,
                        projectManagers: {
                            $filter: {
                                input: "$projectManagers",
                                as: 'pm',
                                cond: {
                                    $and: [
                                        { $eq: ["$$pm.projectManagerId", projectManagerId] },
                                        { $eq: ["$$pm.status", true] }
                                    ]
                                }
                            }
                        }
                    }
                }, { $match: { "projectManagers.projectManagerId": projectManagerId } },
                {
                    $lookup: {
                        from: "site_engineer_collections",
                        let: { projectId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $in: ["$$projectId", "$projects.projectId"] }
                                }
                            }, {
                                $project: {
                                    name: 1,
                                    currentTaskOrder: 1,
                                    projects: {
                                        $filter: {
                                            input: "$projects",
                                            as: 'project',
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$project.projectId", "$$projectId"] },
                                                    { $eq: ["$$project.status", true] }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }, { $match: { "projects.status": true } }, {
                                $lookup: {
                                    from: "task_collections",
                                    let: { task: '$currentTaskOrder' },
                                    pipeline: [{ $match: { $expr: { $in: ['$_id', '$$task'] } } }, { $project: { name: 1 } }],
                                    as: "taskDetails"
                                }
                            },
                            { $project: { name: 1, taskDetails: 1 } }
                        ],
                        as: "onDutySiteEngineers"
                    }
                }, {
                    $lookup: {
                        from: "task_collections",
                        let: { projectId: '$_id' },
                        pipeline: [{ $match: { $expr: { $eq: ["$projectId", "$$projectId"] } } }, {
                                $project: {
                                    name: 1, siteEngineers: {
                                        $filter: {
                                            input: "$siteEngineers",
                                            as: "siteEngineer",
                                            cond: {
                                                $eq: ["$$siteEngineer.status", true]
                                            }
                                        }
                                    }
                                }
                            }, { $match: { siteEngineers: [] } }],
                        as: 'unAssignedTasks'
                    }
                },
                { $project: { projectId: "$_id", _id: 0, name: 1, onDutySiteEngineers: 1, unAssignedTasks: 1 } }
            ]).then(function (projects) {
                var data = __spreadArray([], projects, true);
                data.forEach(function (item) {
                    var onDutySiteEngineers = {};
                    onDutySiteEngineers.unAssignedTasks = item.unAssignedTasks;
                    item.onDutySiteEngineers.forEach(function (eng) {
                        onDutySiteEngineers[eng.name] = eng.taskDetails;
                    });
                    item.onDutySiteEngineers = onDutySiteEngineers;
                });
                var message = req.query.message;
                res.json({ tokenVerified: true, data: data, message: message, status: true });
            })["catch"](function (err) {
                console.log(err);
                res.json({ message: "data base facing issues to fetch the tasks now" });
            });
            return [2 /*return*/];
        });
    }); },
    taskAssignment: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, startColumn, endColumn, dragEnterIndex, movingItem, movingItemId, startSiteEngineer, endSiteEngineer, currentTaskOrder, matched;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, startColumn = _a.startColumn, endColumn = _a.endColumn, dragEnterIndex = _a.dragEnterIndex, movingItem = _a.movingItem;
                    movingItemId = new mongoose_1.Types.ObjectId(movingItem._id);
                    return [4 /*yield*/, siteEngineerSchema_1["default"].findOneAndUpdate({ name: startColumn }, { $pull: { currentTaskOrder: movingItemId } }, { returnOriginal: false })];
                case 1:
                    startSiteEngineer = _b.sent();
                    return [4 /*yield*/, siteEngineerSchema_1["default"].findOne({ name: endColumn })];
                case 2:
                    endSiteEngineer = _b.sent();
                    if (!startSiteEngineer) return [3 /*break*/, 4];
                    return [4 /*yield*/, taskShema_1["default"].updateOne({ _id: movingItemId, "siteEngineers.siteEngineerId": startSiteEngineer._id }, { $set: { "siteEngineers.$.status": false } })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    if (!endSiteEngineer) return [3 /*break*/, 10];
                    currentTaskOrder = endSiteEngineer.toObject().currentTaskOrder;
                    currentTaskOrder.splice(dragEnterIndex, 0, movingItemId);
                    return [4 /*yield*/, siteEngineerSchema_1["default"].updateOne({ name: endColumn }, { currentTaskOrder: currentTaskOrder })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskShema_1["default"].findOne({ _id: movingItemId, "siteEngineers.siteEngineerId": endSiteEngineer._id })];
                case 6:
                    matched = _b.sent();
                    if (!matched) return [3 /*break*/, 8];
                    return [4 /*yield*/, taskShema_1["default"].updateOne({ _id: movingItemId, "siteEngineers.siteEngineerId": endSiteEngineer._id }, { "siteEngineers.$.status": true })];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, taskShema_1["default"].updateOne({ _id: movingItemId }, { $push: { siteEngineers: { "siteEngineerId": endSiteEngineer._id, "status": true } } })];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    if (!(startColumn == 'unAssigned')) return [3 /*break*/, 12];
                    return [4 /*yield*/, taskShema_1["default"].updateOne({ _id: movingItemId }, {})];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    res.redirect('/task?message=Successfull updated');
                    return [2 /*return*/];
            }
        });
    }); },
    add: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, siteEngineerName, projectId, task, siteEngineer, project, taskData, currentTaskOrder, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    _a = req.query, siteEngineerName = _a.siteEngineerName, projectId = _a.projectId;
                    task = req.body.task;
                    return [4 /*yield*/, siteEngineerSchema_1["default"].findOne({ name: siteEngineerName })];
                case 1:
                    siteEngineer = _b.sent();
                    return [4 /*yield*/, projectSchema_1["default"].findOne({ _id: projectId })];
                case 2:
                    project = _b.sent();
                    taskData = void 0;
                    currentTaskOrder = void 0;
                    if (!(siteEngineer && project)) return [3 /*break*/, 6];
                    return [4 /*yield*/, taskShema_1["default"].insertMany([{ name: task, siteEngineers: [{ siteEngineerId: siteEngineer._id, status: true }], projectId: project._id }])];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskShema_1["default"].findOne({ name: task, "siteEngineers.$.siteEngineerId": siteEngineer._id, "siteEngineers.$.status": true })];
                case 4:
                    taskData = _b.sent();
                    currentTaskOrder = siteEngineer.currentTaskOrder;
                    if (currentTaskOrder) {
                        if (taskData)
                            currentTaskOrder.splice(0, 0, taskData._id);
                    }
                    else {
                        currentTaskOrder = [taskData === null || taskData === void 0 ? void 0 : taskData._id];
                    }
                    return [4 /*yield*/, siteEngineerSchema_1["default"].updateOne({ name: siteEngineerName }, { currentTaskOrder: currentTaskOrder })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6:
                    if (!(siteEngineerName == "unAssignedTasks" && project)) return [3 /*break*/, 8];
                    return [4 /*yield*/, taskShema_1["default"].insertMany([{ name: task, siteEngineers: [], projectId: project._id }])];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    res.redirect('/task?message=Task added');
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _b.sent();
                    res.json({ message: "cannot save the task right now" });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); }
};
exports["default"] = taskController;
