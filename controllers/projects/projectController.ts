import {reqType, resType} from "../../types/expressTypes"
import projectCollection from "../../models/projectSchema"
import projectManagerCollection from "../../models/projectManagerSchema"
import mongoose from "mongoose"

const projectController = {
    projects:async(req : reqType, res : resType) => {
        projectManagerCollection.aggregate([{$match:{}},{$project:{name:1}}]).then((projectManagersList)=>{
            projectCollection.aggregate([{$match:{}},{$project:{name:1}}]).then((projectsList)=>{
                const data={projectsList,projectManagersList}
                res.json({superUserTokenVerified:true,data})
                console.log('ivided ethi tto');
            }).catch(()=>{
                res.json({superUserTokenVerified:true,message:'Cannot get details now '})
            })
        }).catch(()=>{
            res.json({superUserTokenVerified:true,message:'Cannot get details now '})
        })
        
     },
    createProject:(req : reqType, res : resType) => {
        const {name}=req.body
        let {projectManager}=req.body
        let {lati,longi}=req.body
        lati=parseFloat(lati)
        longi=parseFloat(longi)
        if(projectManager===undefined){
            projectManager='unAssingned'
        }
        else if(projectManager!=='unAssingned'){
            projectManager=new mongoose.Types.ObjectId(projectManager)
        }
        
        projectCollection.insertMany([{name,location:{lati,longi},projectManager}]).then((data)=>{
            if(projectManager!=='unAssingned'){
                projectManagerCollection.updateOne({_id:data[0].projectManager},{$push:{projects:{_id:data[0]._id}}}).then(()=>{
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
