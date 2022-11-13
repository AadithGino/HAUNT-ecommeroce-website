const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({

    banner1 : {type:String,required:true},
    banner2 : {type:String,required:true}
})


const model = mongoose.model('Banners', bannerSchema)

module.exports = model