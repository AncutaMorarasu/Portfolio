"use strict"
window.addEventListener("DOMContentLoaded", function () {

  // sunt definite tipurile de sortari ale produselor din pagina
  function sortItems(sortType) {
    if (productList.length === 0) {
      return;
    };
    if (sortType === "price-low") {
      productList.sort(function (item1, item2) {
        return item1.price - item2.price;
      });
    };
    if (sortType === "price-high") {
      productList.sort(function (item1, item2) {
        return item2.price - item1.price;
      });
    };

    if (sortType === "name-asc") {
      productList.sort(function (item1, item2) {
        return item1.name.toLowerCase().localeCompare(item2.name.toLowerCase());
      });
    };
    if (sortType === "name-desc") {
      productList.sort(function (item1, item2) {
        return item2.name
          .toLowerCase()
          .localeCompare(item1.name.toLowerCase());
      });
    };
    if (sortType === "initial-sort") {
      productList.sort(function (item1, item2) {
        return item1.productId - item2.productId;
      });
    };
  };

//sunt afisate produsele in functie de loadProductList
  function displayItems() {
    if (productList.length === 0) {
      loadProductList(populatePage);
    } else {
      populatePage();
    };
  };

  //fiecarui produs din product list ii sunt incarcate detaliile
  function populatePage() {
    productsDiv.innerHTML = "";
    let numberProducts = 1;
    productList.forEach(function (item) {
      if (item === null) {
        return;
      } else if (item.productStatus === "enabled") {
      addProduct(item.name, item.price, currencyName, item.image, item.description, item.productId);
      numberProducts += 1;
    }
    });
    let numberItems = document.querySelector("#numberItems");
    numberItems.innerHTML = numberProducts;
  };

//este chemata functia requestXHR, sunt incarcate obiectele din firebase prin callback si sunt adaugate la arrayul productList
  function loadProductList(populatePageFunction) {
    let request = {
      url: "https://furniture-inc20.firebaseio.com/.json",
      method: "GET",
      callbackFunction: function (data) {
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

  displayItems();


  //event listener pe dropdown selection, sunt sortate si afisate produsele in functie de valoarea selectiei
  document.getElementById("sort-items").addEventListener("change", function (event) {
    if (event.target.value === "price-low") {
      sortItems("price-low");
      displayItems();
    };
    if (event.target.value === "price-high") {
      sortItems("price-high");
      displayItems();
    };
    if (event.target.value === "name-asc") {
      sortItems("name-asc");
      displayItems();
    };
    if (event.target.value === "name-desc") {
      sortItems("name-desc");
      displayItems();
    };
    if (event.target.value === "initial-sort") {
      sortItems("initial-sort");
      displayItems();
    };
  });

});
