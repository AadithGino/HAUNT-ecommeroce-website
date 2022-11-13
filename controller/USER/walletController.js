const walletSchema = require("../../models/walletSchema")
const cartSchema = require("../../models/cartSchema")
const {ObjectId} = require("mongodb")
const moment = require("moment")
const { render } = require("ejs")
const paypal = require('paypal-rest-sdk');
const { parse } = require("uuid")

exports.walletGet = async(req,res)=>{
    if(req.session.user){
        let userid = req.session._id;
        let walletbalance = await walletSchema.findOne({userid:userid})
        if(walletbalance){
            walletbalance = walletbalance.amount;
        }else{
            walletbalance=0;
        }
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
        res.render("wallet",{balance:walletbalance,username:req.session.user,count})
    }else{
        res.redirect("/login")
    }
}


exports.walletHistory = async(req,res)=>{
  if(req.session.user){
    const userid =req.session._id;
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

    
    let wallethistory = await walletSchema.findOne({userid:userid}).sort({"history.time":1})
    
    
 
    
    res.render("wallet_history",{username:req.session.user,count,value:wallethistory})
  }else{
    res.redirect("/login")
  }
}

let amount;

exports.addmoenytoWallet = async(req,res)=>{
  if(req.session.user){
     amount = req.body.price;
     console.log(amount);
    res.redirect("/paypaladdmoney")
  }
}


exports.paypalGet = async(req,res)=>{
  if(req.session.user){
    console.log("PAYPAL POST ");
    res.render("paypaladdmoney",{totalamount:amount})
  }else{
    res.redirect("/login")
  }
}


exports.paypalpost = async(req,res)=>{
  console.log("hehehehhe");
  const create_payment_json = {
    "intent": "sale", 
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3001/addmoneysuccess",
        "cancel_url": "http://localhost:3001/addmoneycancel"
    },
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": amount
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
            "total": amount
        }
    }]
  };

   
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
   async  function addmoney (){
      const userid = req.session._id; 
    const wallet = await walletSchema.findOne({userid:userid})
    if(wallet){
      const history = {
        amount,
        value : "added",
        time : moment().format('LLL') ,
        method : "add to wallet"
      }
   
      
      walletSchema.updateOne({userid:userid},{$inc:{amount:amount}},function(err){
        console.log(err);
      })
      walletSchema.updateOne({userid:userid},{$push:{history:history}},function(err){
        console.log(err);
      })
      res.redirect("/wallet")
    }else{
      const history = {
        amount,
        value : "added",
        time : moment().format('LLL') ,
        method : "add to wallet"
      }
      const obj = {
        userid,
        amount,
        history
      }
      walletSchema.create(obj )
    } 
     }
addmoney()
      
    }
});

}