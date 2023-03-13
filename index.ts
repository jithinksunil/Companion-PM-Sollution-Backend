import express from 'express'
const app=express()

import mongodb from './config/mongooe'
mongodb()

import cors from 'cors'
app.use(
    cors({
        origin:["http://localhost:3000","http://localhost:3001"],
        methods:["GET","POST","DELETE","PUT","PATCH"],
        credentials:true,
    })
)

const session=require('express-session')
app.use(session({//setup session
    resave:true,//to resave the session
    saveUninitialized:true,
    secret:'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', //random hash key string to genarate session id  
}))


app.use((req, res, next) => {//setup cache
    res.set("Cache-Control", "no-store");
    next();
});

import path from 'path'
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))//to download image from the static folder

app.use(express.urlencoded({extended:true}))//to get data from post method
app.use(express.json())//to recieve the data in json format from the axios call

import cookieParser from 'cookie-parser'
app.use(cookieParser());


import superUserRouter from './routes/superUserRoutes'
app.use('/',superUserRouter)
app.listen(8000,()=>{console.log('server started');
})