const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const user = require("../../models/userSchema")
const cloudinary = require("../../cloudinary")
const upload = require('../../multer')
const fs = require("fs")
const { array } = require("../../multer")
const { json } = require("express")


exports.allproductGet = async (req,res)=>{
    if(req.session.admin){
      let page =1 ;
      if(req.query.page){
        page = req.query.page;
      }
        let productdetails = await productSchema.find({}).limit(5).skip((page - 1) * 5)
        const count12 = await productSchema.count()
        console.log(productdetails.itemname+"00000000000000000");
        res.render("allproductdisplay",{value:productdetails,totalPages: Math.ceil(count12  / 5),
        previous: page - 1})
      }else{
        res.redirect("/admin/login")
      }
}

exports.deleteproductGet = (req,res)=>{
  const productid = req.query.id;
  productSchema.deleteOne({_id:productid},(err)=>{
    console.log(err);
  })
    res.redirect("/admin/productdisplay")
}


exports.editproductGet = async (req,res)=>{
    if(req.session.admin){
        let productid = req.query.id;
        console.log("productid"+productid);
        let cat1 = await categorySchema.find({})
        let value1 = await productSchema.findOne({_id:productid})
        console.log(value1);
        res.render("updateproduct",{cat:cat1,value:value1})
      }else{
        res.redirect("/admin/login")
      }
}


exports.editproductPost = async (req,res)=>{
    const id = req.body._id;
 
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  if (req.method === 'POST') {
    const urls = []
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }
    
console.log(urls.length);
    if(urls.length){
     image1url = urls[0].url
     image2url = urls[1].url
    
  
    // res.status(200).json({

    //   data:urls
    // })

      var obj = {
    itemname: req.body.itemname,
    description: req.body.description, 
    brand : req.body.brand,
    category : req.body.category,
    price:req.body.price,
    quantity : req.body.quantity,
    category : req.body.category,
    categoryprice:req.body.price,
    originalprice : req.body.originalprice,
    image1: image1url,
    image2: image2url
}

console.log(obj);
productSchema.findByIdAndUpdate(id, obj, { useFindAndModify: false })
  .then((data) => {
    if (!data) {
      console.log("not updated");
      console.log(data);
    } else {
        res.redirect("/admin/productdisplay")
    }
  })
  .catch((err) => {
    console.log(err);
  })
}else{
  productSchema.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
  .then((data) => {
    if (!data) {
      console.log("not updated");
      console.log(data);
    } else {
        res.redirect("/admin/productdisplay")
    }
  })
}
  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
  

}
 
