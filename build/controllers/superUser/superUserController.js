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
const superUserSchema_1 = __importDefault(require("../../models/superUserSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const nodeMailer_1 = require("../../config/nodeMailer");
const projectManagerSchema_1 = __importDefault(require("../../models/projectManagerSchema"));
const projectSchema_1 = __importDefault(require("../../models/projectSchema"));
const mongoose_1 = require("mongoose");
const siteEngineerSchema_1 = __importDefault(require("../../models/siteEngineerSchema"));
const taskShema_1 = __importDefault(require("../../models/taskShema"));
const ErrorResponse_1 = __importDefault(require("../../error/ErrorResponse"));
const guestRepository_1 = require("../../dataBaserepository/guestRepository");
const superUseController = {
    verifyToken: (req, res) => {
        res
            .status(200)
            .json({ tokenVerified: true, message: 'Super user token verified' });
    },
    logout: (req, res) => {
        req.session.destroy();
        res.status(200).json({ status: true, message: 'Succesfully Logged Out' });
    },
    signUp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // any data can be recieved now so must be validated befor saving to database
        try {
            const { email } = req.body;
            console.log(req.body);
            const superUserExist = yield superUserSchema_1.default.findOne({ email });
            if (superUserExist) {
                res.status(409).json({ status: false, message: 'User already exist' });
            }
            else {
                superUserSchema_1.default
                    .insertMany([req.body])
                    .then(() => {
                    console.log('added');
                    res
                        .status(200)
                        .json({ status: true, message: 'Signin Successfullllll' });
                })
                    .catch(() => {
                    next(ErrorResponse_1.default.internalError('Database facing issues'));
                });
            }
        }
        catch (err) {
            next(ErrorResponse_1.default.internalError('Database facing issues'));
        }
    }),
    logIn: (req, res) => {
        console.log('reached');
        const password = req.body.password;
        const email = req.body.email;
        superUserSchema_1.default
            .findOne({ email })
            .then((superUserData) => {
            if (superUserData) {
                if (password === superUserData.password) {
                    const superUser = superUserData.toObject();
                    const token = jsonwebtoken_1.default.sign(superUser, 'mySecretKeyForSuperUser', {
                        expiresIn: '1h',
                    });
                    res.json({
                        verified: true,
                        data: superUser,
                        message: 'Succesfully logged in',
                        token,
                    });
                }
                else {
                    res.json({ verified: false, message: 'Wrong email or password' });
                }
            }
            else {
                res.json({ verified: false, message: 'User does not exist' });
            }
        })
            .catch((reject) => {
            console.log(reject);
            res.json({
                verified: false,
                message: 'Sorry for Interuption ,Database facing issues',
            });
        });
    },
    guestLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let token = req.cookies.superUserToken;
            let guest = yield (0, guestRepository_1.findGuest)(token);
            if (guest && guest.position === 'guest') {
                return res.status(200).json({ verified: true, data: guest, token });
            }
            token = jsonwebtoken_1.default.sign({ name: 'guest', createdAt: Date.now() }, 'mySecretKeyForSuperUser', { expiresIn: '30m' });
            guest = yield (0, guestRepository_1.createAndGetGuest)(token);
            res
                .status(200)
                .json({
                verified: true,
                data: guest,
                token,
                message: 'Logged in as Guest',
            });
        }
        catch (err) {
            res.status(500).json({ message: 'Error on creating guest,try later' });
        }
    }),
    superUserDashBoard: (req, res) => {
        let message;
        if (req.remainingTime) {
            message = `You have ${req.remainingTime} minutes remaining`;
        }
        res.json({ tokenVerified: true, message });
    },
    superUserProfile: (req, res) => {
        superUserSchema_1.default
            .findOne({ _id: req.superUser._id })
            .then((superUserData) => {
            const message = req.query.message;
            res.json({
                tokenVerified: true,
                data: superUserData,
                status: true,
                message,
            });
        })
            .catch(() => {
            res.json({
                tokenVerified: true,
                message: 'Cannot fetch data now data base issue',
            });
        });
    },
    updateImage: (req, res) => {
        const userId = req.superUser._id;
        console.log(req.file);
        if (req.file) {
            cloudinaryConfig_1.default.uploader
                .upload(req.file.path, {
                transformation: [
                    {
                        width: 485,
                        height: 485,
                        gravity: 'face',
                        crop: 'fill',
                    },
                ],
            })
                .then((result) => {
                superUserSchema_1.default
                    .updateOne({
                    _id: userId,
                }, { image: result.secure_url })
                    .then(() => {
                    res.redirect('/profile?message=successfully updated');
                })
                    .catch(() => {
                    res.json({
                        staus: false,
                        message: 'data base facing issue try later',
                    });
                });
            })
                .catch((err) => {
                res.json({
                    status: false,
                    message: 'cannot upload now to cloudinary',
                });
            });
        }
        else {
            res.json({ status: false, message: 'Select a jpeg format' });
        }
    },
    updateProfile: (req, res) => {
        const { name, email, companyName, password } = req.body;
        if (req.superUser.password === password) {
            superUserSchema_1.default
                .findOneAndUpdate({ _id: req.superUser._id }, { $set: { name, email, companyName } }, { returnOriginal: false })
                .then((superUser) => {
                res.json({
                    status: true,
                    message: 'Succesfully updated',
                    data: superUser,
                });
            })
                .catch(() => {
                res.json({
                    status: false,
                    message: 'Cannot update database facing issues',
                });
            });
        }
        else {
            res.json({ status: false, message: 'Password does not matches' });
        }
    },
    connections: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const superUserId = new mongoose_1.Types.ObjectId(req.superUser._id);
        const projectManagers = yield projectManagerSchema_1.default.aggregate([
            { $match: { superUserId } },
            {
                $lookup: {
                    from: 'project_collections',
                    let: { projectManagerId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        '$$projectManagerId',
                                        '$projectManagers.projectManagerId',
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                projectManagers: {
                                    $filter: {
                                        input: '$projectManagers',
                                        as: 'pm',
                                        cond: {
                                            $and: [
                                                {
                                                    $eq: ['$$pm.projectManagerId', '$$projectManagerId'],
                                                },
                                                { $eq: ['$$pm.status', true] },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $match: { 'projectManagers.status': true },
                        },
                    ],
                    as: 'projects',
                },
            },
        ]);
        const data = {};
        projectManagers.forEach((item) => {
            data[item.name] = item.projects;
        });
        const message = req.query.message;
        res.json({ tokenVerified: true, status: true, data, message });
    }),
    siteEngineerList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const superUserId = new mongoose_1.Types.ObjectId(req.superUser._id);
        const projects = yield projectSchema_1.default.aggregate([
            { $match: { superUserId } },
            {
                $lookup: {
                    from: 'site_engineer_collections',
                    let: { projectId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$$projectId', '$projects.projectId'] },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                projects: {
                                    $filter: {
                                        input: '$projects',
                                        as: 'project',
                                        cond: {
                                            $and: [
                                                { $eq: ['$$project.projectId', '$$projectId'] },
                                                { $eq: ['$$project.status', true] },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $match: { 'projects.status': true },
                        },
                    ],
                    as: 'siteEngineers',
                },
            },
        ]);
        const unAssignedSiteEngineers = yield siteEngineerSchema_1.default.aggregate([
            { $match: { superUserId } },
            {
                $project: {
                    name: 1,
                    projects: {
                        $filter: {
                            input: '$projects',
                            as: 'project',
                            cond: { $eq: ['$$project.status', true] },
                        },
                    },
                },
            },
            { $match: { projects: [] } },
        ]);
        console.log(unAssignedSiteEngineers);
        const data = {};
        data.unAssigned = unAssignedSiteEngineers;
        projects.map((item) => {
            data[item.name] = item.siteEngineers;
        });
        const message = req.query.message;
        res.json({ tokenVerified: true, data, message, status: true });
    }),
    siteEngineerAssignment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { startColumn, dragStartIndex, movingItem, endColumn, dragEnterIndex, } = req.body;
        const endProject = yield projectSchema_1.default.findOne({ name: endColumn });
        const startProject = yield projectSchema_1.default.findOne({ name: startColumn });
        const movingItemId = new mongoose_1.Types.ObjectId(movingItem._id);
        if (startColumn !== endColumn) {
            if (startProject) {
                yield siteEngineerSchema_1.default.updateOne({ _id: movingItemId, 'projects.projectId': startProject._id }, { $set: { 'projects.$.status': false, currentTaskOrder: [] } });
                yield taskShema_1.default.updateMany({
                    projectId: startProject._id,
                    'siteEngineers.siteEngineerId': new mongoose_1.Types.ObjectId(movingItemId),
                }, { $set: { 'siteEngineers.$.status': false } });
                console.log(typeof movingItemId);
                console.log(typeof movingItem);
            }
            let siteEngineer;
            if (endProject) {
                siteEngineer = yield siteEngineerSchema_1.default.findOneAndUpdate({ _id: movingItemId, 'projects.projectId': endProject._id }, { $set: { 'projects.$.status': true } });
                if (!siteEngineer) {
                    yield siteEngineerSchema_1.default.updateOne({ _id: movingItemId }, { $push: { projects: { projectId: endProject._id, status: true } } });
                }
            }
        }
        res.redirect('/siteengineerlist?message=Succesfully updated');
    }),
    updateProjectAssingment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { startColumn, dragStartIndex, movingItem, endColumn, dragEnterIndex, } = req.body;
            const superUserId = new mongoose_1.Types.ObjectId(req.superUser._id);
            const movingItemId = new mongoose_1.Types.ObjectId(movingItem._id);
            const endProjectManager = yield projectManagerSchema_1.default.findOne({
                name: endColumn,
            });
            const startProjectManager = yield projectManagerSchema_1.default.findOne({
                name: startColumn,
            });
            if (startProjectManager) {
                yield projectSchema_1.default.updateOne({
                    _id: movingItemId,
                    'projectManagers.projectManagerId': startProjectManager._id,
                }, { $set: { 'projectManagers.$.status': false } });
            }
            let project;
            if (endProjectManager) {
                project = yield projectSchema_1.default.findOneAndUpdate({
                    _id: movingItemId,
                    'projectManagers.projectManagerId': endProjectManager._id,
                }, { $set: { 'projectManagers.$.status': true } });
                if (!project) {
                    yield projectSchema_1.default.updateOne({ _id: movingItemId }, {
                        $push: {
                            projectManagers: {
                                projectManagerId: endProjectManager._id,
                                status: true,
                            },
                        },
                    });
                }
            }
            if (endColumn == 'unAssigned') {
                yield siteEngineerSchema_1.default.updateMany({ superUserId, 'projects.projectId': movingItemId }, { $set: { 'projects.$.status': false, currentTaskOrder: [] } });
                yield taskShema_1.default.updateMany({ projectId: movingItemId, 'siteEngineers.status': true }, { $set: { 'siteEngineers.$.status': false } });
            }
            res.redirect('/connections?message=Succesfully updated');
        }
        catch (err) {
            res.json({ status: false, message: 'updation failed' });
        }
    }),
    addConnection: (req, res) => {
        const email = req.body.connection;
        const position = req.body.designation;
        if (email && position) {
            const { _id, companyName } = req.superUser;
            const connectionObject = (0, nodeMailer_1.newConnectionObject)(companyName);
            const { logginUserName, password } = connectionObject;
            const mailOptions = (0, nodeMailer_1.newConnectionMailObject)(email, connectionObject);
            const name = email.split('@');
            const newConnectionData = {
                email,
                name: name[0],
                companyName,
                superUserId: _id,
                logginUserName,
                password,
                position,
            };
            (0, nodeMailer_1.mailService)(mailOptions)
                .then(() => {
                if (position == 'projectManager') {
                    projectManagerSchema_1.default
                        .insertMany([newConnectionData])
                        .then(() => {
                        res.redirect('/connections?message=Site engineer added successfully');
                    })
                        .catch(() => {
                        res.json({
                            status: false,
                            message: 'Connection cannot be added right now-database issue',
                        });
                    });
                }
                else if (position == 'siteEngineer') {
                    siteEngineerSchema_1.default
                        .insertMany([newConnectionData])
                        .then(() => {
                        res.json({
                            status: true,
                            message: 'SiteEngineer added succesfully',
                        });
                    })
                        .catch(() => {
                        res.json({
                            status: false,
                            message: 'Connection cannot be added right now-database issue',
                        });
                    });
                }
            })
                .catch(() => {
                res.json({
                    status: false,
                    message: 'Connection cannot be added right, nodemailer issue',
                });
            });
        }
        else {
            res.json({ status: false, message: 'Invalid email or designation' });
        }
    },
    paymentComplete: (req, res) => {
        superUserSchema_1.default
            .updateOne({ _id: req.superUser._id }, { $set: { membership: req.body.plan } })
            .then(() => {
            res.json({
                superUserToken: true,
                status: true,
                message: 'Your membership is updated',
            });
        })
            .catch(() => {
            res.json({
                superUserToken: true,
                status: false,
                message: 'Cannot update the membership',
            });
        });
    },
};
exports.default = superUseController;
