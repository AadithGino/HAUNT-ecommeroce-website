const user = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const cartSchema = require("../../models/cartSchema")
const {ObjectId}  = require("mongodb") 
const { ObjectID } = require("bson")

let categoryOfferprice=0;

exports.cartGet = async (req,res)=>{

    if(req.session.user){  
      let userid = req.session._id;
      let cartproducts = await cartSchema.aggregate([
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
        
      ])
      
      let totalprice = await cartSchema.aggregate([
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
            _id:null,
            total : {$sum:{$multiply:['$quantity',"$product.originalprice"]}}

          }
        }

      ])

       categoryOfferprice = await cartSchema.aggregate([
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
            _id:null,
            total : {$sum:{$multiply:['$quantity',"$product.categoryprice"]}}

          }
        }

      ])

      if(totalprice.length>0){
      if(totalprice[0].total > categoryOfferprice[0].total){
        totalprice = categoryOfferprice;
      }
    }

    

      
   
    res.render("cart.ejs",{login:req.session.user,username:req.session.user,cart:cartproducts,total:totalprice})
      }else{
        res.redirect("/login")
      }
    

}

exports.addToCartPost = async (req,res)=>{
  if(req.session.user) {
    let productid = req.query.id;
    let userid = req.session._id;


    var proobj={
      product : ObjectId(productid),
      quantity : 1
    }

    var obj = {
      userid:userid,
      products : proobj
    }

    let usercart = await cartSchema.find({userid:userid})

    if(usercart.length<1){

    cartSchema.create(obj)

    }else{

      let proExist = await cartSchema.findOne({userid:userid,"products.product": ObjectId(productid)})
      
      console.log(proExist+"PRO EXIST TTT TTT");
      
      if(proExist){
        cartSchema.findOneAndUpdate({userid:userid,"products.product":ObjectId(productid)},{$inc:{"products.$.quantity":1}},function (err){
          if(err){
            console.log(err);
          }
        })
      }
      else{
      cartSchema.findOneAndUpdate({userid:userid},{$push:{products:proobj}},function(err){
        if(err){
          console.log(err);
        }
      })
    }
    }
  }else{
    res.redirect("/login")
  }
}


exports.increaseqty = async (req,res)=>{
  let productid = req.query.id;
  let userid = req.session._id
  cartSchema.findOneAndUpdate({userid:userid,"products.product":ObjectId(productid)},{$inc:{"products.$.quantity":1}},function (err){
    if(err){
      console.log(err);
    }
  })
  res.redirect("/usercart")

}

exports.decreaseqty = async (req,res)=>{
  let productid = req.query.id;
  let userid = req.session._id
  cartSchema.findOneAndUpdate({userid:userid,"products.product":ObjectId(productid)},{$inc:{"products.$.quantity":-1}},function (err){
    if(err){
      console.log(err);
    }
  })
  

}


exports.removeitem = async (req,res)=>{
  let productid = req.query.id;
  let userid = req.session._id;
  console.log(req.query.id);

  cartSchema.updateOne({userid:userid,"products.product":ObjectId(productid)},{$pull:{products:{product:ObjectId(productid)}}},function (err){
    if(err){
      console.log(err);
    }
  })

  


  res.redirect("/usercart")


}
