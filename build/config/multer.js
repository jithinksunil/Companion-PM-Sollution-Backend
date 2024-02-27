"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const superUserCloudstorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "categories"
    }
});
const uploadSuperUser = (0, multer_1.default)({
    storage: superUserCloudstorage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/avif') {
            callback(null, true);
        }
        else {
            callback(null, false);
            // return callback(new Error('only jpg jpeg png and gif file are allowed'))
        }
    }
});
exports.default = uploadSuperUser;
