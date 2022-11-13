const { Double } = require("mongodb")
const mongoose = require("mongoose")

const productschema = new mongoose.Schema({
    
    itemname: {type:String , required: true},
    description :{type:String, required: true},
    brand:{type:String,required:true},
    category:{type: mongoose.Schema.Types.ObjectId},
    price:{type: Number  , required: true},
    categoryprice:{type: Number  , required: true},
    quantity : {type: Number,required:true},
    originalprice:{type:Number,required : true},
    image1:{type:String,required:true},
    image2:{type:String,required:true},
})


const model = mongoose.model('Products', productschema)

module.exports = model