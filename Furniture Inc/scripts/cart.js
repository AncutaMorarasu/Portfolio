"use strict";
window.addEventListener("DOMContentLoaded", function () {
  var currency = document.getElementById('currency').innerText;
  var subtotalProduct = document.getElementById('subtotal-product');
  var countEl = document.getElementById("count");
  var plusButton = document.getElementById("plus");
  var subtotal = document.getElementById('subtotal');
  var dbPrice = document.getElementById('db-price').innerText;
  var count = 1;

  if (count === 1) {
    subtotalProduct.innerHTML = dbPrice + ' ' + currency;
  }

  function itemsQuantity() {

    plusButton.addEventListener("click", function () {
      count++;
      countEl.innerText = count;
      if (count > 10) {
        count = 10;
        document.getElementById('restriction').style.display = 'block';
        return false;
        
      };
      calculateSubtotal();

      subtotalProduct.innerHTML = subtotal + ' ' + currency;

    });

    var minusButton = document.getElementById("minus");
    minusButton.addEventListener("click", function () {
      console.log(count);
      if (count > 1) {
        count--;
        countEl.innerText = count;
        calculateSubtotal();
        subtotalProduct.innerHTML = subtotal + ' ' + currency;
      };
      if (count <= 10) {
        document.getElementById('restriction').style.display = 'none';
      };
    });
  };
  itemsQuantity();


  function calculateSubtotal() {
    subtotal = count * dbPrice;
    return subtotal;
  };





  //   function requestXHR(requestData) {
  //     var xhr = new XMLHttpRequest();

  //     xhr.open(requestData.method, requestData.url);

  //     xhr.onload = function() {
  //       if (requestData.callbackFunction !== null) {
  //         requestData.callbackFunction(xhr.responseText);
  //       }
  //     };

  //     xhr.onerror = function() {
  //       alert("Sorry, we could not find what you were looking for.");
  //     };

  //     xhr.send(JSON.stringify(requestData.data));
  //   };

});
