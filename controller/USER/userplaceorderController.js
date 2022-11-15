const cartSchema = require("../../models/cartSchema")
const addressSchema = require("../../models/addressSchema")
const orderSchema = require("../../models/orderSchema")
const productSchema = require("../../models/productschema")
const couponSchema = require("../../models/couponSchema")
const walletSchema = require("../../models/walletSchema")
const {ObjectId} = require("mongodb")
const Razorpay = require('razorpay');
const { TaskRouterGrant } = require("twilio/lib/jwt/AccessToken")
const moment = require("moment")


let coupon;
let wallet;
const paypal = require('paypal-rest-sdk');
const { ExportCustomJobInstance } = require("twilio/lib/rest/bulkexports/v1/export/exportCustomJob")

let categoryOfferprice=0;
let totalprice=0;
 
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AbYlSGt6I8m-8EwkPi_VEYFQeHMT7Dl3W50wl4sU8Y4YSzZOBb6Et2iaANG2uJuun1klLTeeIdgAGqnl',
  'client_secret': 'EOqaSYj7aQ_ypzj7QxSOwzN_Kpb57bVbFV9upLYLDsJOZ3fNl19AxQKyOtb7-Lclu7kB3oUJaMeNVDC9'
});
let discountprice=0;
let couponerrormsg = "12";
let paypalorderid;
let orderid1;
let onlineorder;
let totalamount; 
let discountamount=0;
let couponerrormsg1="12";
var instance = new Razorpay({
  key_id: 'rzp_test_s2GFDEC7NxwBj2',
  key_secret: 'SdT62QbpeyeQsBQDZvCLFDHW',
});



