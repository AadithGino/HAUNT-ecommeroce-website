const orderSchema = require("../../models/orderSchema")
const productSchema = require("../../models/productschema")
const walletSchema = require("../../models/walletSchema")
const cartSchema = require("../../models/cartSchema")
const {ObjectId} = require("mongodb")
const moment = require("moment")
const { order } = require("paypal-rest-sdk")
let count;

exports.vieworderGet = async(req,res)=>{
    if(req.session.user){
      let limit =5;
      let page = 1;



      const startIndex = (page-1)*limit;
      const endIndex = page*limit

      if(req.query.page){
        page = req.query.page;
      }

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
        if(count.length!=0){
          count = count[0].total;
        }else{
          count = 0;
        }
        let count12 =  await orderSchema.count({userid:userid})
        console.log(count12+"THis is the length of orders");
        
        let allorders = await orderSchema.find({userid:userid}).sort({time:-1}).limit(limit).skip((page - 1) * limit)
        
        res.render("vieworders",{username:req.session.user,count,value:allorders,totalPages: Math.ceil(count12  / limit),
        previous: page - 1})
    }else{
        res.redirect("/login")
    }
}




exports.cancelOrder = async (req,res)=>{
    let id = req.query.id;
    let orderpaymnet = await orderSchema.find({_id:id})
    orderpaymnet = orderpaymnet[0].payment
    if(orderpaymnet!="COD"&&orderpaymnet!="Pending"){
    orderSchema.updateMany({
        _id : id,
         
      },
      {
        $set: { 
          status : "Cancelled",
          payment : "Refunding"
          
        }
      },function(err,doc){
        if(err){
            console.log(err); 
        }else{
            console.log(doc);
        }
      })

      /// WALLET 
      let userid = req.session._id;
      let userwallet = await walletSchema.find({userid:userid})
      
      
      if(userwallet.length!=0){
        let wallet = await walletSchema.findOne({userid:userid})
        let walletamount = wallet.amount;
        let totalprice = await orderSchema.find({_id:id})
        totalprice = totalprice[0].totalprice;
        walletamount = walletamount+totalprice;
        console.log(walletamount);
        walletSchema.updateOne({userid:userid},{$set:{amount:walletamount}},function(err){
          if(err){
            console.log(err);
          }
        })
        let history = {
          amount : totalprice,
          value : 'added',
          time : moment().format('LLL') ,
          method : "Refunded"
        }
        walletSchema.updateOne({userid:userid},{$push:{history:history}},function(err){
          if(err){
            console.log(err);
          }
        })
        
      }else{
         let totalprice = await orderSchema.find({_id:id})
        let amount = totalprice[0].totalprice;
        let history = {
          amount : amount,
          value : 'added',
          time : moment().format('LLL') ,
          method : "Refunded"
        }
         let walletobj = {
          userid,
          amount,
          history
         }
         console.log(walletobj);
       walletSchema.create(walletobj)
      }
}else{
      orderSchema.updateMany({
        _id : id,
         
      },
      {
        $set: { 
          status : "Cancelled",
          payment : "COD"
          
        }
      },function(err,doc){
        if(err){
            console.log(err); 
        }else{
            console.log(doc);
        }
      })
    }

 
      let products = await orderSchema.find({_id:id})
      console.log(products[0].products.length+"this is the lengtt for frop loop");   
      let length = products[0].products.length;
      for(i=0;i< length;i++){
        let quantity = products[0].products[i].product_quantity
        let productquantity = await productSchema.findOne({_id:products[0].products[i].productid})
        console.log(productquantity.quantity);
        productquantity = productquantity.quantity;
        console.log(quantity+productquantity+"this is the quantity to be incrased");
        productSchema.findOneAndUpdate({_id:products[0].products[i].productid},{$set:{quantity:productquantity+quantity}},function(err){
          if(err){
            console.log(err);
          }
        })
      }
      

      res.redirect("/allorder")
      
}


