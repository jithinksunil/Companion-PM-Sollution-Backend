import mongoose from 'mongoose'

const mongodb: () => void = () => {

    mongoose.set('strictQuery', true)
    mongoose.connect('mongodb://127.0.0.1:27017/campanion_pm_sollution', {
        retryWrites: true,
        w: 'majority'
    }).then(() => {
        console.log('Data Base connected')
    }).catch(() => {
        console.log('Cannot connect to Data Base')
    })
}
export default mongodb
