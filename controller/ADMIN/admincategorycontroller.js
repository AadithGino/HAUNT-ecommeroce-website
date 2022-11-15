const categorySchema = require("../../models/categoryschema")
const productSchema = require("../../models/productschema")

let categoryerrormsg = "12";
let categorydeleterr = "12";

exports.categorydisplayGet = async (req,res)=>{
    if(req.session.admin){
        let value1 = await categorySchema.find({})
        res.render("displaycategory",{value:value1,categoryerrormsg,categorydeleterr})
        categoryerrormsg="12"
        categorydeleterr="12";
      }else{
        res.redirect("/admin/login")
      }
}


exports.deletecategory = async (req,res) =>{
    let categoryid = req.query.id;
  const products = await productSchema.findOne({category:categoryid})
  if(products){
    categorydeleterr="Products in this category exists Delete The Products Or Change Their Category!!"
  }else{
 
  
  categorySchema.deleteOne({_id:categoryid},(err)=>{
    console.log(err);
  })
  }
 
  res.redirect("/admin/displaycategory")
}



exports.categoryPost = async (req,res)=>{
  try {
    let category = req.body.category;
  let catexist = await categorySchema.find({category:{$regex: ".*"+category+".*",$options:'i'}})
  console.log(catexist);
  if(catexist.length!=0){
    categoryerrormsg="Category Already Existing"
    res.redirect("/admin/displaycategory")
  }else{
    categorySchema.create({category})
    res.redirect("/admin/displaycategory")
  } 
  } catch (error) {
    res.send(error)
  }
}