exports.vieworderproducts = async (req,res)=>{
    let id = req.query.id;
    console.log(id+"HEHEHEHEHHEHEHH");
    let products = await orderSchema.find({_id:ObjectId(id)})
    // console.log(products);
 
    //   console.log(products[0].products[0].product_name);
    
      let product = products[0].products
      console.log(product);
      if(req.session.user){
        res.render("orderproduct",{username:req.session.user,count,product:products[0].products,order:products})
      }else{
        res.redirect("/login")
      }
}



exports.returnOrder = async(req,res)=>{
  const orderid = req.query.id;
  const id = req.query.id;
  const orders = await orderSchema.findOne({_id:ObjectId(orderid)})
  orderSchema.updateOne({_id:ObjectId(orderid)},{$set:{status:"Returning",payment:"Refunding"}},function(err){
    if(err){
        console.log(err);
    }
})



let products = await orderSchema.find({_id:id})
console.log(products[0].products.length+"this is the lengtt for frop loop");   
let length = products[0].products.length;
for(i=0;i< length;i++){
  let quantity = products[0].products[i].product_quantity
  let productquantity = await productSchema.findOne({_id:products[0].products[i].productid})
  console.log(productquantity.quantity);
  productquantity = productquantity.quantity;
  console.log(quantity+productquantity+"this is the quantity to be incrased");
  productSchema.findOneAndUpdate({_id:products[0].products[i].productid},{$set:{quantity:productquantity+quantity}},function(err){
    if(err){
      console.log(err);
    }
  })
}

      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// WALLET 

    // if(orders.payment!="COD"){

    let userid = req.session._id;
    let userwallet = await walletSchema.find({userid:userid})
    
    if(userwallet.length!=0){
      let wallet = await walletSchema.findOne({userid:userid})
      let walletamount = wallet.amount;
      let totalprice = await orderSchema.find({_id:id})
      totalprice = totalprice[0].totalprice;
      walletamount = walletamount+totalprice;
      console.log(walletamount);
      walletSchema.updateOne({userid:userid},{$set:{amount:walletamount}},function(err){
        if(err){
          console.log(err);
        }
      })
      let history = {
        amount : totalprice,
        value : 'added',
        time : moment().format('LLL') ,
        method : "Refunded"
      }
      walletSchema.updateOne({userid:userid},{$push:{history:history}},function(err){
        if(err){
          console.log(err);
        }
      })
      
    }else{
       let totalprice = await orderSchema.find({_id:id})
      let amount = totalprice[0].totalprice;
      let history = {
        amount : amount,
        value : 'added',
        time : moment().format('LLL') ,
        method : "Refunded"
      }
       let walletobj = {
        userid,
        amount,
        history
       }
       console.log(walletobj);
     walletSchema.create(walletobj)
    }
  // }


      res.redirect("/allorder")


  }

  exports.produtCancel = async(req,res)=>{
    if(req.session.user){
      let orderid = req.query.order; 
      let productid = req.query.id;
    
      let price=0;
      let productprice = await orderSchema.find({_id:orderid})
      for(var i = 0 ; i < productprice.length ; i++){
        for(var j =0 ; j< productprice[i].products.length ; j++){
          if(productprice[i].products[j].productid==productid){
            price = productprice[i].products[j].product_price * productprice[i].products[j].product_quantity;
          }
        }
      }

      console.log(productprice[i].products[j].product_price+"heheheheheheheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      const oldtotalprice = productprice[0].totalprice;
      const newtotalprice = oldtotalprice-price;
      console.log(oldtotalprice);
      orderSchema.updateOne({_id:orderid,"products.productid":productid},{$set:{"products.status":false,totalprice:newtotalprice}},function (err){
        if(err){
          console.log(err);
        }
      })
    // const userid = req.session._id;
    // let walletbalance = await walletSchema.findOne({userid:userid})
    // walletbalance = walletbalance.amount;
    // const newbalance = walletbalance-price;
    // walletSchema.updateOne({userid:userid},{$set:{amount:newbalance}})
    }else{
      res.redirect("/login")
    }
  }