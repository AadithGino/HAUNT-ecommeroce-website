const { ObjectId } = require("bson")
const productSchema = require("../../models/productschema")  
const addressSchema = require("../../models/addressSchema")
const orderSchema = require("../../models/orderSchema")
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_s2GFDEC7NxwBj2',
  key_secret: 'SdT62QbpeyeQsBQDZvCLFDHW',
});


let id;
let orderid1;
let product; 
exports.buynowGet = async (req,res)=>{
     id = req.query.id 

    product = await productSchema.find({_id:ObjectId(id)})
    console.log(product);

    res.redirect("/buy-select-address")
    
}


exports.selectaddresspost = async (req,res)=>{
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

res.redirect("/buynowselectpayment")

}


exports.buyplaceorder = async(req,res)=>{
    let userid  = req.session._id;
    let products = []
    console.log(req.body.name);
    let payment = req.body.name; 
    

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
          console.log(address[0].status);
        }
      }
      
     
      // let cart = await cartSchema.aggregate([
      //   {
      //     $match:{userid:ObjectId(userid) }
      //   },

      //   { 
      //     $unwind : "$products"
      //   },
      //   {
      //     $project:{
      //       product:"$products.product",
      //       quantity:"$products.quantity"
      //     }
      //   },
      // ])

      productSchema.findOneAndUpdate({_id:id},{$inc:{quantity:-1}},function(err){
        if(err){
          console.log(err);
        }
      })
      

    // for(i=0;i<cart.length;i++){
    //   let quantity = await productSchema.findOne({_id:cart[0].product})
    //   quantity = quantity.quantity
    //   console.log(quantity+"heheheheheheheheheh");
    //   console.log(cart[i].quantity,"HEHEHEHEHEHHEHEHEH");
    //   productSchema.findOneAndUpdate({_id:cart[i].product},{$set:{quantity : quantity-cart[i].quantity}},function(err){
    //     if(err){
    //       console.log(err);
    //     }
    //   })
    // }
      


      if(payment==="cod")  {
        let order = {
          username: req.session.user,
          userid : userid,
          products : product, 
          address : maddress,
          status : 'placed',
          totalprice : product[0].price,
          payment : 'COD'
        }
        
  
        
  
  
        orderSchema.create(order)
        res.redirect("/ordersuccess")  
      }else{
        let order = {
          username: req.session.user,
          userid : userid,
          products : products, 
          address : maddress,
          status : 'placed',
          totalprice : product[0].price,
          payment : 'Pending'
        }
        
  
       
        orderSchema.create((order),function(err,doc){
          console.log(doc._id+"idididididiidiidiidid");
          req.session.payment = doc._id
          console.log(req.session.payment+"SESSIOMMM");
          
          var options = {
            amount: product[0].price,
            currency : "INR",
            receipt : ""+req.session.payment
          };
          instance.orders.create(options,function(err,order){
            console.log(order);
          })
        })
      
      }      
}


exports.buynowrazorpay = async (req,res)=>{
  orderSchema.create((onlineorder),async function(err,doc){
    console.log(doc._id+"idididididiidiidiidid");
    let orderid = doc._id;
    orderid1 = doc._id;
    
   return new Promise((resolve,reject)=>{
    var options = {
      amount: product[0].price*100,
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
      res.render("buynowrazorpay",{razorpay:result})
      
    })
    
  })
}


exports.buynowverifypay = async(req,res)=>{
  console.log("thankachi");
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
        payment : "Online",
        
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
  }
}







exports.checkout = async (req,res)=>{
    if(req.session.user){
        res.render("buynowselectpayment")
    }else{
        res.redirect("/login")
    }
}


