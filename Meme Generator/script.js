"use strict";

document.addEventListener("DOMContentLoaded", function () {
    var upperText, lowerText, textInputSize, textFont, chosenFont, selectedFont, imageUpload, generateBtn, downloadBtn, img, canvas, ctx;

    function drawCanvas() {
        //Initialize variables
        upperText = document.getElementById("upper-text");
        lowerText = document.getElementById("lower-text");
        textInputSize = document.getElementById("text-size");
        imageUpload = document.getElementById("img-upload");
        generateBtn = document.getElementById("generate-btn");
        downloadBtn = document.getElementById("download-btn");
        textFont = document.getElementById("text-font");
        selectedFont = textFont.options[textFont.selectedIndex];
        canvas = document.getElementById("canvas-meme");
        ctx = canvas.getContext("2d");

        canvas.width = canvas.height = 0;

        textFont.addEventListener("change", function (event) {
            chosenFont = event.target.value;
        });

        // Generate meme on click event listener
        generateBtn.addEventListener("click", function () {
            // Read image as DataURL with the FileReader API
            let reader = new FileReader();
            reader.onload = function () {
                let img = new Image();
                img.src = reader.result;
                img.onload = function () {
                    generateMeme(img, upperText.value, lowerText.value, textInputSize.value, selectedFont.value);
                };
            };
            reader.readAsDataURL(imageUpload.files[0]);
        });
        //Download meme on click event listener
        downloadBtn.addEventListener("click", function () {
            img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            var link = document.createElement("a");
            link.download = "my-meme.png";
            link.href = img;
            link.click();
        });
    };

    drawCanvas();

    function generateMeme(img, upperText, lowerText, textInputSize, selectedFont) {
        // Adjust canvas to image
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw main image
        ctx.drawImage(img, 0, 0);

        var theInputColor = document.getElementById("font-color");
        var theColor = theInputColor.value;
        ctx.fillStyle = theColor;
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";
        var fontSize = canvas.width * textInputSize;
        //Font Family Pacifico loads to canvas after click twice on the Generate Meme button
        ctx.font = fontSize + "px" + " " + chosenFont;
        ctx.lineWidth = fontSize / 20;

        // Draw top text
        ctx.textBaseline = "top";
        upperText.split("\n").forEach(function (text, index) {
            ctx.fillText(text, canvas.width / 2, index * fontSize, canvas.width);
            ctx.strokeText(text, canvas.width / 2, index * fontSize, canvas.width);
        });

        // Draw bottom text
        ctx.textBaseline = "bottom";
        // .reverse() because it's drawing the bottom text from the bottom up
        lowerText.split("\n").reverse().forEach(function (text, index) {
            ctx.fillText(text, canvas.width / 2, canvas.height - index * fontSize, canvas.width);
            ctx.strokeText(text, canvas.width / 2, canvas.height - index * fontSize, canvas.width);
            });
    };
});
