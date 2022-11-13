const userSchema = require("../../models/userSchema")


exports.userdisplayGet = async (req,res)=>{
    
    if(req.session.admin){
        let userdata = await userSchema.find({});
        res.render("userdisplay",{value:userdata})
      }else{
        res.redirect("/admin/login")
      }
}

exports.singleuserGet = async (req,res)=>{
  if(req.session.admin){
    let userid=req.query.id;
    console.log("dsddsfsdf"+userid);
      const userdata = await userSchema.findOne({_id:userid})
      res.render("singleuserdisplay",{value:userdata})
      }else{
        res.redirect("/admin/userdisplay")
      }
}

exports.blockuserGet = (req,res)=>{
  let userid = req.query.id;
  console.log("block"+userid);
  userSchema.findByIdAndUpdate({_id:userid},{status:false},(err)=>{
    console.log(err);
  })

  res.redirect("/admin/userdisplay") 

}

exports.unblockuserGet = (req,res)=>{
    let userid = req.query.id;
  console.log("unblock"+userid);
  userSchema.findByIdAndUpdate({_id:userid},{status:true},(err)=>{
    console.log(err);
  })
  
  res.redirect("/admin/userdisplay") 
}

