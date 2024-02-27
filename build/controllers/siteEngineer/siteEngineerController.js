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
const siteEngineerSchema_1 = __importDefault(require("../../models/siteEngineerSchema"));
const AttendeceSchema_1 = __importDefault(require("../../models/AttendeceSchema"));
const projectSchema_1 = __importDefault(require("../../models/projectSchema"));
const siteEngineerController = {
    verifyToken: (req, res) => {
        res.json({ tokenVerified: true });
    },
    logIn: (req, res) => {
        const password = req.body.password;
        const logginUserName = req.body.userName;
        siteEngineerSchema_1.default.findOne({ logginUserName }).then((siteEngineer) => {
            if (siteEngineer) {
                if (password === siteEngineer.password) {
                    req.session.siteEngineer = siteEngineer.toObject(); // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const siteEngineerData = siteEngineer.toObject();
                    const token = jsonwebtoken_1.default.sign(siteEngineerData, 'mySecretKeyForSiteEngineer', { expiresIn: '1h' });
                    res.json({ verified: true, data: siteEngineer, message: 'Succesfully logged in', token });
                }
                else {
                    res.json({ verified: false, message: 'Wrong email or password' });
                }
            }
            else {
                res.json({ verified: false, message: 'User does not exist' });
            }
        }).catch(() => {
            res.json({ verified: false, message: 'Sorry for Interuption ,Database facing issues' });
        });
    },
    siteEngineerDashBoard: (req, res) => {
        const siteEngineerData = req.session.siteEngineer;
        res.json({ tokenVerified: true, data: siteEngineerData });
    },
    project: (req, res) => {
        projectSchema_1.default.findOne({ _id: req.session.siteEngineer.projectId }).then((project) => {
            res.json({ tokenVerified: true, data: project });
        }).catch(() => {
            res.json({ tokenVerified: true, message: 'cannot fetch project details from the database now' });
        });
    },
    siteEngineerProfile: (req, res) => {
        siteEngineerSchema_1.default.findOne({ _id: req.session.siteEngineer._id }).then((siteEngineerData) => {
            const message = req.query.message;
            res.json({ tokenVerified: true, data: siteEngineerData, status: true, message });
        }).catch(() => {
            res.json({ tokenVerified: true, message: 'Cannot fetch data now data base issue' });
        });
    },
    updateImage: (req, res) => {
        const userId = req.session.siteEngineer._id;
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
                siteEngineerSchema_1.default.updateOne({
                    _id: userId
                }, { image: result.secure_url }).then(() => {
                    res.redirect("/siteEngineer/profile?message=successfully updated");
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
            const { _id, name } = req.session.siteEngineer;
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
        if (req.session.siteEngineer.password === password) {
            siteEngineerSchema_1.default.findOneAndUpdate({ _id: req.session.siteEngineer._id }, { $set: { name, email, companyName } }, { returnOriginal: false }).then((siteEngineer) => {
                console.log(siteEngineer);
                res.json({ status: true, message: 'Succesfully updated', data: siteEngineer });
            }).catch(() => {
                res.json({ status: false, message: 'Cannot update database facing issues' });
            });
        }
        else {
            res.json({ status: false, message: 'Password doesnot matches' });
        }
    }
};
exports.default = siteEngineerController;
