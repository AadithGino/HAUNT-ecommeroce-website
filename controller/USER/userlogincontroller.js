const userschema = require("../../models/userSchema")
const bcrypt = require("bcrypt")
let loginerrormsg = "12"
exports.loginGet = async (req,res)=>{
    if(req.session.user){
        res.redirect("/")
       }else{
        res.render("login",{error:loginerrormsg})
        loginerrormsg="12"
       }
}


exports.loginpost = async(req,res)=>{
    const email = req.body.email;
    const password1 = req.body.password;
    console.log(email,password1);
    const user= await userschema.findOne({email:email}) 
    if(user!=null){
      if(user.status){
          bcrypt.compare(password1,user.password,function(err,respo){
             if(respo){
              req.session.user = user.firstname;
              req.session._id =user._id;
              console.log(req.session.user);
              res.redirect("/")
              console.log(req.session.user);
            }else {
              loginerrormsg ="Incorrect Password"
              res.redirect("/login") 
              console.log("hey"); 
            }
          })
      
    }
      else{
        loginerrormsg ="Your Account Is Temporarly Suspended"
        res.redirect("/login")
      }
    }else{
      loginerrormsg="Email Not Registered";
      res.redirect("/login")
    }
}



exports.LogoutGet = (req,res)=>{
  req.session.user=false
  res.redirect("/")
}