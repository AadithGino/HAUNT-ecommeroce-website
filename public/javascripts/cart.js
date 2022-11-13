
function cartremove(id){
    swal({title: "Are you sure?",
          text: "Are You Sure To Remove This Product From This Cart",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                
                window.location = "/removeitem?id="+id
            } else {
                
            }
        });
}





function increaseValue(button,id,limit,price) {
           console.log(parseInt(limit)+"this is the limit");
            console.log(price);
            const numberInput = button.parentElement.querySelector('.number');
            var value = parseInt(numberInput.innerHTML, 10);
            if(isNaN(value)) value = 0;
            if(limit && value >= limit){
                swal({text:"Only "+ limit+ " Left In Stock",
                dangerMode: true,
                icon: "warning",});
            }
            if(limit && value >= limit) return;
            numberInput.innerHTML = value+1;
            let totalproductprice = document.getElementById(id).innerHTML;
           let totalproductprice1 = parseFloat(totalproductprice);
           console.log(totalproductprice+"quan tot pric");
            let totalprice = document.getElementById("totalprice").innerHTML
          let total  = parseFloat(totalprice)
            console.log(total);
            let fprice = total + parseFloat(price);
            let pfprice = totalproductprice1+parseFloat(price);
            document.getElementById("totalprice").innerHTML = fprice;
            document.getElementById(id).innerHTML = pfprice
            $.ajax({
             url:"/quantityincrease?id="+id,
    method:"get",
    
   })
}


    function decreaseValue(button,id,price) {
    const numberInput = button.parentElement.querySelector('.number');
    var value = parseInt(numberInput.innerHTML, 10);
    if(isNaN(value)) value = 0;  
    if(value < 2) return;
    let totalprice = document.getElementById("totalprice").innerHTML
    let total  = parseInt(totalprice)
    console.log(total);
    let totalproductprice = document.getElementById(id).innerHTML;
    let totalproductprice1 = parseInt(totalproductprice);
    let pfprice = totalproductprice1-parseFloat(price);
            
            document.getElementById(id).innerHTML = pfprice
    console.log(totalproductprice+"quan tot pric");
    let fprice = total - price;
    
    document.getElementById("totalprice").innerHTML = fprice
    numberInput.innerHTML = value-1;
    $.ajax({
    url:"/quantitydecrease?id="+id,
    method:"get",
   })
    }


    
    $(function() {
        $(document).on("click", ".paira-cart-page-update", function(p) {
            p.preventDefault();
            var url = $(this).attr('href')+$('.paira-cart-quantity-'+$(this).attr('data-item-id')).val();
            window.location.href = url;
        });
    });


    
    $(function() {
        /***************************************************************************************
         * Mega Menu
         ***************************************************************************************/
        $(document).on('click', '.paira-mega-menu .paira-dropdown-menu', function(e) {
            e.stopPropagation();
        });
        $(document).on('click', '.paira-mega-menu .paira-angle-down', function(e) {
            e.preventDefault();
            $(this).parents('.paira-dropdown').find('.paira-dropdown-menu').toggleClass('active');
        });
    });
