"use strict";
exports.__esModule = true;
var notificationRepository_1 = require("../../dataBaserepository/notificationRepository");
var notificationController = {
    notifications: function (req, res) {
        var individual = req.body.individual;
        var notifiedIndividualId = req.session[individual]._id;
        (0, notificationRepository_1.getAllNotification)(notifiedIndividualId).then(function (notifications) {
            res.json({ notifications: notifications });
        })["catch"](function () {
            res.json({ message: "data base facing issues to fetch the notifications now" });
        });
    },
    create: function (req, res) {
        (0, notificationRepository_1.createNotification)(req.body).then(function (status) {
            res.json({ status: status, message: "notificaion send" });
        })["catch"](function () {
            res.json({ message: "cannot save the notification right now" });
        });
    }
};
exports["default"] = notificationController;
