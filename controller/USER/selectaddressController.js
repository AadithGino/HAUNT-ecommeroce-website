exports.selectaddressget = async (req,res) =>{
    if(req.session.user){

        res.render("selectaddress")

    }else{
        res.redirect("/login")
    }
}