import mongoose, { Document, Schema, Types} from 'mongoose'

interface taskDocument extends Document {
    projectId:Types.ObjectId,
    siteEngineers:[{siteEngineerId:Types.ObjectId|string,status:boolean}],
    task:string,
    status:string,
    progress:number
}
const newSchema = new mongoose.Schema<taskDocument>({
    projectId:Types.ObjectId,
    siteEngineers:[{siteEngineerId:Schema.Types.Mixed,status:{type:Boolean,default:true}}],
    task:String,
    status:String,
    progress:Number,
},{timestamps:true})
const taskCollection = mongoose.model<taskDocument>('task_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default taskCollection