"use strict" 

document.addEventListener("DOMContentLoaded", function(){
    let newProduct;
  

    let addBtn = document.querySelector("#add-product");

    addBtn.addEventListener("click", function(){
        
         newProduct = {
            name: document.querySelector("#add-name").value,
            productId: parseInt(document.querySelector("#add-id").value),
            image: document.querySelector("#add-photo-url").value,
            description: document.querySelector("#add-description").value,
            availableStock: parseInt(document.querySelector("#add-stock").value),
            price: parseInt(document.querySelector("#add-price").value),
            productEnabled: document.querySelector('input[name="product-status"]:checked').value
        }

        function sendProduct () {
            var xhr = new XMLHttpRequest;
            var url = 'https://furniture-inc-8fa2a.firebaseio.com/' + newProduct.productId + '.json';
            xhr.open("PUT", url, true); 
            xhr.setRequestHeader("Content-Type", "application/json");
            var sendData = JSON.stringify(newProduct);
            xhr.send(sendData);
            console.log(sendData);
        }
        
        sendProduct();
   });

   let deleteBtn = document.getElementById('delete-product');
   deleteBtn.addEventListener("click", function(){
       document.getElementById("add-name").value = "";
       document.querySelector("#add-id").value = "";
       document.getElementById("add-photo-url").value = "";
       document.getElementById("add-description").value = "";
       document.getElementById("add-stock").value = "";
       document.getElementById("add-price").value = "";
       document.querySelector('input[name="product-status"]:checked').value = "";
   });
});

