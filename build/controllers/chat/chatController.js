"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatRepository_1 = require("../../dataBaserepository/chatRepository");
const chatController = {
    connnectionList: (req, res) => {
        const superUserId = req.body.superUserId;
        (0, chatRepository_1.findAllConnections)(superUserId).then((connections) => {
            res.json({ connections });
        }).catch(() => {
            res.json({ message: 'issues faced in data base while fetching connections' });
        });
    },
    startChat: (req, res) => {
        const { senderId, recieverId } = req.body;
        if (senderId !== recieverId) {
            (0, chatRepository_1.messagesAndChatDetails)(senderId, recieverId).then((result) => {
                res.json(result);
            }).catch(() => {
                res.json({ errorMessage: 'messages cannot be fetchnow due to database issues' });
            });
        }
        else {
            res.json({ messages: [] });
        }
    },
    sendMessage: (req, res) => {
        (0, chatRepository_1.messageSend)(req.body).then((messages) => res.json({ messages })).catch(() => {
            res.json({ message: 'issues faced in data base while sending messages' });
        });
    }
};
exports.default = chatController;
