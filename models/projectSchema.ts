import mongoose, { Document, Schema, Types} from 'mongoose'

interface projectDocument extends Document {
    name:string,
    location:{lati:number,longi:number},
    place:string,
    budget:number,
    progress:number,
    siteEngineers:[{siteEngineerId:Types.ObjectId,status:boolean}],
    projectManagers:[{projectManagerId:Types.ObjectId,status:boolean}],
    superUserId:Types.ObjectId,
    status:string,
}

const newSchema = new mongoose.Schema<projectDocument>({ // defining structure of collections
    name:{type:String,required:true},
    location:{lati:{type:Number,required:true},longi:{type:Number,required:true}},
    place:{type:String,required:true},
    budget:{type:Number,required:true},
    progress:{type:Number,default:0},
    siteEngineers:[{siteEngineerId:Schema.Types.ObjectId,status:{type:Boolean,default:true}}],
    projectManagers:[{projectManagerId:Schema.Types.ObjectId,status:{type:Boolean,default:true}}],
    superUserId:{type: Schema.Types.ObjectId },
    status:{type:String,default:'Not started'},
})

const projectCollection = mongoose.model<projectDocument>('project_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default projectCollection