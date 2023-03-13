import { reqType,resType } from "../types/expressTypes"
export const superUserSessionCheck=(req:reqType,res:resType,next:()=>void)=>{
    if(req.session.superUser){
        next()
        console.log('session verified');
    }
    else{
        res.json({message:"unautherised acces"})
        req.session.destroy()
    }
}