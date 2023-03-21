import mongoose,  { Document, Schema } from 'mongoose'

interface UserDocument extends Document {
    name:String,
    image:String,
    email:String,
    companyName:String,
    password:String,
    status:Boolean
  }

const newSchema=new mongoose.Schema<UserDocument>({//defining structure of collections
    name:{type:String},
    image:{type:String},
    email:{type:String,required:true},
    companyName:{type:String,required:true},
    password:{type:String,required:true},
    status:{type:Boolean,required:true,default:true}
})

const superUserCollection=mongoose.model<UserDocument>('super_user_collection',newSchema)//creating collection using the defined schema and assign to new Model

export default superUserCollection