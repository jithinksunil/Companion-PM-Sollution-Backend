import mongoose,  { Document, Schema } from 'mongoose'

interface UserDocument extends Document {
    email:String,
    companyName:String,
    password:String,
  }

const newSchema=new mongoose.Schema<UserDocument>({//defining structure of collections
    email:{type:String,required:true},
    companyName:{type:String,required:true},
    password:{type:String,required:true},
})

const superUserCollection=mongoose.model<UserDocument>('super_user_collection',newSchema)//creating collection using the defined schema and assign to new Model

export default superUserCollection