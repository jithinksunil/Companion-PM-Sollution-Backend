import mongoose, { Document, Schema} from 'mongoose'

interface projectDocument extends Document {
    name:string,
    location:{lati:number,longi:number},
    projectManager:mongoose.Types.ObjectId|string,
}

const newSchema = new mongoose.Schema<projectDocument>({ // defining structure of collections
    name:{type:String,required:true},
    location:{lati:{type:Number,required:true},longi:{type:Number,required:true}},
    projectManager:{type: Schema.Types.Mixed ,default:'unAssingned'}
})

const projectCollection = mongoose.model<projectDocument>('project_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default projectCollection