import { timeStamp } from 'console'
import mongoose, { Document } from 'mongoose'

export interface GuestDocument extends Document {
    name: string,
    image: string,
    companyName: string,
    guestToken: string,
    status: boolean,
    membership:string,
    position:string,
    createdAt:Date
}

const newSchema = new mongoose.Schema<GuestDocument>({
    // defining structure of collections
    name: {
        type: String,
        default:'Guest'
    },
    guestToken:{
        type:String
    },
    image: {
        type: String
    },
    companyName: {
        type: String,
        required: true,
        default:"Guest"
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    membership:{
        type: String,
        required: true,
        default: 'Free'
    },
    position:{type:String,default:"guest"},
    createdAt:{
        type:Date
    }
},{timestamps:true})

const guestCollection = mongoose.model<GuestDocument>('guest_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default guestCollection
