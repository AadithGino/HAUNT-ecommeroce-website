const { ObjectID } = require("bson");
const OrderSchema = require("../../models/orderSchema")
const walletSchema = require("../../models/walletSchema")
let discountamount=0;
let price=0;
let coupon;
let couponerrormsg="12";
let orderid;
let orderamount;
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_s2GFDEC7NxwBj2',
    key_secret: 'SdT62QbpeyeQsBQDZvCLFDHW',
  });
  


exports.payagain = async(req,res)=>{
    if(req.session.user){
        orderid = req.query.id;
        orderamount = await OrderSchema.findOne({_id:orderid})
       price = orderamount.totalprice;
       res.render("payagain",{discountamount,price,couponerrormsg})
    }else{
        res.redirect("/login")
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
      
    discountamount = price-discountprice;
    console.log(discountamount); 
     couponerrormsg="Coupon Applied"
     res.redirect("/payagain")
     couponerrormsg="12";
     }
     
 
   }else{
     couponerrormsg="Coupon doesnt exist"
     res.redirect("/payagain")
     discountamount=0;
   }
   
 }


 exports.Razorpayorder = async(req,res)=>{

      let userid = req.session._id;
     
      
     return new Promise((resolve,reject)=>{
      var options = {
        amount: price*100,
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
        res.render("payagainrazorpay",{razorpay:result,price,user:req.session.user,})
      })
  }

  exports.payagainPost = async(req,res)=>{
    let order = req.body.name;
    console.log(order);
    
    if(order==="cod"){
        OrderSchema.updateOne({_id:ObjectID(orderid)},{$set:{payment:"COD",status:"placed"}},function(err){
            console.log(err);
        })
        res.redirect("/allorder")
    }else if(order==="razorpay"){
        res.redirect("/payagainrazorpay")
    }else if(order==="paypal"){
        
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
      OrderSchema.updateMany({
        _id : orderid,
        
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
      OrderSchema.updateMany({
        _id : orderid,
        
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
    res.redirect("/allorder")
  }


  exports.payaplget = (req,res)=>{
    res.render("paypalpayagain",{totalamount,user:req.session.user})
  } 

  

  exports.paypalpost = async(req,res)=>{
  
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3001/success",
          "cancel_url": "http://localhost:3001/cancel"
      },
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": price
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
              "total": price
          }
      }]
    };
  
     
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
        OrderSchema.updateMany({
          _id : orderid,
          
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