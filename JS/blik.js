// Dynamicly rendering logged user with tickets
function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <h2>Płatność kartą</h2>
            <form id="payment-form">
                <div>
                    <label for="blik-number">Numer blik</label>
                    <input type="text" id="blik-number" value="" />
                </div>
                <button data-target="../HTML/dokonanie_platnosci.html" id="pay-button" disabled>Zapłać: ${calculateTotalPrice()} zł</button>
                <button data-target="../HTML/koszyk.html" type="button" id="cancel-button">Anuluj</button>
            </form>
        `;

        const form = document.getElementById('payment-form');

        form.addEventListener('input', function() {
            validateForm();
        });

        const navigationButtons = document.querySelectorAll('[data-target]');

        if (navigationButtons) {
            navigationButtons.forEach(button => {
                button.addEventListener('click', handleNavigation);
            });
        }
    }
}

// Dynamicly rendering unlogged user with tickets
function renderUnauthorizedWithTickets() {
    const contentContainer = document.querySelector('.div_content_container');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <h2>Płatność kartą</h2>
            <form id="payment-form">
                <div>
                    <label for="blik-number">Numer blik</label>
                    <input type="text" id="blik-number" value="" />
                </div>
                <button data-target="../HTML/dokonanie_platnosci.html" id="pay-button" disabled>Zapłać: ${calculateTotalPrice()} zł</button>
                <button data-target="../HTML/koszyk.html" type="button" id="cancel-button">Anuluj</button>
            </form>
        `;

        const form = document.getElementById('payment-form');

        form.addEventListener('input', function() {
            validateForm();
        });

        const navigationButtons = document.querySelectorAll('[data-target]');

        if (navigationButtons) {
            navigationButtons.forEach(button => {
                button.addEventListener('click', handleNavigation);
            });
        }
    }
}

function validateForm() {
    const blikNumber = document.getElementById('blik-number').value.trim();
    const payButton = document.getElementById('pay-button');

    const isBlikNumberValid = validateBlikNumber(blikNumber);

    if (isBlikNumberValid) {
        payButton.disabled = false;
    } else {
        payButton.disabled = true;
    }
}

function validateBlikNumber(blikNumber) {
    const cardPattern = /^\d{3} ?\d{3}$/;
    return cardPattern.test(blikNumber);
}

function calculateTotalPrice() {
    const currentBasket = getCurrentBasket();
    return currentBasket.reduce((total, ticket) => total + ticket.sum_price, 0);
}

// Add dynamicly loading content od the page
document.addEventListener('DOMContentLoaded', updateContentBacket);