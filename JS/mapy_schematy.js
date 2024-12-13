document.addEventListener('DOMContentLoaded', function () {
    function showImage(src) {
        var popup = document.getElementById("image-popup");
        var img = document.getElementById("popup-img");
        img.src = src;
        popup.style.display = "block";
    }

    function closeImage() {
        var popup = document.getElementById("image-popup");
        popup.style.display = "none";
    }

    // Dodanie funkcji do globalnego kontekstu
    window.showImage = showImage;
    window.closeImage = closeImage;
});
