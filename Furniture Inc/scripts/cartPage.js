"use strict";
document.addEventListener("DOMContentLoaded", function() {
  //instantiez cosul din local storage si alte variabile pentru manipularea DOMului

  let cart = [];
  let totalRON = 0;
  let totalNumberProducts = 0;

  function loadCart() {
    if (localStorage.getItem("cartItems")) {
      cart = JSON.parse(localStorage.getItem("cartItems"));
    }
    console.log(cart);
  }

  loadCart();

  for (let cartProduct of cart) {
    if (cartProduct !== null) {
      loadProduct(cartProduct.prodId, cartProduct.qty);
      totalNumberProducts = totalNumberProducts + parseFloat(cartProduct.qty);
      document.querySelector("#number-items").innerText = totalNumberProducts;
    }
  }

  function loadProduct(prodId, qty) {
    requestXHR({
      url: "https://furniture-inc20.firebaseio.com/" + prodId + ".json",
      method: "GET",
      callbackFunction: function(data) {
        var item = JSON.parse(data);
        createProductClone(
          item.name,
          item.price,
          qty,
          item.productId,
          item.qty
        );
      },
      data: null
    });
  }
  let amounts = document.getElementById("amounts");
  let emptyBag = document.getElementById("empty-bag");
  //daca nu exista nimic in cos, o informare este afisata in acest sens
  if (cart === null || cart === undefined || cart.length === 0) {
    emptyBag.classList.remove("hidden");
  } else {
    amounts.classList.remove("hidden");
  }
  //daca exista cel putin un produs in cos, sunt definite variabile pentru a construi clonele
  let template = document.querySelector("#cart-product-template");
  let parentTemplate = document.querySelector("#items");
  template.id = "";

  function createProductClone(prodId, name, price, qty) {
    let cartProductTemplate = template.cloneNode(true);
    cartProductTemplate.classList.remove("hidden");
    cartProductTemplate.querySelector("#product-id").textContent = prodId;
    cartProductTemplate.querySelector("#product-name").textContent = name;
    cartProductTemplate.querySelector("#db-price").textContent = price;
    cartProductTemplate.querySelector("#count").textContent = qty;

    totalRON = totalRON + parseFloat(qty * price);
    document.querySelector("#checkout-total").innerText = totalRON;
    return cartProductTemplate;
  }

  //este creata o clona pentru fiecare produs din array-ul de obiecte cartItems
  for (let cartProduct of cart) {
    parentTemplate.appendChild(
      createProductClone(
        cartProduct.productName,
        cartProduct.prodId,
        cartProduct.productPrice,
        cartProduct.qty
      )
    );
  }

  let generatedTemplates = document.querySelectorAll(".cart-product");
  generatedTemplates.forEach(function(elem) {
    //pentru fiecare produs sunt definite variabilele cu care for fi calculate subtotalul, numarul de produse
    let generatedProductTemplate = elem;
    let subtotalProduct = generatedProductTemplate.querySelector(
      "#subtotal-product"
    );
    let count = generatedProductTemplate.querySelector("#count").innerText;
    let countEl = parseInt(count);
    let subtotal = generatedProductTemplate.querySelector("#subtotal");
    let dbPrice = parseInt(
      generatedProductTemplate.querySelector("#db-price").textContent
    );
    subtotalProduct.innerText = dbPrice * countEl;
    let plusButton = generatedProductTemplate.querySelector("#plus");
    /*la click pe butonul de plus din template, creste numarul de produse de acelasi fel cat si subtotalul in local storage
      si in sectiunea de Total Order */
    plusButton.addEventListener("click", function() {
      countEl++;
      generatedProductTemplate.querySelector("#count").innerText = countEl;
      if (countEl > 10) {
        //e restrictionata comanda la 10 produse de acelasi fel, o notificare este afisata
        countEl = 10;
        generatedProductTemplate.querySelector("#restriction").style.display =
          "block";
        return false;
      }
      //este calculat subtotalul si se afiseaza in template-ul de produs
      calculateSubtotal();
      subtotalProduct.innerText = subtotal;
      let prodId = parseInt(
        generatedProductTemplate.querySelector("#product-id").textContent
      );
      let qty = countEl;
      //sunt chemate functiile care actualizeaza cantitatea in plus si totalul comenzii
      setProductQuantityPlus(prodId, qty);
      calculateTotalOrder();
      calculateNumberOfProducts();
    });

    //este definita functia care creste cantitatea din local storage in functie de ID-ul produsului
    function setProductQuantityPlus(prodId, qty) {
      for (let cartProduct of cart) {
        if (cartProduct !== null) {
          if (cartProduct.prodId === prodId) {
            cartProduct.qty = qty;
          }
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(cart));
    }

    let minusButton = generatedProductTemplate.querySelector("#minus");
    /*similar cu functiile de la plusBtn dar sunt scazute cantitatile individuale, subtotal individual, cantitati generale 
    si suma totala a comenzii */
    minusButton.addEventListener("click", function() {
      if (countEl > 1) {
        countEl--;
        generatedProductTemplate.querySelector("#count").innerText = countEl;
        calculateSubtotal();
        subtotalProduct.innerText = subtotal;
        let prodId = parseInt(
          generatedProductTemplate.querySelector("#product-id").textContent
        );
        let qty = countEl;
        setProductQuantityMinus(prodId, qty);
        calculateTotalOrder();
        calculateNumberOfProducts();
      }
      if (count <= 10) {
        generatedProductTemplate.querySelector("#restriction").style.display =
          "none";
      }
    });

    function setProductQuantityMinus(prodId, qty) {
      for (let cartProduct of cart) {
        if (cartProduct !== null) {
          if (cartProduct.prodId === prodId) {
            cartProduct.qty = qty;
          }
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(cart));
    }

    function calculateSubtotal() {
      subtotal = countEl * dbPrice;
      return subtotal;
    }
    // sterge un produs din array-ul de produse din cart si din local storage in functie de ID-ul acestuia
    let removeBtn = generatedProductTemplate.querySelector("#remove-item");
    removeBtn.addEventListener("click", function() {
      let prodId = parseInt(
        generatedProductTemplate.querySelector("#product-id").textContent
      );
      removeProductFromStorage(prodId);
    });

    //am incercat doua abordari prima este ce am facut la un curs doar ca nu pare sa mearga, nu am inteles-o in orice caz

    // function removeProductFromStorage(prodId) {
    //   delete cart[prodId];
    //   localStorage.setItem('cartItems', JSON.stringify(cart));
    // }

    /* aceasta functie cauta ID-ul produsului in array si il daca gaseste ar trebui sa il stearga cu splice
    am incercat sa opresc loop-ul cu "break" dupa ce matchIndex = i insa nu se executa restul functiei,
    asa ca la mai mult de 3 produse in cos, la click pe un buton, sunt sterse 2 produse
    Apreciez explicatiile, as vrea sa inteleg */
    function removeProductFromStorage(prodId) {
      let matchIndex = -1;
      for (let cartProduct of cart) {
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].prodId === cartProduct.prodId) {
            matchIndex = i;
          } else {
            matchIndex = -1;
          }
          if (matchIndex !== -1) {
            cart.splice(matchIndex, 1);
            localStorage.cartItems = JSON.stringify(cart);
          }
          if (cart.length === 0) {
            var totalDiv = document.querySelector("#amounts");
            totalDiv.classList.add("hidden");
            emptyBag.classList.remove("hidden");
          }
          generatedProductTemplate.classList.add("hidden");
        }
      }
    }
  });

  //este calculata suma totala de plata in functie de pretul produsului si a cantitatii adaugate in cos
  function calculateTotalOrder() {
    let totalOrder = 0;
    if (cart === null) {
      emptyBag.classList.remove("hidden");
    } else {
      let checkoutTotal = document.querySelector("#checkout-total");
      for (let i = 0; i < cart.length; i++) {
        totalOrder = totalOrder + cart[i].qty * cart[i].productPrice;
      }
      checkoutTotal.innerText = totalOrder;
    }
  }
  calculateTotalOrder();

  //este calculat numarul total de produse comandate
  function calculateNumberOfProducts() {
    let noOfItems = 0;
    for (let i = 0; i < cart.length; i++) {
      noOfItems = noOfItems + cart[i].qty;
    }
    let checkoutNumbers = document.querySelector("#number-items");
    checkoutNumbers.innerText = noOfItems;
  }
  calculateNumberOfProducts();

  let checkoutBtn = document.querySelector("#checkout-btn");
  checkoutBtn.addEventListener("click", checkoutOrder);
  //la click pe butonul de checkout este sters array-ul cartItems din local storage si clientul este redirectionat catre pagina principala
  function checkoutOrder() {
    localStorage.removeItem("cartItems");
    window.location.href = "index.html";
  }
});