exports.selectpaymnetGet = async (req,res)=>{
  try {
    
  if(req.session.user){
    let discheck = req.query.validate;
    let userid = req.session._id;
    if(discheck==="000"){
      discountamount=0;
    }
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

    


    let totalpricewoff = await cartSchema.aggregate([
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

     totalprice = await cartSchema.aggregate([
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

  let walletbalancestatus=false;

   wallet = await walletSchema.findOne({userid:userid})
 if(wallet){
  wallet = wallet.amount;
 }



    if(totalprice.length){ 
      console.log(cartproducts);
      if(totalprice[0].total > categoryOfferprice[0].total){
        totalprice = categoryOfferprice;
      }
      console.log(totalprice);

      if(wallet >= totalprice[0].total){
        walletbalancestatus=true;
      }

      res.render("checkout",{total:totalprice,wallet,product:cartproducts,totalpricewoff,couponerrormsg,discountamount,discountprice,walletbalancestatus,couponerrormsg1}) 
      couponerrormsg = "12";
      couponerrormsg1="12";
    }else{  
      res.redirect("/login")
    }

    
  }else{
    res.redirect("/login")
  }
  } catch (error) {
    
  }
}

exports.placeOlder = async(req,res)=>{
    try {
      let userid  = req.session._id;
    let products = []
    console.log(req.body.name);
    let payment = req.body.name; 
    


      

    
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
          },
          
        },
        {
            $project:{
              _id : "$products._id",
                itemname :"$products.itemname",
                price : "$products.originalprice",
                categoryprice : "$products.categoryprice",
                image1 : "$products.image1",
                quantity : "$quantity"
            }
        }
         

      ]).then((data) => {
        console.log(data);
      
        for (let i = 0; i < data.length; i++) {
         if(data[i].price[0] < data[i].categoryprice[0]){
          products.push({
            productid : ObjectId(data[i]._id[0]),
            product_name: data[i].itemname[0],
            product_quantity: data[i].quantity,
            product_price: data[i].price[0],
            product_image : data[i].image1[0]
          });
         }else{
          products.push({
            productid : ObjectId(data[i]._id[0]),
            product_name: data[i].itemname[0],
            product_quantity: data[i].quantity,
            product_price: data[i].categoryprice[0],
            product_image : data[i].image1[0]
          });
         }
        }
      }) 

      let cart = await cartSchema.aggregate([
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
      ])

      
    

      

    for(i=0;i<cart.length;i++){
      let quantity = await productSchema.findOne({_id:cart[i].product})
      quantity = quantity.quantity
      console.log(quantity+"heheheheheheheheheh");
      console.log(cart[i].quantity,"HEHEHEHEHEHHEHEHEH");
      productSchema.findOneAndUpdate({_id:cart[i].product},{$set:{quantity : quantity-cart[i].quantity}},function(err){
        if(err){
          console.log(err);
        }
      })
    }

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
            status : "$address.status"
          }
        }
      ])

      let maddress;

      for(var i =0 ; i < address.length ; i++){
    
        if(address[i].status === true){
         maddress = address[i] 
          
        }
      }
      
     

      if(payment==="cod")  {
        let order;
       if(discountamount===0 ){
         order = {
          username: req.session.user,
          userid : userid,
          products : products, 
          address : maddress,
          status : 'placed',
          totalprice : totalprice[0].total,
          payment : 'COD',
          coupon : 'No Coupon Used'
        }
       }else{
        couponSchema.updateOne({coupon:coupon},{$push:{user:ObjectId(userid)}},function(err){
          if(err){
            console.log(err);
          }
        })
        order = {
          username: req.session.user,
          userid : userid,
          products : products, 
          address : maddress,
          status : 'placed',
          totalprice : discountamount,
          payment : 'COD',
          coupon : "Coupon Amount : "+discountprice 
        }
       }
        
  
        cartSchema.find({userid:userid}).remove((err)=>{
          if(err){
            console.log(err);
          }
        })
  
  
        orderSchema.create(order)
        res.redirect("/ordersuccess")  
        discountamount=0;
      }else if(payment==="razorpay"){
       

        

        
        if(discountamount===0 ){
          onlineorder = {
           username: req.session.user,
           userid : userid,
           products : products, 
           address : maddress,
           status : 'Pending',
           totalprice : totalprice[0].total,
           payment : 'Pending',
           coupon : 'No Coupon Used'
         }
         totalamount = totalprice[0].total;
        }else{
          couponSchema.updateOne({coupon:coupon},{$push:{user:ObjectId(userid)}},function(err){
            if(err){
              console.log(err);
            }
          })
          onlineorder = {
           username: req.session.user,
           userid : userid,
           products : products, 
           address : maddress,
           status : 'Pending',
           totalprice : discountamount,
           payment : 'Pending',
          coupon : "Coupon Amount : "+discountprice 
         }
         totalamount = discountamount;
        }
        
  
        cartSchema.find({userid:userid}).remove((err)=>{
          if(err){
            console.log(err);
          }
        })

        req.session.payment = "online"
        res.redirect("/razorpay-return")
        discountamount=0;
      }else if(payment==="paypal"){

         
        if(discountamount===0 ){
          onlineorder = {
           username: req.session.user,
           userid : userid,
           products : products, 
           address : maddress,
           status : 'Pending',
           totalprice : totalprice[0].total,
           payment : 'Pending',
           coupon : 'No Coupon Used'
         }
         totalamount = totalprice[0].total;
        }else{
          couponSchema.updateOne({coupon:coupon},{$push:{user:ObjectId(userid)}},function(err){
            if(err){
              console.log(err);
            }
          })
          onlineorder = {
           username: req.session.user,
           userid : userid,
           products : products, 
           address : maddress,
           status : 'Pending',
           totalprice : discountamount,
           payment : 'Pending',
           coupon : "Coupon Amount : "+discountprice 
         }
         totalamount = discountamount;
        }
        
        
        orderSchema.create(onlineorder,function(err,doc){
          if(err){
            console.log(err);
          }else{
            console.log(doc._id);
            paypalorderid = doc._id
          }
        })
        cartSchema.find({userid:userid}).remove((err)=>{
          if(err){
            console.log(err);
          }
        })
        res.redirect("/paypal")
        discountamount=0;
      }else if(payment==="wallet"){
        let order;
       if(discountamount===0 ){
        
         order = {
          username: req.session.user,
          userid : userid,
          products : products, 
          address : maddress,
          status : 'placed',
          totalprice : totalprice[0].total,
          payment : 'Wallet',
          coupon : 'No Coupon Used'
        }
        let walletbalance = wallet-totalprice[0].total;
        walletSchema.updateOne({userid:userid},{$set:{amount:walletbalance}},function(err){
          if(err){
            console.log(err);
          }
        })
        let history = {
          amount : totalprice[0].total,
          value : 'deducted',
          time : moment().format('LLL') ,
          method : "Purchase"
        }
        walletSchema.updateOne({userid:userid},{$push:{history:history}},function(err){
          if(err){
            console.log(err);
          }
        })
       }else{
        order = {
          username: req.session.user,
          userid : userid,
          products : products, 
          address : maddress,
          status : 'placed',
          totalprice : discountamount,
          payment : 'Wallet',
          coupon : "Coupon Amount : "+discountprice 
        }

        let walletbalance = wallet-discountamount;
        walletSchema.updateOne({userid:userid},{$set:{amount:walletbalance}},function(err){
          if(err){
            console.log(err);
          }
        })
        let history = {
          amount : totalprice[0].total,
          value : 'deducted',
          time : moment().format('LLL') ,
          method : "Purchase"
        }
        walletSchema.updateOne({userid:userid},{$push:{history:history}},function(err){
          if(err){
            console.log(err);
          }
        })
        
       }
       
       
       
       
        cartSchema.find({userid:userid}).remove((err)=>{
          if(err){
            console.log(err);
          }
        })

        orderSchema.create(order)
        res.redirect("/ordersuccess")  
        discountamount=0;
      }

      let supercoin = totalprice[0].total/10000;
      console.log(parseInt(supercoin) +"Number Of Super Coin While Placing Order");
    } catch (error) {
      
    }

      
      
}




