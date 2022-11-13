const { ObjectID } = require("bson");
const orderSchema = require("../../models/orderSchema")




exports.orderPlaced = async(req,res)=>{
    const orderid = req.query.id;
    orderSchema.updateOne({_id:ObjectID(orderid)},{$set:{status:"placed"}},function(err){
        if(err){
            console.log(err);
        }
    })
    res.redirect("/admin/allorder")
}


exports.orderShipped = async(req,res)=>{
    const orderid = req.query.id;
    orderSchema.updateOne({_id:ObjectID(orderid)},{$set:{status:"Shipped"}},function(err){
        if(err){
            console.log(err);
        }
    })
    res.redirect("/admin/allorder")
}


exports.orderDelivered = async(req,res)=>{
    const orderid = req.query.id;
    console.log(orderid+"delivered");
    orderSchema.updateOne({_id:ObjectID(orderid)},{$set:{status:"Delivered"}},function(err){
        if(err){
            console.log(err);
        }
    })
    res.redirect("/admin/allorder")
}