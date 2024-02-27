"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminSchema_1 = __importDefault(require("../../models/adminSchema"));
const superUserSchema_1 = __importDefault(require("../../models/superUserSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminController = {
    verifyToken: (req, res) => {
        res.json({ tokenVerified: true });
    },
    logIn: (req, res) => {
        const password = req.body.password;
        const email = req.body.email;
        adminSchema_1.default.findOne({ email }).then((admin) => {
            if (admin) {
                if (password === admin.password) {
                    req.session.admin = admin.toObject(); // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const adminData = admin.toObject();
                    const token = jsonwebtoken_1.default.sign(adminData, 'mySecretKeyForAdmin', { expiresIn: '1h' });
                    res.json({ verified: true, admin, message: 'Succesfully logged in', token });
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
    adminDashBoard: (req, res) => {
        const adminData = req.session.admin;
        res.json({ tokenVerified: true, adminData });
    },
    adminProfile: (req, res) => {
        const adminData = req.session.admin;
        res.json({ tokenVerified: true, adminData });
    },
    superUserManagement: (req, res) => {
        let { search } = req.query;
        if (!search)
            search = '';
        superUserSchema_1.default.find({
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
        }).then((superUsersData) => {
            res.json({ tokenVerified: true, superUsersData });
        }).catch(err => {
            console.log(err);
            res.json({ tokenVerified: true, message: 'Sorry, connot retrieve datas now, Database facing issues' });
        });
    },
    blockOrUnblock: (req, res) => {
        superUserSchema_1.default.updateOne({
            _id: req.query.id
        }, { status: req.query.status }).then(() => {
            res.json({ action: true, message: 'updated' });
        }).catch((err) => {
            console.log(err);
            res.json({ action: false, message: 'Sorry for connot retrieve datas now, Database facing issues' });
        });
    }
};
exports.default = adminController;
