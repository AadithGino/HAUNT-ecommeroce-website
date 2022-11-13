const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({ 

    userid : mongoose.SchemaTypes.ObjectId,
    address :[],
    
})


const model = mongoose.model('address', addressSchema)

module.exports = model