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

        let currentBasket = getCurrentBasket();
        let qrContent = "";

        if (currentBasket.length > 0) {
            const now = new Date();
            const purchaseDate = now.toLocaleDateString('pl-PL');
            const purchaseHistory = currentBasket.map(ticket => {
                qrContent += `Bilet: ${ticket.name}, Ilość: ${ticket.quantity}, Cena: ${ticket.sum_price}, Data zakupu: ${purchaseDate}\n`;
                return {
                    ...ticket,
                    purchase_date: purchaseDate
                };
            });
            saveCurrentHistory(purchaseHistory);
        }

        const qrContainer = document.createElement('div');
        qrContainer.style.display = 'none';
        document.body.appendChild(qrContainer);

        QRCode.toDataURL(qrContent, { width: 200, height: 200 }, (err, url) => {
            if (err) {
                console.error('Błąd generowania kodu QR:', err);
                return;
            }

            console.log(qrContent);

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
                    const now = new Date();
                    const activationDate = now.toLocaleDateString('pl-PL');
                    const activationTime = now.toLocaleTimeString('pl-PL');
                    const myActiveFile = currentBasket.map(ticket => {
                        return {
                            ...ticket,
                            activation_date: activationDate,
                            activation_time: activationTime,
                        };
                    });
                    saveCurrentActiveFile(myActiveFile);
                });
            }
        });

        const addToFolderButton = document.getElementById('addToFolderButton');
        if (addToFolderButton) {
            addToFolderButton.addEventListener('click', () => {
                alert("Bilety zostały dodane do teczki.");
                const myNotActiveFile = currentBasket.map(ticket => {
                    return {
                        ...ticket,
                        activation_date: null,
                        activation_time: null,
                    };
                });
                saveCurrentNotActiveFile(myNotActiveFile);
            });
        }

        const navigationButtons = document.querySelectorAll('[data-target]');
        if (navigationButtons) {
            navigationButtons.forEach(button => {
                button.addEventListener('click', handleNavigation);
            });
        }
    }

    currentBasket = [];
    saveCurrentBasket(currentBasket);
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
        const now = new Date();
        const purchaseDate = now.toLocaleDateString('pl-PL');

        if (currentBasket.length > 0) {
            currentBasket.forEach(ticket => {
                qrContent += `Bilet: ${ticket.name}, Ilość: ${ticket.quantity}, Cena: ${ticket.sum_price}, Data zakupu: ${purchaseDate}\n`;
                ticket.quantity = 0;
                ticket.sum_price = 0;
            });
            currentBasket = currentBasket.filter(ticket => ticket.quantity > 0);
            saveCurrentBasket(currentBasket);
        }

        const qrContainer = document.createElement('div');
        qrContainer.style.display = 'none';
        document.body.appendChild(qrContainer);

        QRCode.toDataURL(qrContent, { width: 200, height: 200 }, (err, url) => {
            if (err) {
                console.error('Błąd generowania kodu QR:', err);
                return;
            }

            console.log(qrContent);

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