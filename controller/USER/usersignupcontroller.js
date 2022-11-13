const userschema = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const walletSchema = require("../../models/walletSchema")
const bcrypt = require("bcrypt")
let referralCodeGenerator = require('referral-code-generator')
const moment = require("moment")



let signuperrormsg="12"
exports.signupGet = async (req,res)=>{
    if(req.session.user){
        res.redirect("/")
       }else{
        res.render("signup",{error:signuperrormsg})
          signuperrormsg="12";
       }

}

exports.signupPost = async(req,res)=>{
  const firstname = req.body.firstname; 
  const lastname = req.body.lastname; 
  const email = req.body.email; 
  const number = req.body.number;
  const recievedreferal = req.body.referal;
  const referaluseranme = firstname+lastname;
  const referal = referralCodeGenerator.custom('lowercase', 5, 2, referaluseranme);
  const password = await bcrypt.hash(req.body.password,10)
  
  const referalexist = await userschema.findOne({referal:recievedreferal})
  let refereduserid;
  if(referalexist){
    refereduserid = referalexist._id;
  }
  
  
const userData1 ={
      firstname,
      lastname,
      referal,
      email,
      number,
      password
     } 

   userschema.create(userData1,(err,data)=>{
      if(err){
       console.log(err);
       signuperrormsg = "Email Or Number is Already Registered";
       res.redirect("/signup")
      }else{
        console.log(data._id);
        let userid = data._id;
        let amount = 500 
        if(referalexist)
        {

          let history = {
            amount : 500,
            value : 'added',
            time : moment().format('LLL'),
            method : "Referal"
          }
    let walletobj = {
      userid,
      amount,
      history
     }
     
     walletSchema.create(walletobj)


     // adding money to one who have refered 
     async function wallet() {
      let currentbalance = await walletSchema.findOne({userid:refereduserid})
      if(currentbalance){
        currentbalance = currentbalance.amount;
      const newbalance = currentbalance+750;
      let history = {
        amount : 750,
        value : 'added',
        time : moment().format('LLL') ,
        method : "Referal"
      }
      walletSchema.updateOne({userid:refereduserid},{$set:{amount:newbalance}},function(err){
        if(err){
          console.log(err);
        }
      })

      walletSchema.updateOne({userid:refereduserid},{$push:{history:history}},function(err){
        if(err){
          console.log(err);
        }
      })
      }else{

        // const userid = refereduserid;
        // const amount = 750;
        // let walletobj = {
        //   userid,
        //   amount
        //  }

        var historyobj={
          amount : 750,
          value : 'added',
          time : moment().format('LLL'),
          method : "Referal"
        }
    
        var obj = {
          userid:refereduserid,
          amount : 750,
          history : historyobj
        }
         
         walletSchema.create(obj)

         
      }
     }
     wallet()
  }
      res.redirect("/login")
      }
    })
}