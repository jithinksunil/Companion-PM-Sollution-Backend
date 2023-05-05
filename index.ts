import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()//will convert the .env file into an object

import mongodb from './config/mongoos'
mongodb()

import cors from 'cors'
app.use(cors({
    origin: ["http://localhost:3001",process.env.CORS_LINK as string],
    methods: [
        "GET",
        "POST",
        "DELETE",
        "PUT",
        "PATCH"
    ],
    credentials: true
}))

import session from 'express-session'
app.use(session({ // setup session
    resave: true, // to resave the session
    saveUninitialized: true,
    secret: 'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', // random hash key string to genarate session id
}))

app.use((req, res, next) => { // setup cache
    res.set("Cache-Control", "no-store");
    next();
});

app.use(express.urlencoded({extended: true})) // to get data from post method
app.use(express.json()) // to recieve the data in json format from the axios call

import cookieParser from 'cookie-parser'
app.use(cookieParser());


import superUserRoutes from './routes/superUserRoutes'
import adminRoutes from './routes/adminRoutes'
import projectManagerRoutes from './routes/projectManagerRoutes'
import siteEngineerRoutes from './routes/siteEngineerRoutes'
import projectRoutes from './routes/projectRoutes'
import chatRoutes from './routes/chatRoutes'
import notificationRoutes from './routes/notificationRoutes'
import taskRoutes from './routes/taskRoutes'


app.use('/api/', superUserRoutes)
app.use('/api/projectmanager', projectManagerRoutes)
app.use('/api/siteengineer', siteEngineerRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/task', taskRoutes)
app.listen(process.env.PORT , () => {
    console.log('server started');
})

import { Server } from 'socket.io';
const io=new Server( 8001 ,{
    cors:{
        origin:["http:localhost:3000","http:localhost:3001",process.env.CORS_LINK as string]
    }
})

let users:any=[]

io.on('connection',(socket:any)=>{
    console.log("newConnection established");
    
    socket.on('disconnect',()=>{
        console.log('socket disconnected')
        users=users.filter((user:any)=>user.socketId !== socket.id)
    })

    socket.on("message",({senderId,recieverId,message,conversationId}:{senderId:string,recieverId:string,message:string,conversationId:string})=>{
        console.log("message from ",senderId,' to ', recieverId);
        const user=users.filter((user:any)=>user.userId===recieverId)
        if(user.length!==0){
            io.to(user[0].socketId).emit("message",{senderId,recieverId,message,conversationId})
        }else{
            console.log('reciever is not online');
        }
    })

    socket.on("userId",(userId:any)=>{
        const user=users.filter((user:any)=>user.userId===userId)
        if(user.length==0){
            console.log(userId+" added to array");
            users.push({userId,socketId:socket.id})
        }
        console.log('current array of users ',users)
    })
})

