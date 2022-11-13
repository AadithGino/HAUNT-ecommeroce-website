var express = require('express');
var router = express.Router();
const homeController = require("../../controller/USER/homeController")
const usershopcontroller = require("../../controller/USER/usershopcontroller")
const usercartcontroller = require("../../controller/USER/usercartcontroller")
const userprofilecontroller = require("../../controller/USER/userprofilecontroller")
const userlogincontroller = require("../../controller/USER/userlogincontroller") 
const usersignupcontroller = require("../../controller/USER/usersignupcontroller")
const userotpcontroller = require("../../controller/USER/userotplogincontroller")
const usersingleproductcontroller = require("../../controller/USER/usersingleproductcontroller")
const usersearchcontroller = require("../../controller/USER/usersearchcontroller")
const usercategorycontroller = require("../../controller/USER/usercategorycontroller")
const userCheckoutController = require("../../controller/USER/userCheckoutController")
const userwhishlist = require("../../controller/USER/userWhishListController");
const useraddresscontroller = require("../../controller/USER/useraddressController")
const userplaceordercontroller = require("../../controller/USER/userplaceorderController")
const userpaymentcontroller = require("../../controller/USER/paymentcontroller")
const userviewordercontroller = require("../../controller/USER/vieworderController")
const userbuycontroller = require("../../controller/USER/userbuycontroller")
const userbuyselectaddress = require("../../controller/USER/buynowselectaddress")
const userwalletController = require("../../controller/USER/walletController")
const userinvoice = require("../../controller/USER/userinvoiceController")
const payagaincontroller = require("../../controller/USER/payagaincontroller")
const { Router } = require('express');
const { TaskRouterGrant } = require('twilio/lib/jwt/AccessToken');


/* GET home page. */
router.get("/",homeController.homeGet);

// User Shop 

router.get("/usershop",usershopcontroller.shopGet)

// User Cart 

router.get("/usercart",usercartcontroller.cartGet)

// add to cart 

router.get("/addtocart",usercartcontroller.addToCartPost)

// quantity increase

router.get("/quantityincrease",usercartcontroller.increaseqty)

// quantity decrease

router.get("/quantitydecrease",usercartcontroller.decreaseqty)

// remove item from cart 

router.get("/removeitem",usercartcontroller.removeitem)

// checkout page 

router.get("/proceedtocheckout",userCheckoutController.checkoutGet)

// buy now 

router.get("/buynow",userbuycontroller.buynowGet)

// user profile

router.get("/userprofile",userprofilecontroller.profileGet)

// user address 

router.get("/useraddress",useraddresscontroller.addressGet)

// user add address 

router.post("/addaddress",useraddresscontroller.addaddress)

//user login page render

router.get("/login",userlogincontroller.loginGet)

//user login post 

router.post("/login",userlogincontroller.loginpost)

// user signup get

router.get("/signup",usersignupcontroller.signupGet)

// user signup post 

router.post("/signup",usersignupcontroller.signupPost)

//  otp login 

router.get("/otplogin",userotpcontroller.otploginGet)

// otp login number post 

router.post("/otplogin",userotpcontroller.otploginpost)

// otp verify 

router.get("/otpverify",userotpcontroller.otpverifyGet)

// otp verify post 

router.post("/otpverify",userotpcontroller.otpverifyPost)

// single product view

router.get("/singleproduct",usersingleproductcontroller.singleproductGet)

// user logout 

router.get("/logout",userlogincontroller.LogoutGet)

// search input  

router.post("/usersearch",usersearchcontroller.searchGet)


// search display 

router.get("/searchdisplay",usersearchcontroller.searchdisplayGet)


// add to whishlist 

router.get("/addtowhishlist",userwhishlist.addToWhishlist)

// whishlist

router.get("/whishlist",userwhishlist.whishlistGet)


// category vise display 

router.get("/categoryviseview",usercategorycontroller.categoryGet)


// remove from whish list 

router.get("/removefavourites",userwhishlist.removeitem)

// place order 
 
router.post("/placeorder",userplaceordercontroller.placeOlder)

// payment 

router.get("/payment",userpaymentcontroller.paymentGet)

// select address 

