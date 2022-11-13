var express = require('express');
var router = express.Router();
const addcategorycontroller = require("../../controller/ADMIN/adminaddcategorycontroller")
const addproductcontroller = require("../../controller/ADMIN/adminaddproductcontrroller")
const admindashboardcontroller = require("../../controller/ADMIN/admindashboardcontroller")
const adminproductdisplaycontroller = require("../../controller/ADMIN/adminproductdisplaycontroller")
const admincategorydisplaycontroller = require("../../controller/ADMIN/admincategorycontroller");
const adminuserdisplaycontroller = require("../../controller/ADMIN/adminuserdisplaycontroller");
const adminlogincontroller = require("../../controller/ADMIN/adminlogincontroller");
const adminordercontroller = require("../../controller/ADMIN/adminorderdisplay")
const admincouponController = require("../../controller/ADMIN/couponController")
const adminsalesreport = require("../../controller/ADMIN/adminsalesreportController")
const invoiceController = require("../../controller/ADMIN/invoiceController")
const changeStatusController = require("../../controller/ADMIN/updateOrderController")
const categoryOfferController = require("../../controller/ADMIN/adminOfferController")
const productOfferController = require("../../controller/ADMIN/productOfferController")

const cloudinary = require("../../cloudinary")
const upload = require('../../multer')
// const fs = require("fs")
// const productSchema = require("../../models/productschema")


const { route } = require('../USER');

// admin login 

router.get("/login",adminlogincontroller.adminloginGET)

// admin login post 

router.post("/login",(adminlogincontroller.adminLoginPost))

// admin dashboard 

router.get("/",admindashboardcontroller.dashboardGet)

 // add category

router.get("/addcategory",addcategorycontroller.categoryGet)

// add category post 

router.post("/addcategory",admincategorydisplaycontroller.categoryPost)

// add product 

router.get("/addproduct",addproductcontroller.addproductGet)

// add product post 

router.post("/addproduct",upload.array("image"),addproductcontroller.addproductPost)

// all product display get 

router.get("/productdisplay",adminproductdisplaycontroller.allproductGet)

// edit product  get

router.get("/editproduct",adminproductdisplaycontroller.editproductGet)

// edit product post 

router.post("/editproduct",upload.array("image"),adminproductdisplaycontroller.editproductPost)

// delete product 

router.get("/deleteproduct",adminproductdisplaycontroller.deleteproductGet)

// all category display 

router.get("/displaycategory",admincategorydisplaycontroller.categorydisplayGet)

// delete category 

router.get("/deletecategory",admincategorydisplaycontroller.deletecategory)

// all user display 

router.get("/userdisplay",adminuserdisplaycontroller.userdisplayGet)

// single user display 

router.get("/singleuser",adminuserdisplaycontroller.singleuserGet)  

// block user  

router.get("/blockuser",adminuserdisplaycontroller.blockuserGet)

//unblock user 

router.get("/unblockuser",adminuserdisplaycontroller.unblockuserGet)

// admin logout 

router.get("/adminlogout",adminlogincontroller.adminlogout)

// all order display 

router.get("/allorder",adminordercontroller.allorderdisplayGet)

// cancel order

router.get("/cancelorder",adminordercontroller.cancelOrder)

// order product display 

router.get("/orderproduct",adminordercontroller.vieworderproducts)

// add coupon 

router.get("/displaycoupon",admincouponController.displayCouponGet)

// add coupon post 

router.post("/addcoupon",admincouponController.addCouponPost)

// sales report 

router.get("/sales-report",adminsalesreport.salesreportGet)

// Invoice  

router.get("/invoice",invoiceController.InvoiceGet)

// monthly report

router.get("/monthly-report",adminsalesreport.monthlyorder)

// yearly report 

router.get("/year-report",adminsalesreport.yearlyreportGet)

// delete coupom 

router.get("/delete-coupon",admincouponController.deleteCoupon)

// Placing Order 

router.get("/change-placed",changeStatusController.orderPlaced)

// Shipping Order 

router.get("/change-shipped",changeStatusController.orderShipped)

// Delivered Order 

router.get("/change-delivered",changeStatusController.orderDelivered)

// Display Category Offer 

router.get("/categoryOffer",categoryOfferController.categoryOfferGet)

// add categoryOffer 

router.post("/add-categoryOffer",categoryOfferController.addCategoryOffer)

// delete category offer 

router.get("/delete-categoryOffer",categoryOfferController.deleteCategoryOffer)

// product offer 

router.get("/display-productOffer",productOfferController.displayproductOffer)

// add product offer price 

router.post("/update-productofferprice",productOfferController.updateproductOffer)



module.exports = router;
