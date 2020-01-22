"use strict";
window.addEventListener("DOMContentLoaded", function() {
  var productList = [];

  var currencyName = "RON";

  var productsDiv = document.querySelector("#products");

  var productTemplate = document.querySelector("#product-template");

  productTemplate.id = "";
  function addProduct(name, price, currency, imageUrl, description, productId) {
    var newProduct = productTemplate.cloneNode(true);
    newProduct.classList.remove("hidden");

    newProduct.querySelector(".product-link").textContent = name;
    newProduct.querySelector(".product-link").href += productId;
    newProduct.querySelector("img").src = imageUrl;
    newProduct.querySelector(".price").textContent = price;
    newProduct.querySelector(".currency").textContent = currency;
    newProduct.querySelector(".product-description").textContent = description;
    productsDiv.appendChild(newProduct);
  }


  function displayItems() {
    if (productList.length === 0) {
      loadProductList(populatePage);
    } else {
      populatePage();
    };
  };
  function populatePage() {
    productsDiv.innerHTML = "";
    productList.forEach(function(item) {
      if (item === null) {
        return;
      };
      addProduct(
        item.name,
        item.price,
        currencyName,
        item.image,
        item.description,
        item.productId
      );
    });
  };

  function loadProductList(populatePageFunction) {
    var request = {
      url: "https://furniture-inc-8fa2a.firebaseio.com/.json",
      method: "GET",
      callbackFunction: function(data) {
        var parsedString = JSON.parse(data);
        if (parsedString instanceof Array === true) {
          productList = parsedString;
        } else if (typeof parsedString === "object" && parsedString !== null) {
          for (let property in parsedString) {
            productList.push(parsedString[property]);
          };
        } else {
          console.warn("Warning: products could not be loaded!");
        };
        populatePageFunction();
      },
      data: null
    };

    requestXHR(request);
  };

  function requestXHR(requestData) {
    var xhr = new XMLHttpRequest();

    xhr.open(requestData.method, requestData.url);

    xhr.onload = function() {
      if (requestData.callbackFunction !== null) {
        requestData.callbackFunction(xhr.responseText);
      };
    };

    xhr.onerror = function() {
      console.log("Sorry, we could not find what you were looking for.");
    };

    xhr.send(null);
  };
  displayItems();


});


