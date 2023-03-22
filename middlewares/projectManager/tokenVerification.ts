import { reqType,resType } from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const projectManagerVerifyToken=(req:reqType,res:resType,next:()=>void)=>{
    const projectManagerToken:string=req.cookies.projectManagerToken
    if(projectManagerToken){
        
        jwt.verify(projectManagerToken,'mySecretKeyForProjectManager',(err,decoded)=>{
            if(err){
                console.log(err);
                req.session.destroy()
                res.json({projectManagerTokenVerified:false,message:'failed to varify token'})
            }else{
                console.log('Token Verified')
                next()
            }
        })
    }else{
        req.session.destroy()
        res.json({projectManagerTokenVerified:false,message:'failed to varify token'})
    }
}