// Dynamicly rendering whether user isn't logged 
function renderUnauthorized() {
    const contentContainer = document.querySelector('.div_content_container');
    const contentContainerPlatnosci = document.querySelector('.div_content_container_platnosci');
    if (contentContainer) {
        contentContainer.innerHTML = `
        <div id="unauthorized-section">
            <h2>Brak dostępu!</h2>
        </div>
    `;
    } else if (contentContainerPlatnosci) {
        contentContainerPlatnosci.innerHTML = `
        <div id="unauthorized-section">
            <h2>Brak dostępu!</h2>
        </div>`
        ;
    }
};

// Dynamicly rendering whether user is logged 
function updateContentLogin() {
    const loggedInUser = users.find(user => user.is_logged_in);
    const currentBasket = getCurrentBasket();
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