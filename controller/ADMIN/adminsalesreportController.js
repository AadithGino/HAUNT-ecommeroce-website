const orderSchema = require("../../models/orderSchema")
const productSchema = require("../../models/productschema")

const moment = require("moment");
const router = require("../../routes/USER");


exports.salesreportGet = async(req,res)=>{
    if(req.session.admin){
      let totalrevenue=0;
      let numberoforder = await orderSchema.find({})
      let numberofproduct = await productSchema.find({})
      for(var i=0 ; i<numberoforder.length;i++){
        if(numberoforder[i].payment!="Pending"&&numberoforder[i].status==="placed"&&numberoforder[i].payment!="Cancelled"){
        totalrevenue = numberoforder[i].totalprice+totalrevenue
        }
      }

      let numberofCOD = await orderSchema.find({payment:"COD",status:"placed"})
      let numberofRazorPay = await orderSchema.find({payment:"RazorPay",status:"placed"})
      let numberofPayPal = await orderSchema.find({payment:"PayPal",status:"placed"})
      let numbercancelledorders = await orderSchema.find({status:"Cancelled"})
      numberofCOD = numberofCOD.length;
      numberofRazorPay = numberofRazorPay.length;
      numberofPayPal = numberofPayPal.length;
      numbercancelledorders = numbercancelledorders.length;

      
      let weeklytotalrevenue=0;
      let yearlyrevenue=0;
      
      
    let today = new Date()
		let end = moment(today).format('L')
		let weekstart=moment(end).subtract(7,'days').format('L')
    
    
    



    let thisyeardate =   moment().format("L").split('/')[2];
    console.log(thisyeardate);

    let thisyearorders=[];
    for(var i =0 ; i < numberoforder.length;i++){
      if(numberoforder[i].date.split('/')[2]==thisyeardate){
        console.log(numberoforder[i].date);
        thisyearorders.push(numberoforder[i])
      }
    }
    



		

    let weeklyorder1=[]
      let weeklyorder = await orderSchema.find({date:{$gte:weekstart,$lte:end}})
      for(var i = 0 ; i < weeklyorder.length ; i++){
        if(weeklyorder[i].date.split('/')[2]===thisyeardate){
          weeklyorder1.push(weeklyorder[i])
        }
      }

      console.log(weeklyorder1);
      for(var i=0 ; i< weeklyorder1.length;i++){

          if(weeklyorder1[i].payment!="Pending"&&weeklyorder1[i].status==="Delivered" ){
            weeklytotalrevenue = weeklytotalrevenue+weeklyorder1[i].totalprice
          }
      }


        res.render("salesreport",{weeklyorder:weeklyorder1,weeklytotalrevenue})
    }else{
        res.redirect("/admin/login")
    }
}



exports.monthlyorder = async(req,res)=>{
  if(req.session.admin){
    let thisyeardate =   moment().format("L").split('/')[2];
    let today = new Date()
    let monthlyrevenue=0;
    let end = moment(today).format('L')
    let monthstart = moment(end).subtract(30,'days').format('L')
    
    let monthlyorder = await orderSchema.find({date:{$gte:monthstart,$lte:end}},{})

      let monthlyorder1=[];
      for(var i =0 ; i<monthlyorder.length;i++){
        if(monthlyorder[i].date.split('/')[2]===thisyeardate){
          monthlyorder1.push(monthlyorder[i])
        }
      }


      for(var i=0 ; i< monthlyorder1.length;i++){
        if(monthlyorder1[i].payment!="Pending"&&monthlyorder1[i].status==="Delivered" ){
          monthlyrevenue = monthlyrevenue+monthlyorder1[i].totalprice
        }
    }
    res.render("monthlyreport",{monthlyorder:monthlyorder1,monthlyrevenue})
  }else{
    res.redirect("/admin/login")
  }
}


exports.yearlyreportGet = async(req,res)=>{
  if(req.session.admin){
    let numberoforder = await orderSchema.find({})
    let thisyeardate =   moment().format("L").split('/')[2];
    console.log(thisyeardate);

    let thisyearorders=[];
    for(var i =0 ; i < numberoforder.length;i++){
      if(numberoforder[i].date.split('/')[2]==thisyeardate){
        console.log(numberoforder[i].date);
        thisyearorders.push(numberoforder[i])
      }
    }
    let thisyearrevenue=0;
    for(var i=0 ; i< thisyearorders.length;i++){
      if(thisyearorders[i].payment!="Pending"&&thisyearorders[i].status==="Delivered" ){
        thisyearrevenue = thisyearrevenue+thisyearorders[i].totalprice
      }
  }

    res.render("yearlyorder",{monthlyorder:thisyearorders,monthlyrevenue:thisyearrevenue,thisyeardate})
  }else{
    res.redirect("/admin/login")
  }
}