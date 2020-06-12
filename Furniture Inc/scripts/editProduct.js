"use strict"

document.addEventListener("DOMContentLoaded", function () {
    //este definit formularul de produs de editat
    let currentEdit = document.querySelector("#product-real");
    //sunt asociate detaliile de produs cu fieldurile in care vor fi afisate 
    function addProdtoEdit(name, image, description, availableStock, price, productId, productStatus) {
        currentEdit.querySelector("#product-name").textContent = name;
        currentEdit.querySelector("#srcPhoto").src = image;
        currentEdit.querySelector("#product-description").textContent = description;
        currentEdit.querySelector("#product-stock").textContent = availableStock;
        currentEdit.querySelector("#product-price").textContent = price;
        currentEdit.querySelector("#prod-id").textContent = productId;
        currentEdit.querySelector('input[name="product-status"]').value = productStatus;

        /*sunt afisate in textinput valorile deja existente in baza de date pentru a usura experienta utilizatorului
         in cazul in care doreste sa aduca doar modificari minore produsului */
        currentEdit.querySelector("#new-name").value = currentEdit.querySelector("#product-name").textContent;
        currentEdit.querySelector("#new-photo").value = currentEdit.querySelector("#srcPhoto").src;
        currentEdit.querySelector("#new-description").value = currentEdit.querySelector("#product-description").textContent;
        currentEdit.querySelector("#new-stock").value = currentEdit.querySelector("#product-stock").textContent;
        currentEdit.querySelector("#new-price").value = currentEdit.querySelector("#product-price").textContent;
        currentEdit.querySelector('input[name="product-status"]:checked').value = productStatus;
    }

    let saveBtn = document.getElementById('save-changes');
    saveBtn.addEventListener("click", function () {
        checkInputsSubmit();
    });

    //este incarcat produsul de editat din Firebase in functie de ID, cu detaliile aferente 
    function loadProductToEdit() {
        productId = getProductId();
        let request = {
            url: "https://furniture-inc20.firebaseio.com/" + productId + ".json",
            method: "GET",
            callbackFunction: function (data) {
                let item = JSON.parse(data);
                if (item === null) {
                    productError();
                } else {
                    addProdtoEdit(item.name, item.image, item.description, item.availableStock, item.price, item.productId, item.productStatus)
                }
            },
            data: null
        };
        requestXHR(request);
    };
    loadProductToEdit();

    //daca a fost introdus un ID de produs invalid, div-ul care contine template-ul de produs este inlocuit cu un mesaj de eroare
    function productError() {
        let contentDiv = document.querySelector("#product-template");
        contentDiv.innerText = "This product is unavailable. Please check the URL and try again.";
    }

    // se trimite produsul editat in Firebase cu verbul PATCH
    function requestXhrPatch(callback) {
        let editedProduct = {
            name: document.getElementById("new-name").value,
            image: document.getElementById("new-photo").value,
            description: document.getElementById("new-description").value,
            availableStock: document.getElementById("new-stock").value,
            price: document.getElementById("new-price").value,
            productStatus: document.querySelector('input[name="product-status"]:checked').value
        };
        let postXHR = new XMLHttpRequest();
        let url = "https://furniture-inc20.firebaseio.com/" + productId + ".json";
        postXHR.open("PATCH", url, true);
        postXHR.setRequestHeader("Content-Type", "application/json");
        postXHR.send(JSON.stringify(editedProduct));

        // when done....
        postXHR.onload = function() {
            callback();
        }

    };

    let deleteBtn = document.querySelector('#delete-product');
    deleteBtn.addEventListener('click', function () {
        var deleteXHR = new XMLHttpRequest();
        deleteXHR.open("DELETE", "https://furniture-inc20.firebaseio.com/" + productId + ".json", true);
        deleteXHR.send(null);
        sessionStorage.setItem("deleted", "true");
        window.location.href = 'admin.html';
    });

    function setErrorTimeout(elem) {
        elem.classList.add("error");
        setTimeout(function () {
            elem.classList.remove('error');
        }, 3000);
    }

    /*functia verifica toate inputurile din formularul de editare produs, 
    in cazul in care nu sunt valide, o notificare este afisata si functia de opreste
    Altfel, produsul editat este trimis in Firebase, si o confirmare de stergere este afisata  */
    function checkInputsSubmit() {
        let newName = document.querySelector("#new-name");
        let newImg = document.querySelector("#new-photo");
        let newDescription = document.querySelector("#new-description");
        let newStock = document.querySelector("#new-stock");
        let newPrice = document.querySelector("#new-price");
        // let newStatus = document.querySelector('input[name = "product-status"]:checked');
        // let statusPar = document.querySelector("#status");
        if (newName.value === "") {
            displayError();
            setErrorTimeout(newName);
            return;
        }
        if (newImg.value === "") {
            displayError();
            setErrorTimeout(newImg);
            return;
        }
        if (newDescription.value === "") {
            displayError();
            setErrorTimeout(newDescription);
            return;
        }
        if (isNaN(parseInt(newStock.value))) {
            displayError();
            setErrorTimeout(newStock);
            return;
        }
        if (isNaN(parseInt(newPrice.value))) {
            setErrorTimeout(newPrice);
            displayError();
            return;
        } else {
            requestXhrPatch(function() {
                sessionStorage.setItem("edited", "true");
                // utilizatorul este trimis pe pagina principala de admin
                window.location.href = 'admin.html';
            });
        }
    }

});