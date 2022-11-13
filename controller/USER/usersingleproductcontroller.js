const user = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const {ObjectId} = require("mongodb")
const cartSchema = require("../../models/cartSchema")
const whishlistSchema = require("../../models/whishlistSchema")



exports.singleproductGet = async (req,res)=>{
  let whishlist;
  let user;
  let count;
  if(req.session.user){
    let userid = req.session._id;    
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
                      console.log(count);
                      if(count.length!=0){
                        count = count[0].total;
                      }else{
                        count = 0;
                      }

                      
    user = "login"
}else{
    user = "not"
}
    const id=req.query.id;
    console.log(id);
    

    let userid = req.session._id;

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

      
      let product = await productSchema.findOne({_id:id})
      let productcategory = product.category;
      let similaritems = await productSchema.find({category:productcategory})
      console.log(similaritems);
      console.log("HEHEHEHEHEH");

      let prowhishlist = await whishlistSchema.findOne({userid:userid,"products.product":id})
      
      let prowhisglist1 = false;
      if(prowhishlist){
        prowhisglist1 = true;
      }

      console.log(prowhisglist1+"This is the prowhishlist");


    const prodetails = await productSchema.aggregate([
      {
        $match: { _id: ObjectId(id) },
      },
      {
        $lookup: {
          from: "categories", 
          localField: "category",
          foreignField: "_id",
          as: "Result",
        },
      },
      { $unwind: "$Result" },
    ])
      .then((response) => {
        
        
        res.render("singleproductview",{product:response,login:"userloginstatus",username:req.session.user,user:user,count,whishlist,similaritems,prowhisglist1})
      })
      .catch((err) => {
        console.log(err);
      });
}
    