let onlineorderstatus;
exports.Razorpayorder = async(req,res)=>{
  orderSchema.create((onlineorder),async function(err,doc){
    console.log(doc._id+"idididididiidiidiidid");
    let orderid = doc._id;
    orderid1 = doc._id;

    let userid = req.session._id;
   
    
   return new Promise((resolve,reject)=>{
    var options = {
      amount: totalamount*100,
      currency : "INR",
      receipt : ""+orderid
    };
    instance.orders.create(options,function(err,order){
      resolve(order)
      console.log(order);
    })
   })
    .then((result)=>{
      console.log(result);
      res.render("razorpay",{razorpay:result,totalamount,user:req.session.user,})
    })
    
  })
  
}


exports.orderSuccess = async (req,res)=>{
  if(req.session.user){
    res.render("success")
  }
} 

exports.verifypayment = async(req,res)=>{
  console.log(req.body);
  const crypto = require("crypto")
  let hmac = crypto.createHmac('sha256','SdT62QbpeyeQsBQDZvCLFDHW')
  let details = req.body;
  console.log(details);
  hmac.update(details['Payment[razorpay_order_id]']+'|'+details['Payment[razorpay_payment_id]']);
  hmac=hmac.digest('hex')
  console.log(hmac);
  if(hmac==details['Payment[razorpay_signature]']){
    console.log("SYCCESSSSSSSS");
    onlineorderstatus = true
    orderSchema.updateMany({
      _id : orderid1,
      
    },
    {
      $set: { 
        payment : "RazorPay",
        status : "placed"
        
      }
    },function(err,doc){
      if(err){
          console.log(err);
      }else{
          console.log(doc);
      }
    })

    
    
  }else{
    onlineorderstatus = false;
    console.log("ONLINE PAYMENT FAILEDD");
    orderSchema.updateMany({
      _id : orderid1,
      
    },
    {
      $set: { 
        payment : "Failed",
        status : "Failed"
        
      }
    },function(err,doc){
      if(err){
          console.log(err);
      }else{
          console.log(doc);
      }
    })
  }
  
}


exports.paymentCheckingGEt = async (req,res) =>{

  if(onlineorderstatus){
    res.redirect("/ordersuccess")
  }else{
    res.send("payment failed")
  }
}



// PAYPAL 

 
exports.payaplget = (req,res)=>{
  res.render("paypal",{totalamount,user:req.session.user})
} 


exports.paypalpost = async(req,res)=>{
  
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://hauntjwellers.online/success",
          "cancel_url": "http://hauntjwellers.online/cancel"
      },
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": totalamount
          },
          "description": "Hat for the best team ever"
      }]
  };
  
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
  
}


exports.payaplsuccess = async(req,res)=>{
  
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": totalamount
          }
      }]
    };
  
     
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
        orderSchema.updateMany({
          _id : paypalorderid,
          
        },
        {
          $set: { 
            payment : "PayPal",
            status : "placed"
            
          }
        },function(err,doc){
          if(err){
              console.log(err);
          }else{
              console.log(doc);
          }
        })

        res.redirect("/ordersuccess")
      }
  });
  
}




exports.selectpay12 = async(req,res)=>{
  res.render("cartselectpay1")
}


exports.paypalfailed = async(req,res)=>{
  if(req.session.user){
    res.render("paymentfailed")
    orderSchema.updateOne({_id:paypalorderid},{$set:{status:"Failed",payment:"Failed"}},function(err){
      if(err){
        console.log(err);
      }
    })
  }
}


exports.applycouponpost = async(req,res)=>{
   coupon = req.body.coupon;
  let userid = req.session._id;
  let couponused =await couponSchema.find({coupon:coupon,user:ObjectId(userid)})
 
  let coupon1 = await couponSchema.findOne({coupon:coupon})
  console.log(coupon1); 
  
  
  if(coupon1){
    if(couponused.length!=0){
      couponerrormsg="Coupon is already used"
      discountamount=0;
      res.redirect("/selectpayment")
    }else{
      discountprice = coupon1.price;
      
     totalprice = await cartSchema.aggregate([
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

    // discountprice = (parseInt(coupon1.price)/100 * parseInt(totalprice[0].total))

    if(totalprice[0].total > categoryOfferprice[0].total){
      totalprice = categoryOfferprice;
    }
    let price = parseInt(totalprice[0].total)
    if(price < coupon1.minprice){
      couponerrormsg1="Price Should Be Greater Than "+coupon1.minprice
      res.redirect("/selectpayment")
    }else{
   discountamount = price-discountprice;
   console.log(discountamount);
  
   
    couponerrormsg="Coupon Applied"
    res.redirect("/selectpayment")
    couponerrormsg="12";
    }
  }
    

  }else{
    couponerrormsg="Coupon doesnt exist"
    res.redirect("/selectpayment")
    discountamount=0;
  }
  
}


exports.removeCoupon = async(req,res)=>{
  discountamount=0;
  res.redirect("/selectpayment")
}