router.get("/selectaddress",userCheckoutController.selectaddressGet)

// select address post 
 
router.post("/selectaddress",userCheckoutController.selectaddressPost)

// buy now select address 

router.get("/buy-select-address",userbuyselectaddress.selectaddress)

// buy now select addres post 

router.post("/buynowselectaddress",userbuycontroller.selectaddresspost)

// place order post 

router.post("/buyplaceorder",userbuycontroller.buyplaceorder)

// buy now checkout 

router.get("/buynowselectpayment",userbuycontroller.checkout)

// order success 

router.get("/ordersuccess",userplaceordercontroller.orderSuccess)

// all orders 
 
router.get("/allorder",userviewordercontroller.vieworderGet)

// delete address 

router.get("/deleteaddress",useraddresscontroller.deleteaddress)

// select paymnet 
 
router.get("/selectpayment",userplaceordercontroller.selectpaymnetGet) 

// cancel order 

router.get("/cancelorder",userviewordercontroller.cancelOrder) 

// add new 

router.post("/addnewaddress",useraddresscontroller.addnewaddress)

// order view all products 

router.get("/viewallproducts",userviewordercontroller.vieworderproducts)

// razor pay promise 

router.get("/razorpay-return",userplaceordercontroller.Razorpayorder)

// veify razor pay payment 

router.post("/verifypayment", userplaceordercontroller.verifypayment)

// verify razor paymentt 

router.get("/verify-razorpaycart",userplaceordercontroller.paymentCheckingGEt)

// razor pay buy now 

router.get("/buynow-razor",userbuycontroller.buynowrazorpay)

// buy niw verify payment 

router.get("/buynowverifypayment",userbuycontroller.buynowverifypay)

// Edit address 

router.get("/edit-address",(useraddresscontroller.editaddress))

// edit address post 

router.post("/edit-address",useraddresscontroller.editaddresspost)

// paypal post 

router.post("/paypal-post",userplaceordercontroller.paypalpost)

// paypal success 

router.get("/success",userplaceordercontroller.payaplsuccess)

// select payment 1 

router.get("/payment-select-1",userplaceordercontroller.selectpay12)

// change password 

router.get("/change-password",userprofilecontroller.changepasswordGet)

// change passwod post 

router.post("/changepassword",userprofilecontroller.changepasswordpost)

// edit userprofile 

router.get("/edituserprofile",userprofilecontroller.edituserprofileGET)

// edit userprofile post 

router.post("/edituserprofile",userprofilecontroller.edituserprofilePost)

// PAYPAL 

router.get("/paypal",userplaceordercontroller.payaplget)

// payapal order cancel 

router.get("/cancel",userplaceordercontroller.paypalfailed)

// wallet 

router.get("/wallet",userwalletController.walletGet)

// User invoice controller 

router.get("/invoice",userinvoice.InvoiceGet)

// apply coupon 

router.post("/apply-coupon",userplaceordercontroller.applycouponpost)

// Return Order 

router.get("/return-order",userviewordercontroller.returnOrder)

// wallet histor 

router.get("/wallet-history",userwalletController.walletHistory)

// single product cancel 

router.get("/product-cancel",userviewordercontroller.produtCancel)

// pay again 

router.get("/payagain",payagaincontroller.payagain)

// payagain post

router.post("/payagainpost",payagaincontroller.payagainPost)

//payagain razorpay

router.get("/payagainrazorpay",payagaincontroller.Razorpayorder)

// payagain razorpay verify 

router.get("/verify-payagainrazorpay",payagaincontroller.verifypayment)

// payagain paypal post

router.get("/paypalpayagain-post",payagaincontroller.paypalpost)

// add money to wallet 

router.post("/add-to-wallet",userwalletController.addmoenytoWallet)

// paypal get add to wallet 

router.get("/paypaladdmoney",userwalletController.paypalGet)

// add money to wallet paypal post 

router.post("/add-money-paypal-post",userwalletController.paypalpost)

// add money to wallet paypal success post 

router.get("/addmoneysuccess",userwalletController.payaplsuccess)

// remove coupon 

router.get("/remove-coupon",userplaceordercontroller.removeCoupon)




module.exports = router;