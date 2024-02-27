"use strict";
exports.__esModule = true;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var morgan_1 = require("morgan");
var mongoos_1 = require("./config/mongoos");
var cors_1 = require("cors");
var express_session_1 = require("express-session");
var cookie_parser_1 = require("cookie-parser");
var adminRoutes_1 = require("./routes/adminRoutes");
var projectRoutes_1 = require("./routes/projectRoutes");
var chatRoutes_1 = require("./routes/chatRoutes");
var notificationRoutes_1 = require("./routes/notificationRoutes");
var taskRoutes_1 = require("./routes/taskRoutes");
var ErrorResponse_1 = require("./error/ErrorResponse");
var errorHandler_1 = require("./error/errorHandler");
var socket_io_1 = require("socket.io");
var app = (0, express_1["default"])();
dotenv_1["default"].config(); //will convert the .env file into an object
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1["default"])('dev'));
}
(0, mongoos_1["default"])();
app.use((0, cors_1["default"])({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));
app.use((0, express_session_1["default"])({
    // setup session
    resave: true,
    saveUninitialized: true,
    secret: 'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878'
}));
app.use(function (req, res, next) {
    // setup cache
    res.set('Cache-Control', 'no-store');
    next();
});
app.use(express_1["default"].urlencoded({ extended: true })); // to get data from post method
app.use(express_1["default"].json()); // to recieve the data in json format from the axios call
app.use((0, cookie_parser_1["default"])());
var superUserRoutes_1 = require("./routes/superUserRoutes");
var projectManagerRoutes_1 = require("./routes/projectManagerRoutes");
var siteEngineerRoutes_1 = require("./routes/siteEngineerRoutes");
app.use('/', superUserRoutes_1["default"]);
app.use('/projectmanager', projectManagerRoutes_1["default"]);
app.use('/siteEngineer', siteEngineerRoutes_1["default"]);
app.use('/admin', adminRoutes_1["default"]);
app.use('/project', projectRoutes_1["default"]);
app.use('/chat', chatRoutes_1["default"]);
app.use('/notification', notificationRoutes_1["default"]);
app.use('/task', taskRoutes_1["default"]);
app.use('*', function (req, res, next) {
    next(ErrorResponse_1["default"].notFound());
});
app.use(errorHandler_1["default"]);
app.listen(process.env.PORT, function () {
    console.log("server started on port ".concat(process.env.PORT));
});
/*----------socket io start here-----------*/
var io = new socket_io_1.Server(8001, {
    cors: {
        origin: [
            'http:localhost:3000',
            'http:localhost:3001',
            process.env.CORS_LINK,
        ]
    }
});
var users = [];
io.on('connection', function (socket) {
    console.log('newConnection established');
    socket.on('disconnect', function () {
        console.log('socket disconnected');
        users = users.filter(function (user) { return user.socketId !== socket.id; });
    });
    socket.on('message', function (_a) {
        var senderId = _a.senderId, recieverId = _a.recieverId, message = _a.message, conversationId = _a.conversationId;
        var user = users.filter(function (user) { return user.userId === recieverId; });
        if (user.length !== 0) {
            io.to(user[0].socketId).emit('message', {
                senderId: senderId,
                recieverId: recieverId,
                message: message,
                conversationId: conversationId
            });
        }
        else {
            console.log('reciever is not online');
        }
    });
    socket.on('userId', function (userId) {
        var user = users.filter(function (user) { return user.userId === userId; });
        if (user.length == 0) {
            users.push({ userId: userId, socketId: socket.id });
        }
    });
});
