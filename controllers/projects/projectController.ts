import {reqType, resType} from "../../types/expressTypes"
import projectCollection from "../../models/projectSchema"
import projectManagerCollection from "../../models/projectManagerSchema"
import mongoose from "mongoose"
import { Types } from "mongoose"

const projectController = {
    projects:async(req : reqType, res : resType) => {
        try{
        let {search} = req.query
        if (!search){
            search = ''
        } 

        
        let projectManagersList=await projectManagerCollection.aggregate([{$match:{superUserId:new Types.ObjectId(req.session.superUser._id)}},{$project:{name:1}}])
        
        const unAssignedProjectManager=projectManagersList.find((item)=>item.name==="unAssigned")
            
        if(!unAssignedProjectManager){
            await projectManagerCollection.insertMany([{name:"unAssigned",superUserId:new Types.ObjectId(req.session.superUser._id)}])
            projectManagersList=await projectManagerCollection.aggregate([{$match:{superUserId:new Types.ObjectId(req.session.superUser._id)}},{$project:{name:1}}])

        }

        const projectsList=await projectCollection.aggregate([{$match:{$and:[{superUserId:new Types.ObjectId(req.session.superUser._id)},{$or:[{name:{
            $regex: search,
            $options: 'i'
        }},{place:{
            $regex: search,
            $options: 'i'
        }}]}]}},{$unwind:"$projectManagers"},{$match:{"projectManagers.status":true}},{$lookup:{
                from:'project_manager_collections',
                foreignField:'_id',
                localField:'projectManagers.projectManagerId',
                as:'projectManager'
            }},{$project:{
                projectManagerName:'$projectManager.name',
                name:1,
                place:1,
                location:1,
                budget:1,
                status:1,
                progress:1,
            
            }}])
                const data={projectsList,projectManagersList}
                res.json({superUserTokenVerified:true,data})
        }catch(err){
                res.json({superUserTokenVerified:true,message:'Cannot get details now '})
                console.log(err);
                
            }
     },
    createProject: async (req : reqType, res : resType) => {
        try{
        const {name,place}=req.body
        let {projectManagerId,lati,longi,budget}=req.body
        console.log(projectManagerId);
        if(!projectManagerId||projectManagerId=="unAssigned"){
            const unAssignedPm=await projectManagerCollection.findOne({name:"unAssigned"})
                console.log(unAssignedPm);
                projectManagerId=unAssignedPm?.toObject()._id
        }else{
            projectManagerId=new Types.ObjectId(projectManagerId)
        }
        
        const superUserId=new Types.ObjectId(req.session.superUser._id)
        lati=parseFloat(lati)
        longi=parseFloat(longi)
        budget=parseFloat(budget)
        console.log(projectManagerId);
        
        await projectCollection.insertMany([{name,place,budget,location:{lati,longi},projectManagers:[{projectManagerId,status:true}],superUserId}])
            res.json({superUserTokenVerified:true,status:true,message:'Project added'})
        }catch(err){
            console.log(err);
            res.json({superUserTokenVerified:true,status:false,message:'Project cannotbe added to data base right now'}) 
        }
    }

}


export default projectController
