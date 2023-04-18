import mongoose, { Document, Schema} from 'mongoose'

interface conversationDocument extends Document {
    members: [mongoose.Types.ObjectId]
}
const newSchema = new mongoose.Schema<conversationDocument>({
    members:[mongoose.Types.ObjectId],
},{timestamps:true})


const conversationCollection = mongoose.model<conversationDocument>('conversation_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default conversationCollection
