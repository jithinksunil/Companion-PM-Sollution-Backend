import mongoose, { Document, Types} from 'mongoose'

interface notificationDocument extends Document {
    notifiedIndividualId:Types.ObjectId,
    senderId:Types.ObjectId,
    notification:string,
    url:string
}
const newSchema = new mongoose.Schema<notificationDocument>({
    notifiedIndividualId:Types.ObjectId,
    senderId:Types.ObjectId,
    notification:String,
    url:String,
},{timestamps:true})
const notificationCollection = mongoose.model<notificationDocument>('notification_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default notificationCollection