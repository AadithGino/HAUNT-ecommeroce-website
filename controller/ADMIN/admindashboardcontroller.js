const { order } = require("paypal-rest-sdk")
const orderSchema = require("../../models/orderSchema")
const userSchema = require("../../models/userSchema")
const productSchema = require("../../models/productschema")
const moment = require("moment")
const { $where } = require("../../models/orderSchema")

exports.dashboardGet = async (req,res)=>{
    if(req.session.admin){
     try {
      let totalrevenue=0;
      let numberoforder = await orderSchema.find({})
      let numberofuser = await userSchema.find({})
      let numberofproduct = await productSchema.find({})
      for(var i=0 ; i<numberoforder.length;i++){
        if(numberoforder[i].payment!="Pending"&&numberoforder[i].status==="Delivered"&&numberoforder[i].payment!="Cancelled"){
        totalrevenue = numberoforder[i].totalprice+totalrevenue
        }
      }
      let numberofCOD = await orderSchema.find({payment:"COD"})
      let numberofRazorPay = await orderSchema.find({payment:"RazorPay"})
      let numberofPayPal = await orderSchema.find({payment:"PayPal"})
      let numbercancelledorders = await orderSchema.find({status:"Cancelled"})
      numberofCOD = numberofCOD.length;
      numberofRazorPay = numberofRazorPay.length;
      numberofPayPal = numberofPayPal.length;
      numbercancelledorders = numbercancelledorders.length;

      let codtotalrevenue=0;
      let payapaltotalrevenue=0;
      let razorpaytotalrevenue=0;
      let dailytotalrevenue=0;
      let weeklytotalrevenue=0;
      for(var i=0 ; i<numberoforder.length;i++){
        if(numberoforder[i].payment ==="COD"&& numberoforder[i].status==="Delivered"){
        codtotalrevenue = numberoforder[i].totalprice+codtotalrevenue
        }
      }

      for(var i=0 ; i<numberoforder.length;i++){
        if(numberoforder[i].payment=== "PayPal" &&numberoforder[i].status==="Delivered"){
        payapaltotalrevenue = numberoforder[i].totalprice+payapaltotalrevenue
        }
      }

      for(var i=0 ; i<numberoforder.length;i++){
        if(numberoforder[i].payment=== "RazorPay" && numberoforder[i].status==="Delivered"){
          razorpaytotalrevenue = numberoforder[i].totalprice+razorpaytotalrevenue
        }
      }

      let todaydate = moment().format('L')
      
      for(var i=0 ; i<numberoforder.length;i++){
        if(numberoforder[i].payment!="Pending"&&numberoforder[i].date===todaydate && numberoforder[i].status==="Delivered" ){
          dailytotalrevenue = dailytotalrevenue+numberoforder[i].totalprice
        }
      }

      console.log(dailytotalrevenue);

      

      let today = new Date()
		let end = moment(today).format('L')
		let weekstart=moment(end).subtract(7,'days').format('L')
		let thisyeardate =   moment().format("L").split('/')[2];
    
      let weeklyorder = await orderSchema.find({date:{$gte:weekstart,$lte:end}})
      for(var i=0 ; i< weeklyorder.length;i++){
          if( weeklyorder[i].payment!="Pending"&&weeklyorder[i].status==="Delivered"&& weeklyorder[i].date.split('/')[2]==thisyeardate){
            console.log(weeklyorder[i].totalprice+"hehe");
            weeklytotalrevenue = weeklytotalrevenue+weeklyorder[i].totalprice
          }
        }
      
      

      

      
        res.render("admindashboard",{todaydate,weeklyorder,dailytotalrevenue,weeklytotalrevenue,numberoforder,numberofuser,numberofproduct,totalrevenue,numberofCOD,numberofPayPal,numberofRazorPay,codtotalrevenue,payapaltotalrevenue,razorpaytotalrevenue,numbercancelledorders})
     } catch (error) {
      
     }
      }else{
        res.redirect("/admin/login")
      }
}
