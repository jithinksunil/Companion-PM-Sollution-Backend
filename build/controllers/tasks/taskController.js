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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const projectSchema_1 = __importDefault(require("../../models/projectSchema"));
const siteEngineerSchema_1 = __importDefault(require("../../models/siteEngineerSchema"));
const taskShema_1 = __importDefault(require("../../models/taskShema"));
const mongoose_1 = require("mongoose");
const taskController = {
    tasks: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projectManagerId = new mongoose_1.Types.ObjectId(req.session.projectManager._id);
        projectSchema_1.default.aggregate([
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
        ]).then((projects) => {
            const data = [...projects];
            data.forEach((item) => {
                const onDutySiteEngineers = {};
                onDutySiteEngineers.unAssignedTasks = item.unAssignedTasks;
                item.onDutySiteEngineers.forEach((eng) => {
                    onDutySiteEngineers[eng.name] = eng.taskDetails;
                });
                item.onDutySiteEngineers = onDutySiteEngineers;
            });
            const message = req.query.message;
            res.json({ tokenVerified: true, data, message, status: true });
        }).catch((err) => {
            console.log(err);
            res.json({ message: "data base facing issues to fetch the tasks now" });
        });
    }),
    taskAssignment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { startColumn, endColumn, dragEnterIndex, movingItem } = req.body;
        const movingItemId = new mongoose_1.Types.ObjectId(movingItem._id);
        const startSiteEngineer = yield siteEngineerSchema_1.default.findOneAndUpdate({ name: startColumn }, { $pull: { currentTaskOrder: movingItemId } }, { returnOriginal: false });
        const endSiteEngineer = yield siteEngineerSchema_1.default.findOne({ name: endColumn });
        if (startSiteEngineer) {
            yield taskShema_1.default.updateOne({ _id: movingItemId, "siteEngineers.siteEngineerId": startSiteEngineer._id }, { $set: { "siteEngineers.$.status": false } });
        }
        if (endSiteEngineer) {
            const currentTaskOrder = endSiteEngineer.toObject().currentTaskOrder;
            currentTaskOrder.splice(dragEnterIndex, 0, movingItemId);
            yield siteEngineerSchema_1.default.updateOne({ name: endColumn }, { currentTaskOrder });
            const matched = yield taskShema_1.default.findOne({ _id: movingItemId, "siteEngineers.siteEngineerId": endSiteEngineer._id });
            if (matched) {
                yield taskShema_1.default.updateOne({ _id: movingItemId, "siteEngineers.siteEngineerId": endSiteEngineer._id }, { "siteEngineers.$.status": true });
            }
            else {
                yield taskShema_1.default.updateOne({ _id: movingItemId }, { $push: { siteEngineers: { "siteEngineerId": endSiteEngineer._id, "status": true } } });
            }
        }
        if (startColumn == 'unAssigned') {
            yield taskShema_1.default.updateOne({ _id: movingItemId }, {});
        }
        res.redirect('/task?message=Successfull updated');
    }),
    add: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { siteEngineerName, projectId } = req.query;
            const { task } = req.body;
            const siteEngineer = yield siteEngineerSchema_1.default.findOne({ name: siteEngineerName });
            const project = yield projectSchema_1.default.findOne({ _id: projectId });
            let taskData;
            let currentTaskOrder;
            if (siteEngineer && project) {
                yield taskShema_1.default.insertMany([{ name: task, siteEngineers: [{ siteEngineerId: siteEngineer._id, status: true }], projectId: project._id }]);
                taskData = yield taskShema_1.default.findOne({ name: task, "siteEngineers.$.siteEngineerId": siteEngineer._id, "siteEngineers.$.status": true });
                currentTaskOrder = siteEngineer.currentTaskOrder;
                if (currentTaskOrder) {
                    if (taskData)
                        currentTaskOrder.splice(0, 0, taskData._id);
                }
                else {
                    currentTaskOrder = [taskData === null || taskData === void 0 ? void 0 : taskData._id];
                }
                yield siteEngineerSchema_1.default.updateOne({ name: siteEngineerName }, { currentTaskOrder });
            }
            else if (siteEngineerName == "unAssignedTasks" && project) {
                yield taskShema_1.default.insertMany([{ name: task, siteEngineers: [], projectId: project._id }]);
            }
            res.redirect('/task?message=Task added');
        }
        catch (err) {
            res.json({ message: "cannot save the task right now" });
        }
    })
};
exports.default = taskController;
