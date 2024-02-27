"use strict";
exports.__esModule = true;
var cloudinary_1 = require("cloudinary");
var multer_1 = require("multer");
var multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
var superUserCloudstorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "categories"
    }
});
var uploadSuperUser = (0, multer_1["default"])({
    storage: superUserCloudstorage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/avif') {
            callback(null, true);
        }
        else {
            callback(null, false);
            // return callback(new Error('only jpg jpeg png and gif file are allowed'))
        }
    }
});
exports["default"] = uploadSuperUser;
