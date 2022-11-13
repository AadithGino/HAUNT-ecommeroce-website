const { ObjectId, ObjectID } = require("bson");
const productSchema = require("../../models/productschema")
const whishlistSchema = require("../../models/whishlistSchema")
const cartSchema = require("../../models/cartSchema")

exports.whishlistGet = async (req,res)=>{
    

    if(req.session.user){
        let userid = req.session._id;
        let cartproducts = await whishlistSchema.aggregate([
          {
            $match:{userid:ObjectId(userid) }
          },
  
          {
            $unwind : "$products"
          },
          {
            $project:{
              product:"$products.productid",
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
        let count  = await cartSchema.aggregate([
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
        res.render("whishlist",{username:req.session.user,cart:cartproducts,count})
        
    }else{
        res.redirect("/login")
    }
      

}

exports.addToWhishlist = async(req,res)=>{
    let userid = req.session._id;
    if(req.session.user){
        let productid = req.query.id;
        console.log(productid);
        var proobj={
            product : productid,
            productid : ObjectId(productid)
          }

          console.log(proobj);

          var obj = {
            userid:userid,
            products : proobj
          }
      
          let userwhishlist = await whishlistSchema.find({userid:userid})
          
      
          if(userwhishlist.length<1){
            
          whishlistSchema.create(obj)
      
          }else{
            var proobj={
                product : productid,
                productid : ObjectId(productid)
                
              }
            let proExist = await whishlistSchema.find({userid:userid,"products":proobj})
            if(proExist.length===0){
            whishlistSchema.findOneAndUpdate({userid:userid},{$push:{products: proobj }},function(err){
                if(err){
                  console.log(err);
                }
              })
              console.log("added to whishlist");
            }else{
              console.log("REMOVE FROM WHSISHLIST WHUILE ADDING");
              whishlistSchema.findOneAndUpdate({userid:userid},{$pull:{products:{product:productid}}},function(err){
                if(err){
                  console.log(err);
                }
              })
              console.log("removed from whosh");
            }
          }
    }else{
        res.redirect("/login")
    }

}


exports.removeitem = async (req,res)=>{
    let productid = req.query.id;
    let userid = req.session._id;
    console.log(req.query.id+"hi");
  
    whishlistSchema.updateOne({userid:userid,"products.product":productid},{$pull:{products:{product:productid}}},function (err){
      if(err){
        console.log(err);
      }
    })

    res.redirect("/whishlist")
}