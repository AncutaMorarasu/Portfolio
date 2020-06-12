"use strict"

document.addEventListener("DOMContentLoaded", function () {

    //la click pe butonul de adaugare este chemata functia checkInputs()
    let addBtn = document.querySelector("#add-product");
    addBtn.addEventListener("click", function () {
        checkInputs();
    });

    //se trimite noul produs prin verbul PUT in baza de date
    function sendProduct() {
        // produsul nou care va avea proprietati identice cu cele ale produselor deja existente in Firebase
        let newProduct = {
            name: document.querySelector("#add-name").value,
            productId: parseInt(document.querySelector("#add-id").value),
            image: document.querySelector("#add-photo-url").value,
            description: document.querySelector("#add-description").value,
            availableStock: parseInt(document.querySelector("#add-stock").value),
            price: parseInt(document.querySelector("#add-price").value),
            productStatus: document.querySelector('input[name="product-status"]:checked').value
        };
        let xhr = new XMLHttpRequest;
        let url = 'https://furniture-inc20.firebaseio.com/' + newProduct.productId + '.json';
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        let sendData = JSON.stringify(newProduct);
        xhr.send(sendData);
    }
    //la click pe butonul Clear sunt sterse valorile din inputuri pentru a lasa utilizatorul sa adauge inca un produs daca doreste
    let clearBtn = document.getElementById('clear-inputs');
    clearBtn.addEventListener("click", function () {
        document.getElementById("add-name").value = "";
        document.querySelector("#add-id").value = "";
        document.getElementById("add-photo-url").value = "";
        document.getElementById("add-description").value = "";
        document.getElementById("add-stock").value = "";
        document.getElementById("add-price").value = "";
        document.querySelector('input[name="product-status"]:checked').value = "";
    });

    //adauga o bordura rosie in jurul inputului invalid
    function setErrorTimeout (elem) {
        elem.classList.add("error");
        setTimeout(function () {
            elem.classList.remove('error');
        }, 3000);
    }
    //verifica daca toate inputurile au fost completate, daca da, produsul este trimis in vaza de date, daca nu, o notificare este afisata in acest sens
    function checkInputs() {
        let addName = document.querySelector("#add-name");
        let addId = document.querySelector("#add-id");
        let addImg = document.querySelector("#add-photo-url");
        let addDescription = document.querySelector("#add-description");
        let addStock = document.querySelector("#add-stock");
        let addPrice = document.querySelector("#add-price");
        let addStatus = document.querySelector('input[name = "product-status"]:checked');
        let statusPar = document.querySelector("#status");
        if (addName.value === "") {
            displayError();
            setErrorTimeout(addName);
            return;
        }
        if (isNaN(parseInt(addId.value))) {
            displayError();
            setErrorTimeout(addId);
            return;
        }
        if (addImg.value === "") {
            displayError();
            setErrorTimeout(addImg);
            return;
        }
        if (addDescription.value === "") {
            displayError();
            setErrorTimeout(addDescription);
            return;
        }
        if (isNaN(parseInt(addStock.value))) {
            displayError();
            setErrorTimeout(addStock);
            return;
        }
        if (isNaN(parseInt(addPrice.value))) {
            displayError();
            setErrorTimeout(addPrice);
            return;
        }
        if (addStatus === null) {
            displayError();
            setErrorTimeout(statusPar);
            return;
        } else {
            sendProduct();
            sessionStorage.setItem("added", "true");
            window.location.href = 'admin.html';
        }
    }

});
