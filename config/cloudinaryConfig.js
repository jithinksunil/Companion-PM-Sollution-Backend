"use strict";
var cloudinary_1 = require("cloudinary");
cloudinary_1["default"].v2.config({ cloud_name: process.env.CLOUDINARY_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
module.exports = cloudinary_1["default"].v2;
