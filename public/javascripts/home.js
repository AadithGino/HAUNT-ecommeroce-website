
    function fav(id){
        console.log(id);
        console.log("addtoWhis");
        console.log("HEHEHEHEHE");
       
        $.ajax({
            url: '/addtowhishlist?id='+id,
            method:"get"
        })
        
        document.getElementById(id).style.backgroundColor = "#FF9800";
        let hehe = document.getElementById(id)
         let style = getComputedStyle(hehe)
       console.log(style.backgroundColor + "THIS IS THE BAGRUND COLOR HEHEHEHEHEH");
        
 
        
    }

                function add(id,user){
                    console.log(user);
                   
                    if(user === "login"){
            
                    console.log("sukanio");
                    console.log(id);
                    $.ajax({
                        url : '/addtocart?id='+id,
                        method : 'get',
                    })
                    let count = $('#mycart').html()
                    count = parseInt(count)+1
                    $("#mycart").html(count)
                    console.log(count+"is new count");
                    toastr.options.closeButton = true;
                    toastr.options.progressBar = true;
                    toastr.success("Product Added To Cart Successfully")
                    
                }else{
                    window.location = "/login"
                }
                }
            
            
                function remove(id){
                    console.log( document.getElementById(id).id.backgroundColor);
                    console.log(id);
                    console.log("remove");
                    $.ajax({
                        url: '/removefavourites?id='+id,
                        method:"get"
                    })
                    document.getElementById(id).id.backgroundColor = "white";

                }
                   
            