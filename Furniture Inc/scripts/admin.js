"use strict";
window.addEventListener("DOMContentLoaded", function () {

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
    productList.forEach(function (item) {
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

  //este chemata functia requestXHR, sunt incarcate obiectele din firebase prin callback si sunt adaugate la arrayul productList
  function loadProductList(populatePageFunction) {
    var request = {
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

function displayNotificationAdded() {
  let checkadded = sessionStorage.getItem('added');
  if (checkadded === 'true'){
    addConfirmationFct();
  }
  sessionStorage.removeItem("added");
} 
displayNotificationAdded();


function displayNotificationEdited() {
  let checkEdited = sessionStorage.getItem("edited");
  if (checkEdited === 'true'){
    editConfirmationFct();
  }
  sessionStorage.removeItem("edited");
}

displayNotificationEdited();

function displayNotificationDeleted (){
  let checkDeleted = sessionStorage.getItem("deleted");
  if (checkDeleted === 'true') {
    deleteConfirmationFct();
  }
  sessionStorage.removeItem("deleted");
}
displayNotificationDeleted ()
});



