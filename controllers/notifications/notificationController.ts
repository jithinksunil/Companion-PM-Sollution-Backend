import notificationCollection from "../../models/notificationCollection"
import {reqType, resType} from "../../types/expressTypes"
import { Types } from "mongoose"


const notificationController ={
    notifications: async(req : reqType, res : resType) => {
        const individual=req.body.individual
        notificationCollection.find({notifiedIndividualId:req.session[individual]._id}).sort({$natural:-1}).then((notifications:[{notifiedIndividualId:Types.ObjectId,
            senderId:Types.ObjectId,
            notification:string,
            url:string,}])=>{
            res.json({notifications})
        }).catch(()=>{
            res.json({message:"data base facing issues to fetch the notifications now"})
        })
    },
    create: async(req : reqType, res : resType) => {
        req.body.notifiedIndividualId=new Types.ObjectId(req.body.notifiedIndividualId)
        notificationCollection.insertMany([req.body]).then(()=>{
            res.json({status:true,message:"notificaion send"})
        }).catch(()=>{
            res.json({message:"cannot save the notification right now"})
        })
    }
} 

export default notificationController
