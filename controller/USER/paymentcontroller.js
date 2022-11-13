const cartSchema = require("../../models/cartSchema")


exports.paymentGet = async (req,res)=>{
    if(req.session.user){
        res.render("payment")
    }else{
        res.redirect("/login")
    }
}