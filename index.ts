import express from 'express'
const app = express()

import mongodb from './config/mongoos'
mongodb()

import cors from 'cors'
app.use(cors({
    origin: [
        "http://localhost:3000", "http://localhost:3001"
    ],
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


app.use('/', superUserRoutes)
app.use('/projectmanager', projectManagerRoutes)
app.use('/siteengineer', siteEngineerRoutes)
app.use('/admin', adminRoutes)
app.use('/project', projectRoutes)
app.use('/chat', chatRoutes)
app.use('/notification', notificationRoutes)
app.listen(8000, () => {
    console.log('server started');
})
