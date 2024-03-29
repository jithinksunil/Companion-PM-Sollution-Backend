"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({ cloud_name: process.env.CLOUDINARY_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
module.exports = cloudinary_1.default.v2;
