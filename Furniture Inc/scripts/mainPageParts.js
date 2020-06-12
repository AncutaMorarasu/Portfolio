"use strict"
document.addEventListener("DOMContentLoaded", function () {

    //XMLHttp request pentru a incarca dinamic headerul si footerul

    function requestXHR(url, method, callbackFunction) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            callbackFunction(xhr.responseText);
        };
        xhr.onerror = function () {
            console.log("Sorry, we could't find what you're looking for.");
        };
        xhr.send();
    };

    //sunt aduse in div-urile cu ID-urile header si footer, datele din fisierele cu acelasi nume
    function addPages(targetItem, targetContent) {
        document.querySelector(targetItem).innerHTML = targetContent;
    };
    requestXHR("header.html", "GET", function (data) {
        addPages("#header", data);
    });
    requestXHR("footer.html", "GET", function (data) {
        addPages("#footer", data);
    });
});