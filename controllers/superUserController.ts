import { reqType,resType } from "../types/expressTypes"
import superUserCollection from "../models/superUserSchema"

const superUseController={
    backend:async (req:reqType,res:resType)=>{
        res.send('ffffffffffffff')
    },
    signUp:async (req:reqType,res:resType)=>{
        await superUserCollection.insertMany([req.body])
        res.json({status:true})
    }
}

export default superUseController