const userschema = require("../../models/userSchema")
const cartSchema = require("../../models/cartSchema")
const {ObjectId} = require("mongodb")
const bcrypt = require("bcrypt")
let loginerrormsg ="12";
let editerrormsg = "12";
let count;
let userid ;
let passwordchangemsg="12";
exports.profileGet = async(req,res)=>{
    if(req.session.user){ 
        userid = req.session._id;
        let userprofile = await userschema.findOne({firstname:req.session.user})
        console.log(userprofile.firstname);
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
        res.render("profile",{user1:userprofile,username:req.session.user,count,passwordchangemsg})
        passwordchangemsg="12";
       }else{
        res.redirect("/login") 
       }
    }

    let userpassword;
    exports.changepasswordGet = async(req,res)=>{
        if(req.session.user){
            let userid = req.session._id;
            let user = await userschema.find({_id:userid})
            userpassword = user[0].password;
             
            
            res.render("changepassword",{username:req.session.user,count:0,error:loginerrormsg,count})
             loginerrormsg ="12";
        }else{
            res.redirect("/login")
        }
    }

let newpassword;
exports.changepasswordpost = async(req,res)=>{
    let password = req.body.newpassword
    let oldpassword = req.body.oldpassword
    let newpassword = await bcrypt.hash(password,10)
    bcrypt.compare(oldpassword,userpassword,function  (err,respo){
        if(respo){
        console.log("PASSOWORD MATCH AHNEE");
        let userid = req.session._id;
        console.log(newpassword+"HEHEHEHEHEHHE");
       if(oldpassword==password){
        loginerrormsg="Password Cannot Be Same As Old Passoword"
        res.redirect("/change-password")
       }else{
        userschema.updateOne({_id:userid},{$set:{password:newpassword}},function(err,doc){
          if(err){
              console.log(err);
          }
      })
      passwordchangemsg="Password Changed Successfully !!"
      res.redirect("/userprofile")
       }
        
       }else {
         loginerrormsg ="Incorrect Password"
         res.redirect("/change-password")
         console.log("PASS NO MATCH"); 
       }
     })
    
}



exports.edituserprofileGET = async(req,res)=>{
    if(req.session.user){
        let userid = req.session._id;
        let details = await userschema.findOne({_id:userid})
        
        res.render("edituserprofile",{error:editerrormsg,details,count})
        editerrormsg="12"
    }else{
        res.redirect("/login")
    }
}

exports.edituserprofilePost = async(req,res)=>{
    const firstname = req.body.firstname; 
  const lastname = req.body.lastname; 
  const email = req.body.email; 
  const number = req.body.number;
  
const userData1 ={
      firstname,
      lastname,
      email,
      number
     } 
let useremail;
let usernumber;
let userid = req.session._id;
let user = await userschema.findOne({_id:userid})
if(user.email!=email){
useremail = await userschema.findOne({email:email})
}
if(user.number!=number){
    usernumber = await userschema.findOne({number:number})
}

if(useremail){
    editerrormsg ="Email Is Already Registered"
    res.redirect("/edituserprofile")
}else if(usernumber){
    editerrormsg = "Mobile Number Is Already Registered"
    res.redirect("/edituserprofile")
}else{
    let userid = req.session._id
    userschema.updateOne({_id:userid},{$set:userData1},function(err){
        if(err){
            console.log(err);
        }
    })
    res.redirect("/userprofile")
}
}