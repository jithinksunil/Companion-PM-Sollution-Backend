"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notificationRepository_1 = require("../../dataBaserepository/notificationRepository");
const notificationController = {
    notifications: (req, res) => {
        const individual = req.body.individual;
        let notifiedIndividualId = req.session[individual]._id;
        (0, notificationRepository_1.getAllNotification)(notifiedIndividualId).then((notifications) => {
            res.json({ notifications });
        }).catch(() => {
            res.json({ message: "data base facing issues to fetch the notifications now" });
        });
    },
    create: (req, res) => {
        (0, notificationRepository_1.createNotification)(req.body).then((status) => {
            res.json({ status, message: "notificaion send" });
        }).catch(() => {
            res.json({ message: "cannot save the notification right now" });
        });
    }
};
exports.default = notificationController;
