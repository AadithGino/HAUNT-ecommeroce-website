
const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const cartSchema = require("../../models/cartSchema")
const {ObjectId} = require("mongodb")
let user;
let userid;
let count


exports.categoryGet = async (req,res)=>{

  let categoryid = req.query.id;
  userid= req.session._id;
  console.log(categoryid);
  let products ;
  if(req.query.id == 1){
    products = await productSchema.find({})
  }else{
    products = await productSchema.find({category:categoryid})
  }
  console.log(products);
  let category = await categorySchema.find({})
 if(req.session.user){
  user = "login"
 }else{
  user = "not"
 }
 count  = await cartSchema.aggregate([
  {
    $match:{userid:ObjectId(userid) }  
  },

  {
    $unwind : "$products"
  },
  {
    $project:{
      product:"$products.product",
      quantity:"$products.quantity",
    }
  },
  {
    $lookup:{
      from:"products",
      localField:"product",
      foreignField: "_id",
      as:"products"
    }
  },
  {
    $project:{
      product:1,quantity:1,product:{$arrayElemAt:['$products',0]}
    }
  },
  {
    $group:{
      _id : null,
      total : {$sum:'$quantity'}
  }
}

])  
if(count.length!=0){
  count = count[0].total;
}else{
  count = 0;
}
  res.render("categoryprdctdisplay",{ product:products,login:"userloginstatus",user,username:req.session.user,cat:category,count})
}