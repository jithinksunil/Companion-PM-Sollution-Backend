import mongoose,  { Document, Schema } from 'mongoose'

interface adminDocument extends Document {
    email:String,
    password:String,
  }

const newSchema=new mongoose.Schema<adminDocument>({//defining structure of collections
    email:{type:String,required:true},
    password:{type:String,required:true},
})

const adminCollection=mongoose.model<adminDocument>('admin_collection',newSchema)//creating collection using the defined schema and assign to new Model

export default adminCollection