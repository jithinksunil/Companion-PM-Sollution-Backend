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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const projectManagerSchema_1 = __importDefault(require("../../models/projectManagerSchema"));
const AttendeceSchema_1 = __importDefault(require("../../models/AttendeceSchema"));
const projectManagerController = {
    verifyToken: (req, res) => {
        res.json({ tokenVerified: true });
    },
    signUp: (req, res) => {
        projectManagerSchema_1.default.insertMany([req.body]).then(() => {
            res.json({ status: true });
        }).catch(() => {
            res.json({ status: false });
        });
    },
    logIn: (req, res) => {
        const password = req.body.password;
        const logginUserName = req.body.userName;
        projectManagerSchema_1.default.findOne({ logginUserName }).then((projectManager) => {
            if (projectManager) {
                if (password === projectManager.password) {
                    req.session.projectManager = projectManager.toObject(); // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const projectManagerData = projectManager.toObject();
                    const token = jsonwebtoken_1.default.sign(projectManagerData, 'mySecretKeyForProjectManager', { expiresIn: '1h' });
                    res.json({ verified: true, data: projectManager, message: 'Succesfully logged in', token });
                }
                else {
                    res.json({ verified: false, message: 'Wrong email or password' });
                }
            }
            else {
                res.json({ verified: false, message: 'User does not exist' });
            }
        }).catch((reject) => {
            console.log(reject);
            res.json({ verified: false, message: 'Sorry for Interuption ,Database facing issues' });
        });
    },
    projectManagerDashBoard: (req, res) => {
        const projectManagerData = req.session.projectManager;
        res.json({ tokenVerified: true, projectManagerData });
    },
    projectManagerProfile: (req, res) => {
        projectManagerSchema_1.default.findOne({ _id: req.session.projectManager._id }).then((projectManagerData) => {
            const message = req.query.message;
            res.json({ tokenVerified: true, data: projectManagerData, status: true, message });
        }).catch(() => {
            res.json({ tokenVerified: true, message: 'Cannot fetch data now data base issue' });
        });
    },
    updateImage: (req, res) => {
        const userId = req.session.projectManager._id;
        if (req.file) {
            cloudinaryConfig_1.default.uploader.upload(req.file.path, {
                transformation: [
                    {
                        width: 485,
                        height: 485,
                        gravity: "face",
                        crop: "fill"
                    }
                ]
            }).then((result) => {
                projectManagerSchema_1.default.updateOne({
                    _id: userId
                }, { image: result.secure_url }).then(() => {
                    res.redirect("/projectManager/profile?message=successfully updated");
                }).catch(() => {
                    res.json({ staus: false, message: 'data base facing issue try later' });
                });
            }).catch((err) => {
                res.json({ status: false, message: 'cannot upload now to cloudinary' });
            });
        }
        else {
            res.json({ status: false, message: 'Select a jpeg format' });
        }
    },
    markAttendence: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentDate = new Date().toJSON().slice(0, 10);
            const { _id, name } = req.session.projectManager;
            const attendeceSheet = yield AttendeceSchema_1.default.findOne({ date: currentDate });
            if (attendeceSheet) {
                const result = yield AttendeceSchema_1.default.findOne({ date: currentDate, "attendences._id": _id });
                if (result) {
                    res.json({ status: true, message: 'Attendece already marked' });
                }
                else {
                    yield AttendeceSchema_1.default.updateOne({ date: currentDate }, { $push: { attendences: { _id, name } } });
                    res.json({ status: true, message: 'Attendece Marked' });
                }
            }
            else {
                yield AttendeceSchema_1.default.insertMany([{ date: currentDate, attendences: [{ _id, name }] }]);
                res.json({ status: true, message: 'Attendece Marked' });
            }
        }
        catch (err) {
            console.log(err);
            res.json({ status: false, message: 'Attendence cannot be marked now' });
        }
    }),
    updateProfile: (req, res) => {
        const { name, email, companyName, password } = req.body;
        if (req.session.projectManager.password === password) {
            projectManagerSchema_1.default.findOneAndUpdate({ _id: req.session.projectManager._id }, { $set: { name, email, companyName } }, { returnOriginal: false }).then((projectManager) => {
                res.json({ status: true, message: 'Succesfully updated', data: projectManager });
            }).catch(() => {
                res.json({ status: false, message: 'Cannot update database facing issues' });
            });
        }
        else {
            res.json({ status: false, message: 'Password doesnot matches' });
        }
    }
};
exports.default = projectManagerController;
