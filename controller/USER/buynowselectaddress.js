const addressSchema = require("../../models/addressSchema")
const {ObjectId} = require("mongodb")


exports.selectaddress = async(req,res)=>{
    let userid = req.session._id;
    if(req.session.user){
        let useraddress = await addressSchema.aggregate([
            {
              $match:{userid:ObjectId(userid)}
            },
    
            {
              $unwind : "$address" 
            },
            {
              $project:{
                firstname : "$address.firstname",
                lastname : "$address.lastname",
                company : "$address.company",
                address1 : "$address.address1",
                address2 : "$address.address2",
                city : "$address.city",
                country : "$address.country",
                zip : "$address.zip",
                phone : "$address.phone",
                sstatus :"$status"
              }
            }
          ])
    
    
    
          addressSchema.updateMany({
            userid: userid, 
            "address.status" : true
          },
          {
            $set: {
              "address.$.status" : false
            }
          }
          ).then((data) => {
            console.log(data);
          }).catch((err) => {
            console.log(err);
          })
          
            res.render("buynowselectaddress",{address:useraddress,username:req.session.user})
    
    }else{
        res.redirect("/login")
    }
}