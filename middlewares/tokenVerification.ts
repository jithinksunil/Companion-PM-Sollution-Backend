import { reqType,resType } from "../types/expressTypes"
import jwt from 'jsonwebtoken'

export const superUserVerifyToken=(req:reqType,res:resType,next:()=>void)=>{
    const superUserToken:string=req.cookies.superUserToken
    const adminToken:string=req.cookies.adminToken
    if(superUserToken){
        jwt.verify(superUserToken,'mySecretKeyForSuperUser',(err,decoded)=>{
            if(err){
                console.log(err);
                req.session.destroy()
                res.json({superUserTokenVerified:false})
            }else{
                next()
            }
        })
    }else{
        req.session.destroy()
        res.json({superUserTokenVerified:false})
    }
}