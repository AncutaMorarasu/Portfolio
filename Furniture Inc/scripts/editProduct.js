"use strict"

document.addEventListener("DOMContentLoaded", function () {
    var editedProduct;
    var singleProduct = document.querySelector("#product-real");
    var parentProduct = document.querySelector("#product-template");

    function addProdtoEdit(name, imgURL, description, stock, price, productId) {
        var currentEdit = singleProduct.cloneNode(true);
        currentEdit.querySelector("#product-name").textContent = name;
        currentEdit.querySelector("#srcPhoto").src = imgURL;
        currentEdit.querySelector("#product-description").textContent = description;
        currentEdit.querySelector("#product-stock").textContent = stock;
        currentEdit.querySelector("#product-price").textContent = price + " RON";
        currentEdit.querySelector("#prod-id").textContent = productId;
        parentProduct.appendChild(currentEdit);
        singleProduct.remove();

        var saveBtn = document.getElementById('save-changes');

        saveBtn.addEventListener("click", function () {
            editedProduct = {
                name: document.getElementById("new-name").value,
                imgUrl: document.getElementById("new-photo").value,
                description: document.getElementById("new-description").value,
                stock: document.getElementById("new-stock").value,
                price: document.getElementById("new-price").value,
                productEnabled: document.querySelector('input[name="product-status"]:checked').value
            }
            console.log(editedProduct);
            requestXhrPost();
        });
    };

    var productId;

    function getProductId() {
        var query = window.location.search.substring(1);
        var queryResult = query.split("=");
        productId = parseInt(queryResult[1]) - 1;
        return productId;
    }
    //getProductId();

    function loadProductToEdit() {
        productId = getProductId();
        var request = {
            url: "https://furniture-inc-8fa2a.firebaseio.com/" + productId + ".json",
            method: "GET",
            callbackFunction: function (data) {
                var item = JSON.parse(data);
                addProdtoEdit(item.name, item.image, item.description, item.availableStock, item.price, item.productId)
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
    loadProductToEdit();

    function requestXhrPost() {
        var postXHR = new XMLHttpRequest();
        var url = "https://furniture-inc-8fa2a.firebaseio.com/" + productId + ".json";
        postXHR.open("PATCH", url, true);
        postXHR.setRequestHeader("Content-Type", "application/json");
        postXHR.send(JSON.stringify(editedProduct));
    };

});