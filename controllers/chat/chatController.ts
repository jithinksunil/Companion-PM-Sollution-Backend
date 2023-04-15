import {reqType, resType} from "../../types/expressTypes"
import projectManagerCollection from "../../models/projectManagerSchema"
import mongoose from "mongoose"
import superUserCollection from "../../models/superUserSchema"

const chatController = {
    connnectionList: (req : reqType, res : resType) => {
        const superUserId=req.body.superUserId
        let connections=[]
        projectManagerCollection.find({superUserId:new mongoose.Types.ObjectId(superUserId)}).then((projectManagers)=>{
            connections=projectManagers
            superUserCollection.find({_id:new mongoose.Types.ObjectId(superUserId)}).then((superUsers)=>{
                connections=[...projectManagers,...superUsers]
                res.json({connections})
            }).catch(()=>{
                res.json({message:'issues faced in data base while fetching connections'})
            })
        }).catch(()=>{
            res.json({message:'issues faced in data base while fetching connections'})
        })
    },

}

export default chatController
