const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema({

    coupon : {type:String},
    price:{type:Number},
    minprice : {type:Number},
    user:[]

})


const model = mongoose.model('Coupons', couponSchema)

module.exports = model