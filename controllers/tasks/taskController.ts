import projectCollection from "../../models/projectSchema"
import siteEngineerCollection from "../../models/siteEngineerSchema"
import taskCollection from "../../models/taskShema"
import {reqType, resType} from "../../types/expressTypes"
import { Types } from "mongoose"

const taskController =  {

    tasks: async(req : reqType, res : resType) => {
        const projectManagerId=new Types.ObjectId(req.session.projectManager._id)

        projectCollection.aggregate([
          {$match:{"projectManagers.projectManagerId":projectManagerId}},
          {$project:{name:1,
          projectManagers:{$filter:{
            input:"$projectManagers",
            as:'pm',
            cond:{
              $and:[
                {$eq:["$$pm.projectManagerId",projectManagerId]},
                {$eq:["$$pm.status",true]}
              ]
            }
          }}
          }},{$match:{"projectManagers.projectManagerId":projectManagerId}},
          {
            $lookup: {
              from: "site_engineer_collections",
              let: { projectId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: [ "$$projectId", "$projects.projectId" ] }
                  }
                },{$project:{name:1,
                  currentTaskOrder:1,
                  projects:{$filter:{
                    input:"$projects",
                    as:'project',
                    cond:{
                      $and:[
                        {$eq:["$$project.projectId","$$projectId"]},
                        {$eq:["$$project.status",true]}
                      ]
                    }
                  }}
                  }},{$match:{"projects.status":true}},{
                    $lookup:{
                        from:"task_collections",
                        let:{task:'$currentTaskOrder'},
                        pipeline:[{$match:{$expr:{$in:['$_id','$$task']}}},{$project:{name:1}}],
                        as:"taskDetails"
                    }
                },
                {$project:{name:1,taskDetails:1}}],
              as: "onDutySiteEngineers"
            }
          },
          {$project:{projectId:"$_id",_id:0,name:1,onDutySiteEngineers:1}}
        ]).then((tasks:any)=>{
          console.log(tasks)
          
                const data=[...tasks]
                data.forEach((item:any)=>{
                    const onDutySiteEngineers:any={}
                    item.onDutySiteEngineers.forEach((eng:any)=>{
                        onDutySiteEngineers[eng.name]=eng.taskDetails
                    })
                    item.onDutySiteEngineers=onDutySiteEngineers
                })
                const message=req.query.message
  
            res.json({projectManagerTokenVerified:true,data,message})
            console.log(data);
            
        }).catch((err)=>{
            console.log(err);
            
            res.json({message:"data base facing issues to fetch the tasks now"})
        })
    },
    taskAssignment: async(req : reqType, res : resType) => {
        const {startColumn,dragStartIndex,endColumn,dragEnterIndex}=req.body
        const movingItemId=new Types.ObjectId(req.body.movingItem._id)
        const startSiteEngineer=await siteEngineerCollection.findOneAndUpdate({name:startColumn},{$pull:{currentTaskOrder:movingItemId}},{returnOriginal:false})
        const endSiteEngineer=await siteEngineerCollection.findOne({name:endColumn})
        const currentTaskOrder=endSiteEngineer?.toObject().currentTaskOrder
        
        currentTaskOrder.splice(dragEnterIndex,0,movingItemId)

        await siteEngineerCollection.updateOne({name:endColumn},{currentTaskOrder})
        
        if(endSiteEngineer){
            const matched=await taskCollection.findOne({_id:movingItemId,"siteEngineers.siteEngineerId":endSiteEngineer._id})
            if(matched){
                await taskCollection.updateOne({_id:movingItemId,"siteEngineers.siteEngineerId":endSiteEngineer._id},{"siteEngineers.$.status":true})
                
            }else{
                await taskCollection.updateOne({_id:movingItemId},{$push:{siteEngineers:{"siteEngineerId":endSiteEngineer._id,"status":true}}})
            }
        }
        if(startSiteEngineer){
            await taskCollection.updateOne({_id:movingItemId,"siteEngineers.siteEngineerId":startSiteEngineer._id},{$set:{"siteEngineers.$.status":false}})
        }
        res.redirect('/task?message=Successfull updated')

    },
    add: async(req : reqType, res : resType) => {
        try{
            const projectManagerId=req.session.projectManager._id
            const {siteEngineerName}=req.query
            const {task}=req.body
            const siteEngineer=await siteEngineerCollection.findOne({name:siteEngineerName})
            let taskData
            let currentTaskOrder:any
            if(siteEngineer){
                await taskCollection.insertMany([{name:task,siteEngineers:[{siteEngineerId:siteEngineer._id,status:true}]}])
                taskData=await taskCollection.findOne({name:task,"siteEngineers.$.siteEngineerId":siteEngineer._id,"siteEngineers.$.status":true})
                currentTaskOrder=siteEngineer.currentTaskOrder
            }
            if(currentTaskOrder){
                if(taskData)
                currentTaskOrder.splice(0,0,taskData._id)
            }else{

                currentTaskOrder=[taskData?._id]
            }
            await siteEngineerCollection.updateOne({name:siteEngineerName},{currentTaskOrder})
            
              
            res.redirect('/task?message=Task added')
        }
        catch(err){
            res.json({message:"cannot save the task right now"})
        }
        }
} 

export default taskController


