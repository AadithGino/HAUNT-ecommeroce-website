const addressSchema = require("../../models/addressSchema");
const cartSchema = require("../../models/cartSchema")
const {ObjectId} = require("mongodb")


let addressid;

exports.addressGet = async(req,res)=>{
    if(req.session.user)
    {
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
          $match:{userid:ObjectId(userid) }
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
          }
        }
      ])


  





        res.render("userviewaddres",{username:req.session.user,count,address:useraddress})
    }else{
        res.redirect("/login")
    }
}


exports.addaddress = async(req,res)=>{
const details = {    
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    company : req.body.company,
    address1 : req.body.address1,
    address2 : req.body.address2,
    city : req.body.city,
    country : req.body.country,
    zip : req.body.zip,
    phone: req.body.phone,
    status : false
    
}

const obj = {
    userid : req.session._id,
    address : details,
    status : false
}

let userid = req.session._id;
let addressexist = await addressSchema.find({userid:userid})
console.log(addressexist);

  addressSchema.create(obj)
  res.redirect("/useraddress")
  console.log(req.body);

}




exports.deleteaddress = async (req,res) =>{
  let id = req.query.id;
  let userid = req.session._id;

  addressSchema.findOne({_id:id,userid:userid}).remove((err)=>{
    if(err){
      console.log(err);
    }
  })

  res.redirect("/useraddress")
  
}


exports.addnewaddress = async (req,res)=>{
  const details = {    
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    company : req.body.company,
    address1 : req.body.address1,
    address2 : req.body.address2,
    city : req.body.city,
    country : req.body.country,
    zip : req.body.zip,
    phone: req.body.phone,
    status : false
    
}

const obj = {
    userid : req.session._id,
    address : details,
    status : false
}

let userid = req.session._id;
let addressexist = await addressSchema.find({userid:userid})
console.log(addressexist);

  addressSchema.create(obj)
  res.redirect("/selectaddress")
  console.log(req.body); 
}


exports.editaddress = async (req,res)=>{
if(req.session.user){
  
  addressid = req.query.id

  let Address = await addressSchema.find({_id:addressid})
  console.log(Address[0].address[0]);
  let address = Address[0].address[0]
  res.render("usereditaddress",{address,username:req.session.user,count:0})
}else{
  res.redirect("/login")
}
}

exports.editaddresspost = async(req,res)=>{
  const details = {    
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    company : req.body.company,
    address1 : req.body.address1,
    address2 : req.body.address2,
    city : req.body.city,
    country : req.body.country,
    zip : req.body.zip,
    phone: req.body.phone,
    status : false
}



let userid = req.session._id;

 
const obj = {
  userid : req.session._id,
  address : details,
  status : false
}

console.log(obj);



addressSchema.updateOne({_id:addressid},{$set:obj},function(err){
  if(err){
    console.log(err);
  }
})
res.redirect("/useraddress")




}