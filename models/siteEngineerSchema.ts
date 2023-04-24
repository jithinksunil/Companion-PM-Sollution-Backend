import mongoose, {Document, Schema} from 'mongoose'
import { Types } from 'mongoose'

interface siteEngineerDocument extends Document {
    name: string,
    image: string,
    email: string,
    companyName: string,
    superUserId: Schema.Types.ObjectId,
    logginUserName: string,
    password: string,
    status: boolean,
    projects:[{projectId:Types.ObjectId,tasks:[Types.ObjectId]}],
    position:string
}

const newSchema = new mongoose.Schema<siteEngineerDocument>({
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
        required: true
    },
    superUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    logginUserName: {
        type: String,
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    projects:[{
        projectId:Schema.Types.ObjectId,
        tasks:[Schema.Types.ObjectId]
    }],
    position:{type:String,default:"siteEngineer"}
})

const siteEngineerCollection = mongoose.model<siteEngineerDocument>('site_engineer_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default siteEngineerCollection


