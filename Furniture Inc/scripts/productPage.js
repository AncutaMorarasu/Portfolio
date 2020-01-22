"use strict"

document.addEventListener("DOMContentLoaded", function () {
    var singleProduct = document.querySelector("#single-product-template");
    var parentProduct = document.querySelector("#parent-product");


    function addProductToPage(name, imgURL, description, stock, price, productId) {
        var currentProduct = singleProduct.cloneNode(true);
        currentProduct.querySelector("#product-name").textContent = name;
        currentProduct.querySelector("img").src = imgURL;
        currentProduct.querySelector("#product-details").textContent = description;
        currentProduct.querySelector("#available-stock").textContent = stock;
        currentProduct.querySelector("#price").textContent = price + " RON";
        currentProduct.querySelector("#prod-id").textContent = productId;
        parentProduct.appendChild(currentProduct);
        singleProduct.remove();
    };

    var productId;

    function getProductId() {
        var query = window.location.search.substring(1);
        var queryResult = query.split("=");
        productId = parseInt(queryResult[1]);
        return productId;
    }
    getProductId();
    console.log(productId);

    function loadProduct() {
        productId = getProductId();
        var request = {
            url: "https://furniture-inc-8fa2a.firebaseio.com/" + productId + ".json",
            method: "GET",
            callbackFunction: function (data) {
                var item = JSON.parse(data);
                addProductToPage(item.name, item.image, item.description, item.availableStock, item.price, item.productId)
            },
            data: null
        };
        requestXHR(request);
    };

    function requestXHR(requestData) {
        var xhr = new XMLHttpRequest();

        xhr.open(requestData.method, requestData.url, true);

        xhr.onload = function () {
            if (requestData.callbackFunction !== null) {
                requestData.callbackFunction(xhr.responseText);
            };
        };

        xhr.onerror = function () {
            console.log("Sorry, we could not find what you were looking for.");
        };

        xhr.send(null);
    };
    loadProduct();
});