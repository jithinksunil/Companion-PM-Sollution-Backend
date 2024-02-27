"use strict";
exports.__esModule = true;
var chatRepository_1 = require("../../dataBaserepository/chatRepository");
var chatController = {
    connnectionList: function (req, res) {
        var superUserId = req.body.superUserId;
        (0, chatRepository_1.findAllConnections)(superUserId).then(function (connections) {
            res.json({ connections: connections });
        })["catch"](function () {
            res.json({ message: 'issues faced in data base while fetching connections' });
        });
    },
    startChat: function (req, res) {
        var _a = req.body, senderId = _a.senderId, recieverId = _a.recieverId;
        if (senderId !== recieverId) {
            (0, chatRepository_1.messagesAndChatDetails)(senderId, recieverId).then(function (result) {
                res.json(result);
            })["catch"](function () {
                res.json({ errorMessage: 'messages cannot be fetchnow due to database issues' });
            });
        }
        else {
            res.json({ messages: [] });
        }
    },
    sendMessage: function (req, res) {
        (0, chatRepository_1.messageSend)(req.body).then(function (messages) { return res.json({ messages: messages }); })["catch"](function () {
            res.json({ message: 'issues faced in data base while sending messages' });
        });
    }
};
exports["default"] = chatController;
