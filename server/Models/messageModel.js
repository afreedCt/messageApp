const mongoose = require('mongoose')

const messageSchema=new mongoose.Schema({
    // sender:{type:mongoose.Types.ObjectId,ref:'User'},
    sender:{type:String,required:true},
    room:{type:String,required:true},
    content:{type:String,required:true},
    date:{type:Date,default:Date.now()}
},{timestamps:true})

const Message=new mongoose.model('Message',messageSchema)

module.exports={Message}