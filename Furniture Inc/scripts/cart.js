document.addEventListener("DOMContentLoaded", function () {
    /*instantiez variabilele care vor fi folosite in crearea template-ului de item in cos,
     cosul din localstorage si arrau-urile in care vor fi pastrate proprietatile de produs ce vor fi modificate in Firebase
     dupa plasarea comenzii */
    let totalRON = 0;
    let totalProductNo = 0;
    let template = document.querySelector("#cart-product-template");
    let parentTemplate = document.querySelector("#items");
    let checkoutBtn = document.querySelector("#checkout-btn");
    let cart = [];
    let productIdArr = [];
    let productNameArr = [];
    let productDescriptionArr = [];
    let availableStockarr = [];
    let productImgArr = [];
    let productPriceArr = [];
    let productStatusArr = [];
    let amounts = document.getElementById("amounts");
    let emptyBag = document.getElementById("empty-bag");

    //se aduce cosul din local storage
    function loadCart() {
        if (localStorage.getItem('cartItems')) {
            cart = JSON.parse(localStorage.getItem('cartItems'));
        }
    }
    loadCart();

    //daca nu exista nimic in cos, o informare este afisata in acest sens

    if (cart === null || cart === undefined || cart.length === 0) {
        emptyBag.classList.remove("hidden");
    } else {
        amounts.classList.remove("hidden");
    }
    /*sunt aduse detaliile de produs din Firebase prin "loadProductDetails" pentru fiecare produs existent in cos
     numara produsele din cos si este updatat numarul total de produse din cos */
    for (let cartProduct of cart) {
        if (cartProduct !== null) {
            loadProductDetails(cartProduct.productId, cartProduct.quantity);
            productIdArr.push(cartProduct.productId);
            totalProductNo = totalProductNo + parseFloat(cartProduct.quantity);
            document.querySelector("#number-items").innerText = totalProductNo;
        }
    }


    //este creata o clona de template de produs in cos
    function createProductClone(name, price, quantity, productId) {
        let cloneTemplate = template.cloneNode(true);
        cloneTemplate.classList.remove("hidden");
        cloneTemplate.querySelector("#db-price").innerText = price;
        cloneTemplate.querySelector("#product-name").innerText = name;
        cloneTemplate.querySelector("#product-id").innerText = productId;
        cloneTemplate.querySelector("#count").innerText = quantity;
        cloneTemplate.querySelector("#subtotal-product").innerText = quantity * price;


        /*la click pe butonul de plus sunt updatate cantitatea de produse din cos a unui anumit produs, subtotalul produsului
    precum si totalul general de numar de produse din comanda si totalul general in RON */
        cloneTemplate.querySelector("#plus").addEventListener("click", function () {
            quantity++;
            cloneTemplate.querySelector("#count").innerText = quantity;
            let subtotal = price * quantity;
            cloneTemplate.querySelector("#subtotal-product").innerText = subtotal;
            totalRON = totalRON + parseFloat(price);
            document.querySelector("#checkout-total").innerText = totalRON;
            totalProductNo++;
            document.querySelector("#number-items").innerText = totalProductNo;
            setProductQuantity(productId, quantity);
            loadCart();
        });

        //similar ca la click pe butonul plus dar in sens invers
        cloneTemplate.querySelector("#minus").addEventListener("click", function () {
           if (quantity > 1) {
            quantity--;
            cloneTemplate.querySelector("#count").innerText = quantity;
            let subtotal = price * quantity;
            cloneTemplate.querySelector("#subtotal-product").innerText = subtotal;
            totalRON = totalRON - parseFloat(price);
            document.querySelector("#checkout-total").innerText = totalRON;
            totalProductNo--;
            document.querySelector("#number-items").innerText = totalProductNo;
            setProductQuantity(productId, quantity);
            loadCart();
        } else {
            return;
        }
        });

        // este inlaturat un produs din cos si din local storage, sunt updatate numarul de produse si totalul general
        cloneTemplate.querySelector("#remove-item").addEventListener("click", function () {
            deleteProduct(productId);
            cloneTemplate.classList.add("hidden");

            totalRON = totalRON - price * quantity;
            document.querySelector("#checkout-total").innerText = totalRON;
            totalProductNo = totalProductNo - quantity;
            document.querySelector("#number-items").innerText = totalProductNo;
            loadCart();
        });


        //este calculat totalul general in RON si afisat in sumar comanda
        totalRON = totalRON + parseFloat(quantity * price);
        document.querySelector("#checkout-total").innerText = totalRON;

        parentTemplate.appendChild(cloneTemplate);
    }

    //este updatata cantitatea de produse si se salveaza in local storage
    function setProductQuantity(productId, quantity) {
        for (let cartProduct of cart) {
            if (cartProduct !== null) {
                if (cartProduct.productId === productId) {
                    cartProduct.quantity = quantity;
                }
            }
        }
        localStorage.setItem('cartItems', JSON.stringify(cart));
    }

    //sterge un produs din cos si updateaza local storage
    function deleteProduct(productId) {
        let matchIndex;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i] !== null) {
                if (cart[i].productId === productId) {
                    matchIndex = i;
                }
            }
        }
        cart.splice(matchIndex, 1);
        localStorage.setItem('cartItems', JSON.stringify(cart));
    }


    /*sunt aduse proprietatile de produs din Firebase pentru a fi afisate in clona de template
     detaliile sunt salvate in arrays pentru a trimite modificarile inapoi la checkout  */
    function loadProductDetails(productId, quantity) {
        let request = {
            url: "https://furniture-inc20.firebaseio.com/" + productId + ".json",
            method: "GET",
            callbackFunction: function (data) {
                let item = JSON.parse(data);
                createProductClone(item.name, item.price, quantity, item.productId, item.availableStock);
                productNameArr.push(item.name);
                productPriceArr.push(item.price);
                availableStockarr.push(item.availableStock);
                productImgArr.push(item.image);
                productDescriptionArr.push(item.description);
                productStatusArr.push(item.productStatus);
            },
            data: null
        };
        requestXHR(request);
    }

    //trimite in Firebase detaliile updatate ale produsului
    function changeProductDetails(productId, name, price, availableStock, productStatus, description, image) {
        let xhrPUT = new XMLHttpRequest;
        let url = "https://furniture-inc20.firebaseio.com/" + productId + ".json";
        let method = "PUT";
        let data = {
            "productId": productId,
            "name": name,
            "price": price,
            "availableStock": availableStock,
            "productStatus": productStatus,
            "description": description,
            "image": image
        }
        xhrPUT.open(method, url, true);
        xhrPUT.send(JSON.stringify(data));
    }


    //este updatata cantitatea de produse disponibile in stocul din Firebase si sunt trimise detaliile in baza de date
    function loadProductData(productId, quantity) {
        let index;
        for (let i = 0; i < productIdArr.length; i++) {
            if (productIdArr[i] === productId) {
                index = i;
            }
        }
        let availableStock = availableStockarr[index] - quantity;
        changeProductDetails(productId, productNameArr[index], productPriceArr[index], availableStock, productStatusArr[index], productDescriptionArr[index], productImgArr[index]);
    }

    //la click pe butonul de checkout este sters cosul din local storage si e afisat un mesaj
    checkoutBtn.addEventListener("click", function () {
        for (let cartProduct of cart) {
            if (cartProduct !== null) {
                loadProductData(cartProduct.productId, cartProduct.quantity);
            }
        }
        localStorage.removeItem('cartItems');
        emptyShoppingCart();
    });

    //este afisat mesajul de mai jos dupa trimiterea comenzii
    function emptyShoppingCart() {
        let contentDiv = document.querySelector("#wrapperCart");
        contentDiv.innerText = "We have received your order, go back to the home page to continue shopping.";

    }
});
