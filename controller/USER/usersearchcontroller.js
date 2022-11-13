const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const cartSchema = require("../../models/cartSchema")
const {ObjectId} = require("mongodb")

let searchresult;
let user;
let searchkeyword;
let count;
let userid;
exports.searchGet = async (req,res)=>{
    userid = req.session._id;
      searchkeyword=req.body.search;
      searchresult = await productSchema.find({itemname:{$regex: ".*"+searchkeyword+".*",$options:'i'}})
      res.redirect("/searchdisplay")
}

exports.searchdisplayGet =async (req,res)=>{
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
        res.render('searchdisplay', { product:searchresult,login:"userloginstatus",user,username:req.session.user,search1:searchkeyword,cat:category,count});
}