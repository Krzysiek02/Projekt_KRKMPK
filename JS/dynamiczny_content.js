// Dynamicly rendering whether user isn't logged 
function renderUnauthorized() {
    const contentContainer = document.querySelector('.div_content_container');
    const contentContainerPlatnosci = document.querySelector('.div_content_container_platnosci');
    const isPolish = get_language();
    language_validation(isPolish);


    if (contentContainer && isPolish) {
        contentContainer.innerHTML = `
        <div id="unauthorized-section">
            <h2>Brak dostępu!</h2>
        </div>
    `;
    } else if (contentContainerPlatnosci && isPolish) {
        contentContainerPlatnosci.innerHTML = `
        <div id="unauthorized-section">
            <h2>Brak dostępu!</h2>
        </div>`
        ;
    } else if (contentContainer && !isPolish) {
        contentContainer.innerHTML = `
        <div id="unauthorized-section">
            <h2>No access!</h2>
        </div>
    `;
    } else if (contentContainerPlatnosci && !isPolish) {
        contentContainerPlatnosci.innerHTML = `
        <div id="unauthorized-section">
            <h2>No access!</h2>
        </div>`
        ;
    }
};

// Dynamicly rendering whether user is logged 
function updateContentLogin() {
    const loggedInUser = users.find(user => user.is_logged_in);
    const isPolish = get_language();
    language_validation(isPolish);
    if (loggedInUser) {
        renderAuthorized(loggedInUser);
    } else {
        renderUnauthorized();
    }
}

// Dynamicly rendering whether there are tickets in backet
function updateContentBacket() {
    const loggedInUser = users.find(user => user.is_logged_in);
    const currentBasket = getCurrentBasket();
    const isPolish = get_language();
    language_validation(isPolish);
    if (currentBasket.length > 0) {
        if (loggedInUser) {
            renderAuthorized(loggedInUser);
        }
        else {
            renderUnauthorizedWithTickets();
        }
    } else {
        renderUnauthorized();
    }
}

function updateContent() {
    const isPolish = get_language();
    language_validation(isPolish);
    if (isPolish) {
        renderContentPolish();
        renderPolish();
    } else {
        renderContentEnglish();
        renderEnglish();
    }
}

function renderPolish() {
    const navigationLinks = document.querySelector(".nav_links");

    if (navigationLinks) {
        navigationLinks.innerHTML = `
            <a href="./inteligentny_zakup_biletu.html">Inteligentny zakup biletu</a>
            <a href="./szybki_zakup_biletu.html">Szybki zakup biletu</a>
            <a href="./mapy_schematy.html">Mapy i schematy Krakowa</a>
            <a href="./rozklad_jazdy.html">Rozkład jazdy</a>
        `;
    }

    const loggingDiv = document.querySelector('.logging');

    if (loggingDiv) {
        loggingDiv.innerHTML = `
            <button data-target="../HTML/rejestracja.html">Zarejestruj się</button>
            <button data-target="../HTML/logowanie.html">Zaloguj się</button>
        `;
    }

    const footerSocial = document.querySelector(".social");

    if (footerSocial) {
        footerSocial.innerHTML = `
            <a href="./polityka_prywatnosci.html">Polityka prywatności</a>
            <a href="./skontaktuj_sie_z_nami.html">Skontaktuj się z nami</a>
            <a href="https://x.com/?lang=pl&mx=2" class="icons" target="_blank"><img src="../IMAGES/twitter.png" alt="X" class="flag_uk" /></a>
            <a href="https://www.instagram.com/" class="icons" target="_blank"><img src="../IMAGES/instagram.png" alt="Instagram" class="flag_uk" /></a>
            <a href="https://www.facebook.com/" class="icons" target="_blank" target="_blank"><img src="../IMAGES/facebook.png" alt="Facebook" class="flag_uk" /></a>
        `;
    }

    const navigationButtons = document.querySelectorAll('[data-target]');

    if (navigationButtons) {
        navigationButtons.forEach(button => {
            button.addEventListener('click', handleNavigation);
        });
    }
}

function renderEnglish() {
    const navigationLinks = document.querySelector(".nav_links");

    if (navigationLinks) {
        navigationLinks.innerHTML = `
            <a href="./inteligentny_zakup_biletu.html">Smart ticket purchase</a>
            <a href="./szybki_zakup_biletu.html">Quick ticket purchase</a>
            <a href="./mapy_schematy.html">Maps and diagrams of Krakow</a>
            <a href="./rozklad_jazdy.html">Schedule</a>
        `;
    }

    const loggingDiv = document.querySelector('.logging');

    if (loggingDiv) {
        loggingDiv.innerHTML = `
            <button class="registration" data-target="../HTML/rejestracja.html" >Sign up</button>
            <button class="login" data-target="../HTML/logowanie.html">Log in</button>
        `;
    }

    const footerSocial = document.querySelector(".social");

    if (footerSocial) {
        footerSocial.innerHTML = `
            <a href="./polityka_prywatnosci.html">Privacy Policy</a>
            <a href="./skontaktuj_sie_z_nami.html">Contact us</a>
            <a href="https://x.com/?lang=pl&mx=2" class="icons" target="_blank"><img src="../IMAGES/twitter.png" alt="X" class="flag_uk" /></a>
            <a href="https://www.instagram.com/" class="icons" target="_blank"><img src="../IMAGES/instagram.png" alt="Instagram" class="flag_uk" /></a>
            <a href="https://www.facebook.com/" class="icons" target="_blank" target="_blank"><img src="../IMAGES/facebook.png" alt="Facebook" class="flag_uk" /></a>
        `;
    }

    const navigationButtons = document.querySelectorAll('[data-target]');

    if (navigationButtons) {
        navigationButtons.forEach(button => {
            button.addEventListener('click', handleNavigation);
        });
    }
}