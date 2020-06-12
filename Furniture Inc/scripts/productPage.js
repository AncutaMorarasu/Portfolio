"use strict"
document.addEventListener("DOMContentLoaded", function () {

    //sunt asociate detaliile de produs cu fieldurile in care vor fi afisate 
    let currentProduct = document.querySelector("#single-product-template");

    function addProductToPage(name, imgURL, description, stock, price, productId) {
        currentProduct.querySelector("#product-name").textContent = name;
        currentProduct.querySelector("img").src = imgURL;
        currentProduct.querySelector("#product-details").textContent = description;
        currentProduct.querySelector("#available-stock").textContent = stock;
        currentProduct.querySelector("#price").textContent = price + " RON";
        currentProduct.querySelector("#prod-id").textContent = productId;
    };

    //este incarcat produsul din Firebase in functie de ID, cu detaliile aferente 
    function loadProduct() {
        productId = getProductId();
        let request = {
            url: "https://furniture-inc20.firebaseio.com/" + productId + ".json",
            method: "GET",
            callbackFunction: function (data) {
                let item = JSON.parse(data);
                if (item === null) {
                    productError();
                } else {
                    addProductToPage(item.name, item.image, item.description, item.availableStock, item.price, item.productId)
                }
            },
            data: null
        };
        requestXHR(request);
    };

    function productError() {
        let contentDiv = document.querySelector("#mainContent");
        contentDiv.innerText = "This product is unavailable. Please check the URL and try again.";
    }

    loadProduct();

    //la click pe add to cart este chemata functia care creeaza obiectul produs
    let cartBtn = document.getElementById("cart-button");
    cartBtn.addEventListener("click", addtoStorage);

    let cart = {};
    let quantity;

    //se adauga in local storage Id-ul si cantitatea de produs, daca numarul de produse este invalid, o alerta este afisata
    function addtoStorage() {
        quantity = parseInt(document.getElementById("quantity").value);
        cart.productId = productId;
        cart.quantity = quantity;
        if (quantity >= 1) {
            addToExistingStorage(cart);
        } else {
            let message = "You need to add at least one product to your cart."
            alert(message);
            return;
        }

    };

    //in cazul in care produsul a fost deja adaugat deja in localstorage, se updateaza cantitatea acestuia
    function addToExistingStorage(itemElement) {
        let cartItems;
        let localItem = false;
        let localCart = localStorage.getItem("cartItems");

        if (localCart === null) {
            cartItems = [];
        } else {
            cartItems = JSON.parse(localCart);
            //let localItem = false;
            for (let i = 0; i < cartItems.length; i++) {
                if (itemElement.productId === cartItems[i].productId) {
                    cartItems[i].quantity = itemElement.quantity;
                    localItem = true;
                };
            }
        };

        if (!localItem) {
            cartItems.push(itemElement);
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    };

})