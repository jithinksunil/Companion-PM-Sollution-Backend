import projectCollection from "../../models/projectSchema"
import taskCollection from "../../models/taskShema"
import {reqType, resType} from "../../types/expressTypes"
import { Types } from "mongoose"

const taskController =  {

    tasks: async(req : reqType, res : resType) => {

        projectCollection.aggregate([{$match:{"projectManagers.projectManagerId":new Types.ObjectId(req.session.projectManager._id),"projectManagers.status":true}},{$lookup:
            {
                from:"site_engineer_collections",
                let:{siteEngineer:"$siteEngineers.siteEngineerId"},
                pipeline:[
                    {$match:{$expr:{$in:["$_id","$$siteEngineer"]}}},
                    {$unwind:"$projects"},
                    {$lookup:{

                        from:"task_collections",
                        let:{task:"$projects.tasks"},
                        pipeline:[

                            {$match:{
                                $expr:{
                                    $and:[

                                        { $in: ["$_id", "$$task"] },
                                        { $eq: ["$status", true] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as:"taskDetails"
                        }
                    },
                    {$match:{"projects.projectId":new Types.ObjectId(req.session.projectManager._id)}},
                    {$group:{
                        _id:{
                            siteEngineerId:"$_id",
                            name:"$name"
                        },
                        tasks:{
                            $push:{
                                projectId:"$projects.projectId",
                                tasks:"$taskDetails"
                            }
                        }
                    }},
                    {$project:{siteEngineerId:"$_id.siteEngineerId",name:"$_id.name",_id:0,tasks:{$arrayElemAt: ["$tasks.tasks", 0]}}}
                ],
                as:"onDutySiteEngineers"
            
            }},{$project:{projectId:"$_id",_id:0, name:1,onDutySiteEngineers:1}}]).then((tasks:any)=>{
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


