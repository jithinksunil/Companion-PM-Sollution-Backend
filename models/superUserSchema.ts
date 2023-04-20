import mongoose, { Document } from 'mongoose'

interface UserDocument extends Document {
    name: string,
    image: string,
    email: string,
    companyName: string,
    password: string,
    status: boolean,
    membership:string,
    position:string
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
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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
    position:{type:String,default:"superUser"}
})

const superUserCollection = mongoose.model<UserDocument>('super_user_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default superUserCollection
