const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    email:String,
    companyName:String,
    password:String,
})

const superUserCollection=new mongoose.model('super_user_collection',newSchema)//creating collection using the defined schema and assign to new Model

export default superUserCollection