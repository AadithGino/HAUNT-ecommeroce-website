const { raw } = require("express");
const couponSchema = require("../../models/couponSchema")

exports.displayCouponGet = async(req,res)=>{
    if(req.session.admin){
        const coupon = await couponSchema.find()
        console.log(coupon);
        res.render("displayCoupon",{coupon})
    }else{
        res.redirect("/admin/login")
    }
}

exports.addCouponPost = async(req,res)=>{
    let coupon = req.body.coupon;
    let price = req.body.price;
    let limit = req.body.limit;
    const minprice = req.body.minprice;
    console.log(coupon);
    console.log(limit);
    const couponobj = {
        coupon,
        price,
        minprice,
        limit
    }

    couponSchema.create(couponobj)
    res.redirect("/admin/displaycoupon")
}


exports.deleteCoupon = async(req,res)=>{
    let id = req.query.id;
    couponSchema.deleteOne({_id:id},function(err){
        if(err){
            console.log(err);
        }
    })

    res.redirect("/admin/displaycoupon")
}