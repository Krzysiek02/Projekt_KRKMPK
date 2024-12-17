// Dynamicly rendering logged user with tickets
function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <h3>Dziękujemy za dokonanie płatności!</h3>
            <p>Twoje bilety zostały zakupione. Wybierz, czy chcesz je dodać do swojej teczki, czy bezpośrednio aktywować:</p>
            <div class="div_buttons">
                <button id="addToFolderButton">Dodaj do teczki</button>
                <button id="downloadButton">Pobierz</button>
            </div>
            
        `;

        const addToFolderButton = document.getElementById('addToFolderButton');
        const downloadButton = document.getElementById('downloadButton');

        if (addToFolderButton) {
            addToFolderButton.addEventListener('click', () => {
                alert("Bilety zostały dodane do teczki.");
            });
        }

        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                alert("Bilety zostały pobrane.");
            });
        }

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
            <h3>Dziękujemy za dokonanie płatności!</h3>
            <p>Twoje bilety zostały zakupione.</p>
            <button id="downloadButton">Pobierz</button>
        `;

        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                alert("Bilety zostały pobrane.");
            });
        }

        const navigationButtons = document.querySelectorAll('[data-target]');
        if (navigationButtons) {
            navigationButtons.forEach(button => {
                button.addEventListener('click', handleNavigation);
            });
        }
    }
}

// Add dynamicly loading content of the page
document.addEventListener('DOMContentLoaded', updateContentBacket);