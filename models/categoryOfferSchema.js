const mongoose = require("mongoose")

const categoryOffer = new mongoose.Schema({
    categoryid : {type:String},
    categoryname : {type:String},
    percentage:{type:Number},
    

})


const model = mongoose.model('CategoryOffer', categoryOffer)

module.exports = model