const { ObjectId } = require("bson");
const orderSchema = require("../../models/orderSchema")

exports.InvoiceGet = async(req,res)=>{
    if(req.session.admin){
        let id = req.query.id;
        let order = await orderSchema.find({_id:ObjectId(id)})
        console.log(order);
        res.render("invoice",{order})
    }else{
        res.redirect("/admin/login")
    }
}