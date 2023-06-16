import { projectManagerSessionCheck } from "../middlewares/projectManager/sessionCheck"
import guestCollection from "../models/guestSchema"

export const findGuest=async (guestToken:string)=>{
    try{
        const guest=await guestCollection.findOne({guestToken})
        return Promise.resolve(guest)
    }catch(err){
        return Promise.reject(err)
    }
}
export const createAndGetGuest=async (guestToken:string)=>{
    try{
        await guestCollection.insertMany([{guestToken}])
        const guest=await guestCollection.findOne({guestToken})
        return Promise.resolve(guest)
    }catch(err){
        return Promise.reject(false)
    }
}

export const updateGuest=async (guestToken:string)=>{
    try {
        await guestCollection.updateOne({guestToken},{$set:{status:false}})
        return Promise.resolve(true)
    } catch (error) {
        return Promise.reject(false)
    }
}