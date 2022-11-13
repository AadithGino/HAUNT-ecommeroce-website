const twilio = require("../../OTP")
const client = require("twilio")(twilio.accountSID,twilio.authToken)

const userschema = require("../../models/userSchema") 
 
let otperrormsg="12";
let loginerrormsg="12"
exports.otploginGet = async (req,res)=>{

    if(req.session.user){
        res.redirect("/")
        
      }else{
        console.log(otperrormsg+"current error");
        res.render("otplogin",{error: otperrormsg })
        otperrormsg="12";
      }
}

let usernumber;
let otpmnumber;

exports.otploginpost = async (req,res)=>{
  otpmnumber = req.body.email;
  usernumber = await userschema.findOne({number:otpmnumber})
  console.log("234234324"+usernumber);
  if(usernumber!=null){
    console.log("heyyyeye")
  client
  .verify
  .services(twilio.serviceID)
  .verifications

  .create({
   to:`+91${req.body.email}`,
   channel:"sms"
  }).then((data)=>{
   console.log(data+"hehehehehe");
   res.redirect("/otpverify")
  })
  
  }
  else{
    otperrormsg ="Number Not Registered"
    res.redirect("/otplogin")
  }
console.log(req.body.email);
}


exports.otpverifyGet =  (req,res)=>{
    if(req.session.user){
        res.redirect("/")
      }else{
        res.render("otpverify",{error:loginerrormsg})
        loginerrormsg="12";
      }
}

exports.otpverifyPost = (req,res)=>{
  console.log(otpmnumber);
    client
  .verify
  .services(twilio.serviceID)
  .verificationChecks
  .create({
    
   to:`+91${otpmnumber}`,
   code:req.body.email
  }).then((data)=>{
   console.log(data.status);
 if(data.status=="approved"){
  req.session.user=usernumber.firstname;
  req.session._id = usernumber._id;
  res.redirect("/")
 }
 else{
  loginerrormsg="OTP INCORRECT";
  res.redirect("/otpverify")
 }
   console.log(req.body.email);
  }).catch((err)=>{
    res.send(err)
    console.log(err);
  })
}