import mongoose, { Document, Schema, Types} from 'mongoose'

interface projectDocument extends Document {
    name:string,
    location:{lati:number,longi:number},
    place:string,
    budget:number,
    progress:number,
    tasks:[Types.ObjectId],
    projectManagerId:Types.ObjectId|string,
    superUserId:Types.ObjectId|string,
    status:string,
}

const newSchema = new mongoose.Schema<projectDocument>({ // defining structure of collections
    name:{type:String,required:true},
    location:{lati:{type:Number,required:true},longi:{type:Number,required:true}},
    place:{type:String,required:true},
    budget:{type:Number,required:true},
    progress:{type:Number,default:0},
    tasks:[{type:Schema.Types.ObjectId}],
    projectManagerId:{type: Schema.Types.Mixed ,default:'unAssingned'},
    superUserId:{type: Schema.Types.Mixed },
    status:{type:String,default:'Not started'},
})

const projectCollection = mongoose.model<projectDocument>('project_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default projectCollection