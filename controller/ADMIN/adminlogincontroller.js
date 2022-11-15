const bcrypt = require("bcrypt")

const adminSchema = require("../../models/adminschema")

let loginerrormsg="12";

exports.adminloginGET = (req,res)=>{
    if(req.session.admin){
        res.redirect("/admin") 
      }else{
        res.render("adminlogin",{error:loginerrormsg})
        loginerrormsg="12";
      }
}

exports.adminLoginPost = async (req,res)=>{
try {
  const email = req.body.email;
  const password = req.body.password;
  const user= await adminSchema.findOne({email:email})
  if(user!=null){
    bcrypt.compare(password,user.password,function(err,resp){
        if(resp){
            req.session.admin = user.email;
            res.redirect("/admin")
        }else{
            loginerrormsg="Incorrecr Password"
            res.redirect("/admin/login")
        }
    })
  }else{
    loginerrormsg="Admin Not Found"
    res.redirect("/admin/login")
  } 
} catch (error) {
  
}
}


exports.adminlogout = (req,res)=>{
    req.session.admin=false;
    res.redirect("/admin")
}