const user = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")

exports.categoryGet = async (req,res)=>{
    if(req.session.admin){
      res.render("addcategory")
    }else{
      res.redirect("/admin")
    }
}

