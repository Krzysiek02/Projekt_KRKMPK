// Dynamicly rendering logged user with tickets
function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <h3>Dziękujemy za dokonanie płatności!</h3>
            <p>Twoje bilety zostały zakupione. Wybierz, czy chcesz je dodać do swojej teczki, czy bezpośrednio aktywować:</p>
            <div class="div_buttons">
                <button id="addToFolderButton" data-target="../HTML/moja_teczka.html">Dodaj do teczki</button>
                <button id="downloadButton" data-target="../HTML/inteligentny_zakup_biletu.html">Pobierz</button>
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
            <button id="downloadButton" data-target="../HTML/inteligentny_zakup_biletu.html">Pobierz</button>
        `;

        let currentBasket = getCurrentBasket();
        let qrContent = "";

        if (currentBasket.length > 0) {
            currentBasket.forEach(ticket => {
                qrContent += `Bilet: ${ticket.name}, Ilość: ${ticket.quantity}\n`;
                ticket.quantity = 0;
                ticket.sum_price = 0;
            });
            currentBasket = currentBasket.filter(ticket => ticket.quantity > 0);
            saveCurrentBasket(currentBasket);
        }

        console.log(qrContent);

        const qrContainer = document.createElement('div');
        qrContainer.style.display = 'none';
        document.body.appendChild(qrContainer);

        QRCode.toDataURL(qrContent, { width: 200, height: 200 }, (err, url) => {
            if (err) {
                console.error('Błąd generowania kodu QR:', err);
                return;
            }

            const qrImage = new Image();
            qrImage.src = url;
            qrContainer.appendChild(qrImage);

            const downloadButton = document.getElementById('downloadButton');
            if (downloadButton) {
                downloadButton.addEventListener('click', () => {
                    alert("Bilety zostały pobrane.");
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = "bilety_qr.png";
                    link.click();
                });
            }
        });

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