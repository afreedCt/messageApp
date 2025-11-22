const mongoose = require('mongoose')

const connectDB=()=>{
    const connectString=process.env.MONGODB_CONNECTION_STRING
    console.log(connectString)
    mongoose.connect(connectString).then((res)=>{
        console.log("Connected to DB ")
    }).catch((err)=>{
        console.log("Error to connnect DB : ",err)
    })
}

module.exports=connectDB