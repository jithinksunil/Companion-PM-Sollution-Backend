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
const projectManagerSchema_1 = __importDefault(require("../../models/projectManagerSchema"));
const mongoose_1 = require("mongoose");
const projectController = {
    projects: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { search } = req.query;
            if (!search) {
                search = '';
            }
            const unAssignedProjectManager = yield projectManagerSchema_1.default.findOne({ superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id), name: 'unAssigned' });
            if (!unAssignedProjectManager) {
                console.log(Date.now());
                console.log(typeof (unAssignedProjectManager));
                console.log(unAssignedProjectManager);
                yield projectManagerSchema_1.default.insertMany([{ name: 'unAssigned', superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id) }]);
            }
            const projectManagersList = yield projectManagerSchema_1.default.aggregate([{ $match: { superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id) } }, { $project: { name: 1 } }]);
            const projectsList = yield projectSchema_1.default.aggregate([{ $match: { $and: [{ superUserId: new mongoose_1.Types.ObjectId(req.session.superUser._id) }, { $or: [{ name: {
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
                        progress: 1,
                    } }]);
            const data = { projectsList, projectManagersList };
            let message;
            if (req.query.message) {
                message = req.query.message;
            }
            res.json({ tokenVerified: true, data, message, status: true });
        }
        catch (err) {
            res.json({ tokenVerified: true, message: 'Cannot get details now ' });
            console.log(err);
        }
    }),
    createProject: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { name, place } = req.body;
            let { projectManagerId, lati, longi, budget } = req.body;
            if (!projectManagerId || projectManagerId == "unAssigned") {
                const unAssignedPm = yield projectManagerSchema_1.default.findOne({ name: "unAssigned" });
                projectManagerId = unAssignedPm === null || unAssignedPm === void 0 ? void 0 : unAssignedPm.toObject()._id;
            }
            else {
                projectManagerId = new mongoose_1.Types.ObjectId(projectManagerId);
            }
            const superUserId = new mongoose_1.Types.ObjectId(req.session.superUser._id);
            lati = parseFloat(lati);
            longi = parseFloat(longi);
            budget = parseFloat(budget);
            console.log(projectManagerId);
            yield projectSchema_1.default.insertMany([{ name, place, budget, location: { lati, longi }, projectManagers: [{ projectManagerId, status: true }], superUserId }]);
            res.redirect('/project?message=Project added');
        }
        catch (err) {
            console.log(err);
            res.json({ tokenVerified: true, status: false, message: 'Project cannotbe added to data base right now' });
        }
    })
};
exports.default = projectController;
