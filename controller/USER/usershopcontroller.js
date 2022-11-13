const user = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const cartSchema = require("../../models/cartSchema")
const {ObjectId} = require("mongodb")
const whishlistSchema = require("../../models/whishlistSchema")
exports.shopGet = async (req,res)=>{
let page = 1;
if(req.query.page){
  page=req.query.page;
}

let products = await productSchema.find({}).limit(10).skip((page - 1) * 10)
let category = await categorySchema.find({})
let user;
let count;
let whishlist;
let userid = req.session._id;
        if(req.session.user){
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


          whishlistproducts  =  await whishlistSchema.aggregate([
            {
              $match:{userid:ObjectId(userid) }
            },
    
            {
              $unwind : "$products"
            },
            {
              $project:{
                product:"$products.product",
              }
            },
    
          ])



          if(whishlistproducts){
            console.log(whishlistproducts)
            whishlist = whishlistproducts
          }


                user = "login"
        }else{
                user = "not"
        }
        const count12 = await productSchema.count()
  res.render('shop.ejs', { product:products,username:req.session.user,cat:category,user,count,whislist:whishlist,totalPages: Math.ceil(count12  / 10),
  previous: page - 1});
    

}