const { ObjectId } = require("bson");
const orderSchema = require("../../models/orderSchema")

exports.InvoiceGet = async(req,res)=>{
    if(req.session.user){
        let id = req.query.id;
        let order = await orderSchema.find({_id:ObjectId(id)})
        console.log(order);
        res.render("userinvoice",{order})
    }else{
        res.redirect("/login")
    }
}