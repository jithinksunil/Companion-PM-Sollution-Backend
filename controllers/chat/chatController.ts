import {reqType, resType} from "../../types/expressTypes"
import projectManagerCollection from "../../models/projectManagerSchema"
import mongoose from "mongoose"
import superUserCollection from "../../models/superUserSchema"
import conversationCollection from "../../models/conversationShema"
import messageCollection from "../../models/messageShema"
import siteEngineerCollection from "../../models/siteEngineerSchema"

const chatController = {
    connnectionList: (req : reqType, res : resType) => {
        const superUserId=req.body.superUserId
        let connections:any[]=[]
        projectManagerCollection.find({superUserId:new mongoose.Types.ObjectId(superUserId)}).then((projectManagers)=>{
            connections=projectManagers
            
            siteEngineerCollection.find({superUserId:new mongoose.Types.ObjectId(superUserId)}).then((siteEngineers)=>{
                connections=[...connections,...siteEngineers]
                
                superUserCollection.findOne({_id:new mongoose.Types.ObjectId(superUserId)}).then((superUser)=>{
                    connections=[...connections,superUser]
                    res.json({connections})
                    
                }).catch(()=>{
                    res.json({message:'issues faced in data base while fetching connections'})
                })
            }).catch(()=>{
                res.json({message:'issues faced in data base while fetching connections'})
            })
            
        }).catch(()=>{
            res.json({message:'issues faced in data base while fetching connections'})
        })
    },
    startChat: async (req : reqType, res : resType) => {
        
        try{

            let {senderId,recieverId}=req.body
            console.log(senderId,recieverId);
            
            if(senderId!==recieverId){

                senderId=new mongoose.Types.ObjectId(senderId)
                recieverId=new mongoose.Types.ObjectId(recieverId)
                let conversation=await conversationCollection.findOne({members:{ $all: [senderId,recieverId] }})
                
                if(!conversation){
                    await conversationCollection.insertMany([{members:[senderId,recieverId]}])
                    conversation=await conversationCollection.findOne({members:[senderId,recieverId]})
                }
                console.log(conversation);
                
                if(conversation){//conversation can possibly null
                    const messages=await messageCollection.find({conversationId:conversation._id})
                    res.json({messages,recieverId,conversationId:conversation._id})
                }else{
                    res.json({messages:[]})
                }
            }
            else{
                res.json({messages:[]})
                
            }
        }
        catch(err){
            res.json({errorMessage:'messages cannot be fetchnow due to database issues'})
        }
    },
    sendMessage: async (req : reqType, res : resType) => {
        req.body.conversationId=new mongoose.Types.ObjectId(req.body.conversationId)
        await messageCollection.insertMany([req.body])
        const messages=await messageCollection.find({conversationId:req.body.conversationId})
        res.json({messages})
    }
}

export default chatController
