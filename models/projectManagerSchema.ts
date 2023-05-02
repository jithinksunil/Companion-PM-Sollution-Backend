import mongoose, {Document, Schema} from 'mongoose'

interface ProjectMangerDocument extends Document {
    name: string,
    image: string,
    email: string,
    companyName: string,
    superUserId: mongoose.Types.ObjectId,
    logginUserName: string,
    password: string,
    status: boolean,
    position:string
}

const newSchema = new mongoose.Schema<ProjectMangerDocument>({
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
    position:{type:String,default:"projectManager"}
})

const projectManagerCollection = mongoose.model<ProjectMangerDocument>('project_manager_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default projectManagerCollection


