const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({ 

    userid : mongoose.SchemaTypes.ObjectId,
    products :[]
})


const model = mongoose.model('usercarts', cartSchema)

module.exports = model