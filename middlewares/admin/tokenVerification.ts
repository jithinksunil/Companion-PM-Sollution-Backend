import { reqType,resType } from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const adminVerifyToken=(req:reqType,res:resType,next:()=>void)=>{
    const adminToken:string=req.cookies.adminToken
    if(adminToken){
        jwt.verify(adminToken,'mySecretKeyForAdmin',(err,decoded)=>{
            if(err){
                req.session.destroy()
                res.json({adminTokenVerified:false,message:'Token verification failed'})
            }else{
                console.log('Token Verified');
                next()
            }
        })
    }else{
        req.session.destroy()
        res.json({adminTokenVerified:false,message:'Token verification failed'})
    }
}