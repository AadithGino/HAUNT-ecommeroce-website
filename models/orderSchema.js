
const mongoose = require("mongoose")
const { stringify } = require("uuid")
const moment = require("moment")

const orderSchema = new mongoose.Schema({
    username : String,
    userid : mongoose.SchemaTypes.ObjectId,
    products : [],
    address:[], 
    date : {
        type:String,
        default: moment().format('L')
    },
    status : String,
    payment : String,
    totalprice : Number,
    coupon : String,
    time:{
        type:String,
        default: moment().format(),
        // moment().format('MMMM Do YYYY, h:mm:ss a');
    },
})

 
const model = mongoose.model('Orders',orderSchema)

module.exports = model