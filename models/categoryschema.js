
const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({   
    category: String
})

 
const model = mongoose.model('Category', categorySchema)

module.exports = model