import projectCollection from "../../models/projectSchema"
import taskCollection from "../../models/taskShema"
import {reqType, resType} from "../../types/expressTypes"
import { Types } from "mongoose"

const taskController =  {

    tasks: async(req : reqType, res : resType) => {

        projectCollection.aggregate([{$match:{"projectManagers.projectManagerId":new Types.ObjectId("6432c532dbb5f581e099ea37"),"projectManagers.status":true}},{$lookup:
            {
                from:"site_engineer_collections",
                localField:"_id",
                foreignField:"projects.projectId",
                as:"onDutySiteEngineers"
            
            }},{
                $addFields: {
                  siteEngineers: {
                    $filter: {
                      input: "$onDutySiteEngineers",
                      cond: {
                        $eq: ["$$this.projects.projectId", "$_id"],
                        $eq: ["$$this.projects.status", true]
                      }
                    }
                  }
                }
              }]).then((tasks:any)=>{
                console.log(tasks);
                console.log(tasks[0].onDutySiteEngineers);
                
                const data=[...tasks]
                data.forEach((item:any)=>{
                    const onDutySiteEngineers:any={}
                    item.onDutySiteEngineers.forEach((eng:any)=>{
                        onDutySiteEngineers[eng.name]=eng.tasks
                    })
                    item.onDutySiteEngineers=onDutySiteEngineers
                })
              
            res.json({projectManagerTokenVerified:true,data})
        }).catch(()=>{
            res.json({message:"data base facing issues to fetch the tasks now"})
        })
    },
    taskAssignment: async(req : reqType, res : resType) => {
        const {startColumn,dragStartIndex,movingItem,endColumn,dragEnterIndex}=req.body
        console.log(req.body);
        
    },
    create: async(req : reqType, res : resType) => {
        req.body.notifiedIndividualId=new Types.ObjectId(req.body.notifiedIndividualId)
        taskCollection.insertMany([req.body]).then(()=>{
            res.json({status:true,message:"notificaion send"})
        }).catch(()=>{
            res.json({message:"cannot save the task right now"})
        })
    }
} 

export default taskController


