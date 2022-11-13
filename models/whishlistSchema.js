const mongoose = require("mongoose")

const whishlist = new mongoose.Schema({

    userid : mongoose.SchemaTypes.ObjectId,
    products :[]

})


const model = mongoose.model('whishlist', whishlist)

module.exports = model