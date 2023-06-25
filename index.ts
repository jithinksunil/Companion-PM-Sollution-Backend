import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import mongodb from './config/mongoos'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import superUserRoutes from './routes/superUserRoutes'
import adminRoutes from './routes/adminRoutes'
import projectManagerRoutes from './routes/projectManagerRoutes'
import siteEngineerRoutes from './routes/siteEngineerRoutes'
import projectRoutes from './routes/projectRoutes'
import chatRoutes from './routes/chatRoutes'
import notificationRoutes from './routes/notificationRoutes'
import taskRoutes from './routes/taskRoutes'
import guestRoutes from './routes/guestRoutes';

import ErrorResponse from './error/ErrorResponse'
import errorHandler from './error/errorHandler';
import { reqType, resType } from './types/expressTypes'

import { Server, Socket } from 'socket.io';

const app = express()
mongodb()

dotenv.config()//will convert the .env file into an object

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.use(cors({
    origin: process.env.CORS_LINK_ARRAY?.split(','),
    methods: [
        "GET",
        "POST",
        "DELETE",
        "PUT",
        "PATCH"
    ],
    credentials: true,//cors allow cookies and headers with the request
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

app.use(session({ // setup session
    resave: true, // to resave the session
    saveUninitialized: true,
    secret: 'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', // random hash key string to genarate session id
}))

app.use((req: reqType, res: resType, next) => { // setup cache
    res.set("Cache-Control", "no-store");
    next();
});

app.use(express.urlencoded({ extended: true })) // to get data from post method
app.use(express.json()) // to recieve the data in json format from the axios call
app.use(cookieParser());

app.use('/', superUserRoutes)
app.use('/guest', guestRoutes)
app.use('/projectmanager', projectManagerRoutes)
app.use('/siteEngineer', siteEngineerRoutes)
app.use('/admin', adminRoutes)
app.use('/project', projectRoutes)
app.use('/chat', chatRoutes)
app.use('/notification', notificationRoutes)
app.use('/task', taskRoutes)
app.use('*', (req: reqType, res: resType, next: (err: ErrorResponse) => void) => {
    next(ErrorResponse.notFound())
})

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
})

const io = new Server(8001, {
    cors: {
        origin: ["http:localhost:3000", "http:localhost:3001", process.env.CORS_LINK as string]
    }
})

let users: Array<user> = []
interface user {
    socketId: string,
    userId: string
}

io.on('connection', (socket: Socket) => {
    console.log("newConnection established");
    socket.on('disconnect', () => {
        console.log('socket disconnected')
        users = users.filter((user: user) => user.socketId !== socket.id)
    })

    socket.on("message", ({ senderId, recieverId, message, conversationId }: { senderId: string, recieverId: string, message: string, conversationId: string }) => {
        const user = users.filter((user: user) => user.userId === recieverId)
        if (user.length !== 0) {
            io.to(user[0].socketId).emit("message", { senderId, recieverId, message, conversationId })
        } else {
            console.log('reciever is not online');
        }
    })

    socket.on("userId", (userId: string) => {
        const user = users.filter((user: user) => user.userId === userId)
        if (user.length == 0) {
            users.push({ userId, socketId: socket.id })
        }
    })
})


