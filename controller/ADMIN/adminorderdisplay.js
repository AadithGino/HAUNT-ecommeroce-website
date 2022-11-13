const orderSchema = require("../../models/orderSchema")
const walletSchema = require("../../models/walletSchema")
const productSchema = require("../../models/productschema")
const {ObjectId} = require("mongodb")


exports.allorderdisplayGet = async(req,res)=>{
  let page =1 ;
  if(req.query.page){
    page = req.query.page
  }

  const startIndex = (page-1)*5;
  const endIndex =  page*5;
  let count12 =  await orderSchema.find({})

  count12 = count12.length;
  
  let allorders = await orderSchema.find().sort({time:-1}).limit(5).skip((page - 1) * 5)
    
    
    if(req.session.admin){
        res.render("allorderdisplay",{value:allorders,totalPages: Math.ceil(count12  / 5),
        previous: page - 1})
    }else{
        res.redirect("/admin/login")
        
    }
}


exports.cancelOrder = async(req,res)=>{
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
        
      }else{
         let totalprice = await orderSchema.find({_id:id})
        let amount = totalprice[0].totalprice;
         let walletobj = {
          userid,
          amount
         }
         console.log(walletobj);
       walletSchema.create(walletobj)
      }
}else if(orderpaymnet==="COD"){
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
    }else if(orderpaymnet==="Pending"){
      orderSchema.updateMany({
        _id : id,
         
      },
      {
        $set: { 
          status : "Cancelled",
          payment : "Was Pending"
          
        }
      },function(err,doc){
        if(err){
            console.log(err); 
        }else{
            console.log(doc);
        }
      })
    }

    // let products = await orderSchema.find({_id:id})
    // for(i=0;i<products.length;i++){
    //   let quantity = products[i].products[0].product_quantity
    //   let productquantity = await productSchema.findOne({_id:products[i].products[0].productid})
    //   console.log(productquantity.quantity);
    //   productquantity = productquantity.quantity;
    //   console.log(quantity+productquantity);
    //   productSchema.findOneAndUpdate({_id:products[i].products[0].productid},{$set:{quantity:productquantity+quantity}},function(err){
    //     if(err){
    //       console.log(err);
    //     }
    //   })
    // }
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
    

      res.redirect("/admin/allorder")
}


exports.vieworderproducts = async (req,res)=>{
    let id = req.query.id;
    console.log(id+"HEHEHEHEHHEHEHH");
    let products = await orderSchema.find({_id:ObjectId(id)})
    
     
      let product = products[0].products
      console.log(product[0]);
      if(req.session.admin){
        res.render("orderproductdisplay",{username:req.session.user,count:0,product:products[0].products})
      }else{
        res.redirect("/admin")
      }
}