import {reqType, resType} from "../../types/expressTypes"
import projectCollection from "../../models/projectSchema"
import projectManagerCollection from "../../models/projectManagerSchema"
import mongoose from "mongoose"
import { Types } from "mongoose"

const projectController = {
    projects:async (req : reqType, res : resType) => {
        try{
        let {search} = req.query
        if (!search){
            search = ''
        } 
        console.log('reached');
        
        const unAssignedProjectManager=await projectManagerCollection.findOne({superUserId:new Types.ObjectId(req.session.superUser._id),name:'unAssigned'})
        
        if(!unAssignedProjectManager){
            console.log(Date.now());
            console.log(typeof(unAssignedProjectManager));
            console.log(unAssignedProjectManager);
            
            await projectManagerCollection.insertMany([{name:'unAssigned',superUserId:new Types.ObjectId(req.session.superUser._id)}])
        }
        const projectManagersList=await projectManagerCollection.aggregate([{$match:{superUserId:new Types.ObjectId(req.session.superUser._id)}},{$project:{name:1}}])
        
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
                let message;
                if(req.query.message){
                    message=req.query.message
                }
                res.json({tokenVerified:true,data,message})
        }catch(err){
                res.json({tokenVerified:true,message:'Cannot get details now '})
                console.log(err);
                
            }
     },
    createProject: async (req : reqType, res : resType) => {
        try{
        console.log(req.body);
        const {name,place}=req.body
        let {projectManagerId,lati,longi,budget}=req.body
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
            res.redirect('/project?message=Project added')
        }catch(err){
            console.log(err);
            res.json({tokenVerified:true,status:false,message:'Project cannotbe added to data base right now'}) 
        }
    }

}


export default projectController
