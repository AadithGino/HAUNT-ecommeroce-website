const productSchema = require("../../models/productschema")
let productoffererrmsg="12";

exports.displayproductOffer = async(req,res)=>{
    if(req.session.admin){
        const product = await productSchema.find({})
        res.render("productOffer.ejs",{coupon:product,productoffererrmsg})
        productoffererrmsg="12";
    }else{
        res.redirect("/admin")
    }
}

exports.updateproductOffer = async(req,res)=>{
    if(req.session.admin){
        const product = req.body.product;
        const offerprice = req.body.price;
       const products = await productSchema.findOne({_id:product})
       if(products.price <= offerprice){
        productoffererrmsg="Offer Price Cannot Be Greater Than Or Equal To Regular Price"
       }else{
        productSchema.updateOne({_id:product},{$set:{originalprice:offerprice}},function(err){
            if(err){
                console.log(err);
            }
        })
       }
        console.log(product);
        res.redirect("/admin/display-productOffer")
    }else{
        res.redirect("/admin/login")
    }
}