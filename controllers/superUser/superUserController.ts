import {reqType, resType} from "../../types/expressTypes"
import superUserCollection from "../../models/superUserSchema"
import jwt from 'jsonwebtoken'
import cloudinary from '../../config/cloudinaryConfig'
import {newConnectionObject, newConnectionMailObject, mailService} from "../../config/nodeMailer"
import projectManagerCollection from "../../models/projectManagerSchema"
import projectCollection from "../../models/projectSchema"
import mongoose from "mongoose"

const superUseController = {
    verifyToken: (req : reqType, res : resType) => {
        const superUserData = req.session.superUser
        res.json({superUserTokenVerified: true,superUserData})
    },
    logout: (req : reqType, res : resType) => {
        req.session.destroy()
        res.json({status:true,message:'Succesfully Logged Out'})
    },
    signUp: (req : reqType, res : resType) => { // any data can be recieved now so must be validated befor saving to database
        superUserCollection.insertMany([req.body]).then(() => {
            res.json({status: true})
        }).catch(() => {
            res.json({status: false})
        })
    },
    logIn: (req : reqType, res : resType) => {
        const password = req.body.password
        const email = req.body.firstField

        superUserCollection.findOne({email}).then((superUserData) => {
            if (superUserData) {
                if (password === superUserData.password) {
                    req.session.superUser = superUserData.toObject() // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const superUser = superUserData.toObject()
                    const token = jwt.sign(superUser, 'mySecretKeyForSuperUser', {expiresIn: '1h'})
                    res.json({verified: true, superUser, message: 'Succesfully logged in', token})
                } else {
                    res.json({verified: false, message: 'Wrong email or password'})
                }
            } else {
                res.json({verified: false, message: 'User does not exist'})
            }
        }).catch((reject : Error) => {
            console.log(reject)
            res.json({verified: false, message: 'Sorry for Interuption ,Database facing issues'})
        })

    },
    superUserDashBoard: (req : reqType, res : resType) => {
        res.json({superUserTokenVerified: true})
    },
    superUserProfile: (req : reqType, res : resType) => {
        console.log('reached the pofile section');
        
        superUserCollection.findOne({_id: req.session.superUser._id}).then((superUserData) => {
            res.json({superUserTokenVerified: true, superUserData})
        }).catch(() => {
            res.json({superUserTokenVerified: true, message: 'Cannot fetch data now data base issue'})
        })
    },
    updateImage: (req : reqType, res : resType) => {
        
        const userId = req.session.superUser._id
        if (req.file) {
            cloudinary.uploader.upload(req.file.path, {
                transformation: [
                    {
                        width: 485,
                        height: 485,
                        gravity: "face",
                        crop: "fill"
                    }
                ]
            }).then((result) => {
                superUserCollection.updateOne({
                    _id: userId
                }, {image: result.secure_url}).then(() => {
                    res.json({staus: true, message: 'successfully updated'})
                }).catch(() => {
                    res.json({staus: false, message: 'data base facing issue try later'})
                })
            }).catch((err) => {

                res.json({status: false, message: 'cannot upload now to cloudinary'})
            })

        } else {
            res.json({status: false, message: 'Select a jpeg format'})
        }

    },
    updateProfile:(req : reqType, res : resType) => {
        const  {name,email,companyName,password}=req.body
        if(req.session.superUser.password===password){
            superUserCollection.updateOne({_id:req.session.superUser._id},{$set:{name,email,companyName}}).then(()=>{
                res.json({status:true,message:'Succesfully updated'})
            }).catch(()=>{
                res.json({status:false,message:'Cannot update database facing issues'})
            })
        }
        else{
            res.json({status:false,message:'Password doesnot matches'})
        }
    },
    connections: async(req : reqType, res : resType) => {
        const projectManagers=await projectManagerCollection.aggregate([{$match:{}},{$project:{name:1, projects:1}}])
        const data:any={}
        projectManagers.forEach((item)=>{
            data[item.name]=item.projects
        })
        res.json({superUserTokenVerified:true,data})
        
    },
    updateProjectAssingment: async (req : reqType, res : resType) => {
        try{
            const {startColumn,dragStartIndex,movingItem,endColumn,dragEnterIndex}=req.body
        const item={_id:new mongoose.Types.ObjectId(movingItem)}
        
        await projectManagerCollection.updateOne({name:startColumn},{$pull:{projects:item}})
        const projectManager=await projectManagerCollection.findOneAndUpdate({name:endColumn},{$push:{projects:item}})
        if(projectManager){
            if(projectManager.name==='unAssingned'){
                await projectCollection.updateOne({_id:new mongoose.Types.ObjectId(movingItem)},{projectManager:projectManager.name})
            }
            else{
                await projectCollection.updateOne({_id:new mongoose.Types.ObjectId(movingItem)},{projectManager:projectManager._id})
            }
        }
        res.json({status:true,message:'successfully updated'})
        }
        catch(err){
            res.json({status:false,message:'updation failed'})
        }
        
    },

    addConnection: (req : reqType, res : resType) => {
        const email = req.body.connection
        if (email) {
            const {_id, companyName} = req.session.superUser
            const connectionObject: connectionType = newConnectionObject(companyName)
            const {logginUserName, password} = connectionObject
            const mailOptions = newConnectionMailObject(email, connectionObject)
            const name=email.split('@')
            const newConnectionData = {
                email,
                name:name[0],
                companyName,
                superUserId: _id,
                logginUserName,
                password
            }
            mailService(mailOptions).then(() => {
                projectManagerCollection.insertMany([newConnectionData]).then(() => {
                    res.json({status: true, message: 'Connection added successfully'})
                }).catch(() => {
                    res.json({status: false, message: 'Connection cannot be added right now-database issue'})
                })
            }).catch(() => {
                res.json({status: false, message: 'Connection cannot be added right, nodemailer issue'})
            })


        } else {
            res.json({status: false, message: 'Invalid email'})
        }
    },
    paymentComplete: (req : reqType, res : resType) => {
        superUserCollection.updateOne({_id:req.session.superUser._id},{$set:{membership:req.body.plan}}).then(()=>{
            res.json({superUserToken:true,status:true,message:'Your membership is updated'})
        }).catch(()=>{
            res.json({superUserToken:true,status :false,message:'Cannot update the membership'})
        })
    }
}

type connectionType = {
    logginUserName: string,
    password: string
}

export default superUseController
