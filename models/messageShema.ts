import mongoose, { Document, Types} from 'mongoose'

interface messageDocument extends Document {
    conversationId:Types.ObjectId,
    senderId:Types.ObjectId,
    recieverId:Types.ObjectId,
    message:string
}
const newSchema = new mongoose.Schema<messageDocument>({
    conversationId:Types.ObjectId,
    senderId:Types.ObjectId,
    recieverId:Types.ObjectId,
    message:String
},{timestamps:true})
const messageCollection = mongoose.model<messageDocument>('message_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default messageCollection