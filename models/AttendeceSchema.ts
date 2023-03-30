import mongoose, { Document, Schema} from 'mongoose'

interface attendenceDocument extends Document {
    date: string,
    attendences: [{
            _id: mongoose.Types.ObjectId,
            name: string
        }]
}

const newSchema = new mongoose.Schema<attendenceDocument>({ // defining structure of collections
    date: {
        type: String,
        required: true
    },
    attendences: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String
            }
        }
    ]
})

const attendenceCollection = mongoose.model<attendenceDocument>('attendence_collection', newSchema) // creating collection using the defined schema and assign to new Model

export default attendenceCollection
