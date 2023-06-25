import mongoose from 'mongoose'
const mongodb: () => void = () => {

    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.MONGO_URL as string, {
        retryWrites: true,
        w: 'majority'
    }).then(() => {
        console.log('Data Base connected')
        
    }).catch(() => {
        console.log('Cannot connect to Data Base')
    })
}
export default mongodb
