import mongoose, { Document } from 'mongoose'

export interface UserDocument extends Document {
    name: string,
    image: string,
    email: string,
    companyName: string,
    password: string,
    status: boolean,
    membership:string,
    position:string,
    guestToken:string,
    createdAt:Date
}

const newSchema = new mongoose.Schema<UserDocument>({
    // defining structure of collections
    name: {
        type: String
    },
    image: {
        type: String
    },
    email: {
        type: String,
    },
    companyName: {
        type: String,
        required:true,
        default:'GuestCompany'
    },
    password: {
        type: String,
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
    position:{type:String,default:"superUser"},
    guestToken:{type:String},
    createdAt:{type:Date}
},{timestamps:true})

const superUserCollection = mongoose.model<UserDocument>('super_user_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default superUserCollection
