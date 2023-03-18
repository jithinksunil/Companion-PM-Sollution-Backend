import { reqType,resType } from "../../types/expressTypes"
import adminCollection from "../../models/adminSchema"
import superUserCollection from "../../models/superUserSchema"
import jwt from 'jsonwebtoken'

const adminController={
    verifyToken:(req:reqType,res:resType)=>{
        res.json({adminTokenVerified:true})
    },
    logIn:(req:reqType,res:resType)=>{
        const {email,password}=req.body
        
        
        adminCollection.findOne({email}).then((admin)=>{
            if(admin){
                if(password===admin.password){
                    req.session.admin=admin.toObject()//if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    let adminData=admin.toObject()
                    let token=jwt.sign(adminData,'mySecretKeyForAdmin', { expiresIn: '1h' })
                    res.json({verified:true,message:'Succesfully logged in',token})
                    console.log('ivide ellam ok aanu');
                    
                }else{
                    res.json({verified:false,message:'Wrong email or password'})
                }
            }else{
                res.json({verified:false,message:'User does not exist'})
            }
        }).catch((reject:Error)=>{
            console.log(reject)
            res.json({verified:false,message:'Sorry for Interuption ,Database facing issues'})
        })
        
    },adminDashBoard:(req:reqType,res:resType)=>{
        const adminData=req.session.admin
        res.json({adminTokenVerified:true,adminData})
    },
    adminProfile:(req:reqType,res:resType)=>{
        const adminData=req.session.admin
        res.json({adminTokenVerified:true,adminData})
    },
    superUserManagement:(req:reqType,res:resType)=>{
        superUserCollection.find().then((superUsersData)=>{
            res.json({adminTokenVerified:true,superUsersData})
        }).catch(err=>{
            console.log(err)
            res.json({adminTokenVerified:true,message:'Sorry for connot retrieve detas now, Database facing issues'})
        })
    },
    blockOrUnblock:(req:reqType,res:resType)=>{
        
        console.log(req.query.status)
        
        superUserCollection.updateOne({_id:req.query.id},{status:req.query.status}).then(()=>{
            res.json({action:true,message:'updated'})
        }).catch((err)=>{
            console.log(err)
            res.json({action:false,message:'Sorry for connot retrieve datas now, Database facing issues'})
        })
    },
}

export default adminController