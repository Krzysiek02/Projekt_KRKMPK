// Website language support
document.addEventListener("DOMContentLoaded", () => {
    const languageChangeButton = document.querySelector(".language_change");

    if (localStorage.getItem("language") === null) {
        localStorage.setItem("language", "true");
    }

    const updateLanguageIcon = () => {
        const isEnglish = localStorage.getItem("language") === "true";
        const imagePath = isEnglish ? "../IMAGES/flaga_UK.png" : "../IMAGES/flaga_PL.png";
        languageChangeButton.innerHTML = `<img src="${imagePath}" alt="Flag Icon" class="flag_uk"/>`;
    };

    languageChangeButton.addEventListener("click", () => {
        const isEnglish = localStorage.getItem("language") === "true";
        localStorage.setItem("language", (!isEnglish).toString());
        location.reload();
    });

    updateLanguageIcon();
    validation();
});

function validation() {
    const isEnglish = localStorage.getItem("language") === "true";
    if (isEnglish) {
        console.log('Aktualny język strony: Angielski');
    } else {
        console.log('Aktualny język strony: Polski');
    }
    
}
