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
    } else {
        renderContentEnglish();
    }
}