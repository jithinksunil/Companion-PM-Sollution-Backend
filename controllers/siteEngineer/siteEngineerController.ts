import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'
import cloudinary from '../../config/cloudinaryConfig'
import siteEngineerCollection from "../../models/siteEngineerSchema"
import attendenceCollection from "../../models/AttendeceSchema"
import projectCollection from "../../models/projectSchema"

const siteEngineerController = {
    verifyToken: (req : reqType, res : resType) => {
        res.json({siteEngineerTokenVerified: true})
    },
     logIn: (req : reqType, res : resType) => {

        const password = req.body.password
        const logginUserName = req.body.firstField

        siteEngineerCollection.findOne({logginUserName}).then((siteEngineer) => {

            if (siteEngineer) {
                if (password === siteEngineer.password) {
                    req.session.siteEngineer = siteEngineer.toObject() // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const siteEngineerData = siteEngineer.toObject()
                    const token = jwt.sign(siteEngineerData, 'mySecretKeyForSiteEngineer', {expiresIn: '1h'})
                    res.json({verified: true, data:siteEngineer, message: 'Succesfully logged in', token})
                } else {
                    res.json({verified: false, message: 'Wrong email or password'})
                }
            } else {
                res.json({verified: false, message: 'User does not exist'})
            }
        }).catch(() => {
            res.json({verified: false, message: 'Sorry for Interuption ,Database facing issues'})
        })

    },
    siteEngineerDashBoard: (req : reqType, res : resType) => {
        const siteEngineerData = req.session.siteEngineer
        res.json({siteEngineerTokenVerified: true, data:siteEngineerData})
    },
    project: (req : reqType, res : resType) => {
        projectCollection.findOne({_id:req.session.siteEngineer.projectId}).then((project)=>{
            res.json({siteEngineerTokenVerified:true,data:project})
        }).catch(()=>{
            res.json({siteEngineerTokenVerified:true,message:'cannot fetch project details from the database now'})
        })
    },
    siteEngineerProfile: (req : reqType, res : resType) => {

        siteEngineerCollection.findOne({_id: req.session.siteEngineer._id}).then((siteEngineerData) => {
            res.json({siteEngineerTokenVerified: true, data: siteEngineerData})
        }).catch(() => {
            res.json({siteEngineerTokenVerified: true, message: 'Cannot fetch data now data base issue'})
        })
    },
    updateImage: (req : reqType, res : resType) => {
        const userId = req.session.siteEngineer._id
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
                siteEngineerCollection.updateOne({
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
    markAttendence:async (req : reqType, res : resType) => {
        try{
            const currentDate = new Date().toJSON().slice(0, 10)
        const {_id,name}=req.session.siteEngineer

        const attendeceSheet = await attendenceCollection.findOne({date:currentDate})
        if(attendeceSheet){
            const result =await attendenceCollection.findOne({date:currentDate,"attendences._id":_id})
            if(result){
                res.json({status: true, message: 'Attendece already marked'})
            }
            else{
                await attendenceCollection.updateOne({date:currentDate},{$push:{attendences:{_id,name}}})
                res.json({status: true, message: 'Attendece Marked'})
            }
            
        }else{
            await attendenceCollection.insertMany([{date:currentDate,attendences:[{_id,name}]}])
            res.json({status: true, message: 'Attendece Marked'})
        }
        }
        catch(err){
            console.log(err);
            res.json({status: false, message: 'Attendence cannot be marked now'})
        }
    },
    updateProfile: (req : reqType, res : resType) => {
        const  {name,email,companyName,password}=req.body
        if(req.session.siteEngineer.password===password){
            siteEngineerCollection.findOneAndUpdate({_id:req.session.siteEngineer._id},{$set:{name,email,companyName}},{ returnOriginal: false }).then((siteEngineer)=>{
                console.log(siteEngineer);
                
                res.json({status:true,message:'Succesfully updated',data:siteEngineer})
            }).catch(()=>{
                res.json({status:false,message:'Cannot update database facing issues'})
            })
        }
        else{
            res.json({status:false,message:'Password doesnot matches'})
        }
    }

}


export default siteEngineerController
