import { reqType,resType } from "../../types/expressTypes"
import superUserCollection from "../../models/superUserSchema"
import jwt from 'jsonwebtoken'
import cloudinary from '../../config/cloudinaryConfig'

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
        superUserCollection.findOne({_id:req.session.superUser._id}).then((superUserData)=>{
            res.json({superUserTokenVerified:true,superUserData})
        }).catch(()=>{res.json({superUserTokenVerified:true,message:'Cannot fetch data now data base issue'})})
    },
    updateImage:(req:reqType,res:resType)=>{
        console.log(req.params.id);
        const userId=req.params.id
        if(req.file){
            cloudinary.uploader.upload(
                req.file.path,{
                    transformation: [
                    { width: 485, height: 485, gravity: "face", crop: "fill" }]
                }
            ).then((result)=>{
                superUserCollection.updateOne({_id:userId},{image:result.secure_url}).then(()=>{
                    res.json({staus:true,message:'successfully updated'})
                }).catch(()=>{
                    res.json({staus:false,message:'data base facing issue try later'})
                })
            }).catch((err)=>{
                console.log('----------');
                console.log(err)
                console.log('----------');
             res.json({status:false,message:'cannot upload now to cloudinary'})})
            
        }
        else{
            res.json({status:false,message:'Select a jpeg format'})
        }
        
    }
}

export default superUseController