const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    referal:{type:String},
    email:{type:String,required:true,unique:true},
    number:{type:Number,required:true,unique:true},
    status:{type:Boolean,default:true},
    password:{type:String,required:true}
})


const model = mongoose.model('User', userSchema)

module.exports = model