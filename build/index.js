"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const mongoos_1 = __importDefault(require("./config/mongoos"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const ErrorResponse_1 = __importDefault(require("./error/ErrorResponse"));
const errorHandler_1 = __importDefault(require("./error/errorHandler"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
dotenv_1.default.config(); //will convert the .env file into an object
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
(0, mongoos_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use((0, express_session_1.default)({
    // setup session
    resave: true,
    saveUninitialized: true,
    secret: 'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', // random hash key string to genarate session id
}));
app.use((req, res, next) => {
    // setup cache
    res.set('Cache-Control', 'no-store');
    next();
});
app.use(express_1.default.urlencoded({ extended: true })); // to get data from post method
app.use(express_1.default.json()); // to recieve the data in json format from the axios call
app.use((0, cookie_parser_1.default)());
const superUserRoutes_1 = __importDefault(require("./routes/superUserRoutes"));
const projectManagerRoutes_1 = __importDefault(require("./routes/projectManagerRoutes"));
const siteEngineerRoutes_1 = __importDefault(require("./routes/siteEngineerRoutes"));
app.use('/', superUserRoutes_1.default);
app.use('/projectmanager', projectManagerRoutes_1.default);
app.use('/siteEngineer', siteEngineerRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/project', projectRoutes_1.default);
app.use('/chat', chatRoutes_1.default);
app.use('/notification', notificationRoutes_1.default);
app.use('/task', taskRoutes_1.default);
app.use('*', (req, res, next) => {
    next(ErrorResponse_1.default.notFound());
});
app.use(errorHandler_1.default);
app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});
/*----------socket io start here-----------*/
const io = new socket_io_1.Server(8001, {
    cors: {
        origin: [
            'http:localhost:3000',
            'http:localhost:3001',
            process.env.CORS_LINK,
        ],
    },
});
let users = [];
io.on('connection', (socket) => {
    console.log('newConnection established');
    socket.on('disconnect', () => {
        console.log('socket disconnected');
        users = users.filter((user) => user.socketId !== socket.id);
    });
    socket.on('message', ({ senderId, recieverId, message, conversationId, }) => {
        const user = users.filter((user) => user.userId === recieverId);
        if (user.length !== 0) {
            io.to(user[0].socketId).emit('message', {
                senderId,
                recieverId,
                message,
                conversationId,
            });
        }
        else {
            console.log('reciever is not online');
        }
    });
    socket.on('userId', (userId) => {
        const user = users.filter((user) => user.userId === userId);
        if (user.length == 0) {
            users.push({ userId, socketId: socket.id });
        }
    });
});
