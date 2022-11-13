const user = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const categorySchema = require("../../models/categoryschema")
const cloudinary = require("../../cloudinary")
const categoryOfferSchema = require("../../models/categoryOfferSchema")
const upload = require('../../multer')
const fs = require("fs")

exports.addproductGet = async (req,res)=>{
    if(req.session.admin){
        let cat1 = await categorySchema.find()
        
      res.render("addproduct",{cat:cat1})
      }else{
        res.redirect("/admin")
      }
}


exports.addproductPost = async (req,res)=>{
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
    console.log(urls[0].url);
    let image1url = urls[0].url
    let image2url = urls[1].url
    console.log(image2url);
    // res.status(200).json({

    //   data:urls
    // })
    let obj;
    const categoryid = req.body.category;
    const categoryOffer = await categoryOfferSchema.findOne({categoryid:categoryid})
    if(categoryOffer){

      const categorypercentage = categoryOffer.percentage;
      const newcategoryprice = await (parseInt(categorypercentage)/100 * parseInt(req.body.price))
      obj = {
        itemname: req.body.itemname,
        description: req.body.description,
        brand : req.body.brand,
        category : req.body.category,
        categoryprice:newcategoryprice,
        price:req.body.price,
        image1: image1url,
        image2: image2url, 
        quantity : req.body.quantity,
        originalprice : req.body.originalprice
    }

    }else{
     obj = {
      itemname: req.body.itemname,
      description: req.body.description,
      brand : req.body.brand,
      category : req.body.category,
      categoryprice:req.body.originalprice,
      price:req.body.price,
      image1: image1url,
      image2: image2url, 
      quantity : req.body.quantity,
      originalprice : req.body.originalprice
  }
}
  productSchema.create(obj)

  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
  res.redirect("/admin/productdisplay")
}