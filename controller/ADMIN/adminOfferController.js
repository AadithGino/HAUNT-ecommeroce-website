const productSchema = require("../../models/productschema")
const categoryOfferSchema = require('../../models/categoryOfferSchema')
const categorySchema = require("../../models/categoryschema")
const { ObjectID } = require("bson")
const { find } = require("../../models/productschema")
let categoryoffererrmsg = "12";

exports.categoryOfferGet = async(req,res)=>{
    if(req.session.admin){ 
   try {
     const category = await categorySchema.find({})      
    const coupon = await categoryOfferSchema.find({})
    res.render("categoryOffer",{coupon,category,categoryoffererrmsg})
    categoryoffererrmsg="12";
   } catch (error) {
    
   }
    }else{
        res.redirect("/admin/login")
    }

}

exports.addCategoryOffer= async(req,res)=>{
   try {
    const coupon = req.body.coupon;

    const categoryofferexist = await categoryOfferSchema.findOne({categoryid:coupon})

    if(categoryofferexist){
        categoryoffererrmsg = "Category Offer Already Exist Delete The Existing One Before Adding";
    }else{


    const percentage = req.body.price;
    let categoryname = await categorySchema.findOne({_id:ObjectID(coupon)})
    categoryname = categoryname.category;
    
    
    const couponobj = {
        categoryid : coupon,
        categoryname,
        percentage,
    }

    categoryOfferSchema.create(couponobj)
    

    const products = await productSchema.find({})
    for(let i =0 ;i < products.length ; i++){
       if(products[i].category==coupon){
        let productprice =  products[i].price
        let discountprice = await (parseInt(percentage)/100 * parseInt(productprice))
        console.log(discountprice);
        productprice = parseInt(productprice)-discountprice;  
        console.log(productprice);
        productSchema.updateOne({_id:products[i]._id},{$set:{categoryprice:productprice}},function(err){
            if(err){
                console.log(err);
            }
        })
        console.log(productprice);
       }
    }
}
    
    res.redirect("/admin/categoryOffer")
   } catch (error) {
    
   }
    
}


exports.deleteCategoryOffer = async(req,res)=>{
    const categoryOfferid = req.query.id;
    let categoryid = await categoryOfferSchema.findOne({_id:categoryOfferid})
    categoryid = categoryid.categoryid

    
    const products = await productSchema.find({})
    for(let i =0 ;i < products.length ; i++){
       if(products[i].category==categoryid){
        let productprice =  products[i].originalprice
        productSchema.updateOne({_id:products[i]._id},{$set:{categoryprice:productprice}},function(err){
            if(err){
                console.log(err);
            }
        })
        console.log(productprice);
       }
    }
    
    categoryOfferSchema.deleteOne({_id:categoryOfferid},function(err){
        if(err){
            console.log(err);
        }
    })
    

    res.redirect("/admin/categoryOffer")
}