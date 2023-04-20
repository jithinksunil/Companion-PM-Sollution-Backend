import {reqType, resType} from "../../types/expressTypes"
import projectCollection from "../../models/projectSchema"
import projectManagerCollection from "../../models/projectManagerSchema"
import mongoose from "mongoose"
import { Types } from "mongoose"

const projectController = {
    projects:async(req : reqType, res : resType) => {
        console.log(req.session.superUser._id);
        projectManagerCollection.aggregate([{$match:{superUserId:new Types.ObjectId(req.session.superUser._id)}},{$project:{name:1}}]).then((projectManagersList)=>{
            console.log(projectManagersList)
            projectCollection.find({superUserId:req.session.superUser._id}).then((projectsList)=>{
                const data={projectsList,projectManagersList}
                res.json({superUserTokenVerified:true,data})
            }).catch(()=>{
                res.json({superUserTokenVerified:true,message:'Cannot get details now '})
            })
        }).catch(()=>{
            res.json({superUserTokenVerified:true,message:'Cannot get details now '})
        })
        
     },
    createProject: (req : reqType, res : resType) => {
        const {name,place}=req.body
        let {projectManagerId,lati,longi,budget}=req.body
        const superUserId=req.session.superUser._id
        lati=parseFloat(lati)
        longi=parseFloat(longi)
        budget=parseFloat(budget)
        if(projectManagerId===undefined){
            projectManagerId='unAssingned'
        }
        else if(projectManagerId!=='unAssingned'){
            projectManagerId=new mongoose.Types.ObjectId(projectManagerId)
        }
        
        projectCollection.insertMany([{name,place,budget,location:{lati,longi},projectManagerId,superUserId}]).then((data)=>{
            if(projectManagerId!=='unAssingned'){
                projectManagerCollection.updateOne({_id:data[0].projectManagerId},{$push:{projects:{_id:data[0]._id}}}).then(()=>{
                    res.json({superUserTokenVerified:true,status:true,message:'Project added'})
                    
                }).catch(()=>{
                    res.json({superUserTokenVerified:true,status:false,message:'not updated in projectmanager'})
                })
            }
            else{
                projectManagerCollection.findOne({name:'unAssingned'}).then((result)=>{
                    if(result){
                        projectManagerCollection.updateOne({name:'unAssingned'},{$push:{projects:{_id:data[0]._id}}}).then(()=>{
                            res.json({superUserTokenVerified:true,status:true,message:'Project added'})
                            console.log('ellam ok aanyu');
                            
                        }).catch(()=>{
                            res.json({superUserTokenVerified:true,status:false,message:'not updated in projectmanager'})
                        })
                    }else{
                        const {_id, companyName} = req.session.superUser
                        projectManagerCollection.insertMany([{name:'unAssingned',companyName,superUserId:_id,projects:[{_id:data[0]._id}]}]).then(() => {
                            res.json({superUserTokenVerified:true,status:true,message:'Project added'})
                        }).catch(() => {
                            res.json({status: false, message: 'Connection cannot be added right now-database issue'})
                        })
                    }
                })
            }
            
        }).catch((err)=>{
            console.log(err);
            res.json({superUserTokenVerified:true,status:false,message:'Project cannotbe added to data base right now'}) 
            console.log(3);
        })
    }

}


export default projectController
