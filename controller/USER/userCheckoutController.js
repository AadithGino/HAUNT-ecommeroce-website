const user = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const cartSchema = require("../../models/cartSchema")
const userSchema = require("../../models/userSchema")
const addressSchema = require("../../models/addressSchema")
const {ObjectId}  = require("mongodb") 
const { ObjectID } = require("bson")
const { AddOnResultContext } = require("twilio/lib/rest/api/v2010/account/recording/addOnResult")





exports.checkoutGet = async (req,res)=>{

  if(req.session.user){
    
    let userid = req.session._id;

    let originaltotalprice = await cartSchema.aggregate([
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

      console.log("ORIFINAL ROTOTOTO "+originaltotalprice);

      

      // WITHOU OFFER PRICE 

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
            total : {$sum:{$multiply:['$quantity',"$product.price"]}}
          }
        }

      ])

    
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
            quantity:"$products.quantity"
          }
        },
        {
          $lookup:{
            from:"products",
            localField:"product",
            foreignField: "_id",
            as:"products"
          }
        }

      ])

      let address = await addressSchema.aggregate([
        {
          $match:{userid:ObjectId(userid) }
        },

        {
          $unwind : "$address"
        },
        {
          $project:{
            firstname:"$address.firstname",
            lastname:"$address.lastname",
            address : "$address.address1",
            city:"$address.city",
            company :"$address.company",
            address2 :"$address.address2",
            country:"$address.country",
            zip:"$address.zip",
            phone:"$address.phone",
            sstatus :"$status"
          }
        }
      ])


      
      let user = await userSchema.find({_id:userid})

      // console.log(address[1].sstatus);

      let username=req.session.user

      
      if(totalprice[0].total){
        
        
        res.render("checkout",{total:totalprice,originaltotalprice:originaltotalprice,cart:cartproducts,user,username,address});
        
      
      }else{
        res.redirect("/")
      }

      }else{
      res.redirect("/login")
      }
}


exports.selectaddressGet = async(req,res)=>{
  if(req.session.user){
    let userid = req.session._id;
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

          //  Address  


          
      let useraddress = await addressSchema.aggregate([
        {
          $match:{userid:ObjectId(userid)}
        },

        {
          $unwind : "$address"
        },
        {
          $project:{
            firstname : "$address.firstname",
            lastname : "$address.lastname",
            company : "$address.company",
            address1 : "$address.address1",
            address2 : "$address.address2",
            city : "$address.city",
            country : "$address.country",
            zip : "$address.zip",
            phone : "$address.phone",
            sstatus :"$status"
          }
        }
      ])



      addressSchema.updateMany({
        userid: userid,
        "address.status" : true
      },
      {
        $set: {
          "address.$.status" : false
        }
      }
      ).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
      })
      
        res.render("selectaddress",{address:useraddress,username:req.session.user})
      
      
      
  }else{
    res.redirect("/login")
  }
}



exports.selectaddressPost = async(req,res) =>{

  console.log(req.body.address);
   
  let id = req.body.address


addressSchema.updateMany({
  _id: id,
  "address.status" : false
},
{
  $set: {
    "address.$.status" : true
  }
}
).then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
})
  

res.redirect("/selectpayment")

}







