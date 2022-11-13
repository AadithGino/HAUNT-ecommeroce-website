const userschema = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const cartSchema = require("../../models/cartSchema")
const whishlistSchema = require("../../models/whishlistSchema")
const {ObjectId} = require("mongodb")
exports.homeGet = async (req,res)=>{

   try {
    let limit = 10;
    if(req.query.page == 1){
      limit = limit+limit;
    }else if (req.query.page == 0){
      limit = limit-10;
    }
    let cart;
    let whishlist;
    let whishlistproducts;
    let products = await productSchema.find({}).limit(limit)
    const count12 = await productSchema.count();
    let category = await categorySchema.find({})
    let count 
    console.log(products); 
    let user;
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

   cart = await cartSchema.find({userid:userid})

   let cart1; 

  
   

  console.log(cart);
  console.log("HEHEHEHEHHEHHEHEHererer5644444444444444444");

            user = "login"
    }else{
            user = "not"
    }
    
    if(whishlistproducts){
      console.log(whishlistproducts)
      whishlist = whishlistproducts
    }


    if(cart){
      cart=0
    }


    res.render('index.ejs',{ product:products,login:req.session.user,username:req.session.user,cat:category,user,cart,count,whislist:whishlist,totalPages: Math.ceil(count12  / limit),
    previous: 2 - 1});
   } catch (error) {
    console.log(err);
   }

}