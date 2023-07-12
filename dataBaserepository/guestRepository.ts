import superUserCollection from "../models/superUserSchema"

export const findGuest=async (guestToken:string)=>{
    try{
        const guest=await superUserCollection.findOne({guestToken})
        return Promise.resolve(guest)
    }catch(err){
        return Promise.reject(err)
    }
}
export const createAndGetGuest=async (guestToken:string)=>{
    try{
        await superUserCollection.insertMany([{guestToken,position:'guest'}])
        const guest=await superUserCollection.findOne({guestToken})
        return Promise.resolve(guest)
    }catch(err){
        return Promise.reject(false)
    }
}

export const updateGuest=async (guestToken:string)=>{
    try {
        await superUserCollection.updateOne({guestToken},{$set:{status:false}})
        return Promise.resolve(true)
    } catch (error) {
        return Promise.reject(false)
    }
}