import { reqType,resType } from "../../types/expressTypes"
import adminCollection from "../../models/adminSchema"
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
    }
}

export default adminController