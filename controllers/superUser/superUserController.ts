import { reqType,resType } from "../../types/expressTypes"
import superUserCollection from "../../models/superUserSchema"
import jwt from 'jsonwebtoken'

const superUseController={
    verifyToken:(req:reqType,res:resType)=>{
        res.json({superUserTokenVerified:true})
    },
    signUp:async (req:reqType,res:resType)=>{//any data can be recieved now so must be validated befor saving to database
        await superUserCollection.insertMany([req.body])
        res.json({status:true})
    },
    logIn:(req:reqType,res:resType)=>{
        const {email,password}=req.body
        console.log(email);
        console.log(password);
        
        superUserCollection.findOne({email}).then((superUser)=>{
            if(superUser){
                if(password===superUser.password){
                    req.session.superUser=superUser.toObject()//if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    let superUserData=superUser.toObject()
                    let token=jwt.sign(superUserData,'mySecretKeyForSuperUser', { expiresIn: '1h' })
                    res.json({verified:true,message:'Succesfully logged in',token})
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
        
    },superUserDashBoard:(req:reqType,res:resType)=>{
        const superUserData=req.session.superUser
        res.json({superUserTokenVerified:true,superUserData})
    },
    superUserProfile:(req:reqType,res:resType)=>{
        const superUserData=req.session.superUser
        res.json({superUserTokenVerified:true,superUserData})
    }
}

export default superUseController