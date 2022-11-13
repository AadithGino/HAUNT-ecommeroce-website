const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({

    userid : mongoose.SchemaTypes.ObjectId,
    amount : {type:Number},
    // coins :{type:Number},
    // coinhistory :[],
    history : []
})


const model = mongoose.model('Wallet', walletSchema)

module.exports = model