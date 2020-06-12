"use strict";

function requestXHR(requestData) {
  let xhr = new XMLHttpRequest();

  xhr.open(requestData.method, requestData.url);

  xhr.onload = function() {
    if (requestData.callbackFunction !== null) {
      requestData.callbackFunction(xhr.responseText);
    }
  };

  xhr.onerror = function() {
    console.log("Sorry, we could not find what you were looking for.");
  };

  xhr.send(requestData.data);
}

//se obtine ID-ul de produs din URL
let productId;

function getProductId() {
  let query = window.location.search.substring(1);
  let queryResult = query.split("=");
  productId = parseInt(queryResult[1]);
  return productId;
}

//sunt declarate variabilele folosite la crearea clonelor de produs
let productList = [];
let currencyName = "RON";
let productsDiv = document.querySelector("#products");
let productTemplate = document.querySelector("#product-template");

//functia creaza sablonul in care vor fi aduse informatii despre fiecare produs
function addProduct(name, price, currency, imageUrl, description, productId) {
  let newProduct = productTemplate.cloneNode(true);
  newProduct.classList.remove("hidden");

  newProduct.querySelector(".product-link").textContent = name;
  newProduct.querySelector(".product-link").href += productId;
  newProduct.querySelector(".view-product").href += productId;
  newProduct.querySelector("img").src = imageUrl;
  newProduct.querySelector(".price").textContent = price;
  newProduct.querySelector(".currency").textContent = currency;
  newProduct.querySelector(".product-description").textContent = description;
  productsDiv.appendChild(newProduct);
}

//afiseaza  un mesaj de eroare daca inputurile din formularele din sectiunea de admin nu sunt valide
function displayError() {
  let preventMessage = document.querySelector("#prevent-submit");
  preventMessage.classList.remove("hidden");
  let interval = setInterval(removeError, 3000);

  function removeError() {
    preventMessage.classList.add("hidden");
    clearInterval(interval);
  }
}

//se afiseaza notificarea de adaugare a produsului timp de 3 secunde
function addConfirmationFct() {
  let addConfirmation = document.querySelector("#add-confirmation");
  addConfirmation.style.display = "block";
  let interval = setInterval(removeNotification, 3000);
  //notificarea este inlaturata
  function removeNotification() {
    addConfirmation.style.display = "none";
    clearInterval(interval);
  }
}

//confirmarea de editare este afisata la click pe buton
function editConfirmationFct() {
  let deleteConfirmation = document.getElementById("edit-confirmation");
  deleteConfirmation.style.display = "block";
  let interval = setInterval(removeNotification, 3000);

  function removeNotification() {
    deleteConfirmation.style.display = "none";
    clearInterval(interval);
  }
}

//functie care afiseaza o notificare pe ecran la stergerea produsului, si o inlatura dupa 3 secunde
function deleteConfirmationFct() {
  let deleteConfirmation = document.querySelector("#delete-confirmation");
  deleteConfirmation.style.display = "block";
  let interval = setInterval(removeNotification, 3000);
  //notificarea este inlaturata
  function removeNotification() {
    deleteConfirmation.style.display = "none";
    clearInterval(interval);
  }
}
