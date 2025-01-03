// Dynamicly rendering logged user with tickets
function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    const isPolish = get_language();
    if (contentContainer) {
        if (isPolish) {
            renderPolish();
            contentContainer.innerHTML = `
                <h3>Dziękujemy za dokonanie płatności!</h3>
                <p>Twoje bilety zostały zakupione. Wybierz, czy chcesz je dodać do swojej teczki, czy bezpośrednio aktywować:</p>
                <div class="div_buttons">
                    <button id="addToFolderButton" data-target="../HTML/moja_teczka.html">Dodaj do teczki</button>
                    <button id="downloadButton" data-target="../HTML/inteligentny_zakup_biletu.html">Pobierz</button>
                </div>
            `;
        } else {
            renderEnglish();
            contentContainer.innerHTML = `
                <h3>Thank you for making the payment!</h3>
                <p>Your tickets have been purchased. Choose whether you want to add them to your portfolio or activate them directly:</p>
                <div class="div_buttons">
                    <button id="addToFolderButton" data-target="../HTML/moja_teczka.html">Add to folder</button>
                    <button id="downloadButton" data-target="../HTML/inteligentny_zakup_biletu.html">Download</button>
                </div>
            `;
        }

        let currentBasket = getCurrentBasket();
        let qrContent = "";

        if (currentBasket.length > 0) {
            const now = new Date();
            const purchaseDate = now.toLocaleDateString('pl-PL');
            const purchaseHistory = currentBasket.map(ticket => {
                if (isPolish) {
                    qrContent += `Bilet: ${ticket.name}, Ilość: ${ticket.quantity}, Cena: ${ticket.sum_price}, Data zakupu: ${purchaseDate}\n`;
                } else {
                    qrContent += `Ticket: ${ticket.name_ang}, Amount: ${ticket.quantity}, Price: ${ticket.sum_price}, Purchase Date: ${purchaseDate}\n`;
                }
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
                if (isPolish) {
                    console.error('Błąd generowania kodu QR:', err);
                } else {
                    console.error('QR code generation error:', err);
                }
                return;
            }

            console.log(qrContent);

            const qrImage = new Image();
            qrImage.src = url;
            qrContainer.appendChild(qrImage);

            const downloadButton = document.getElementById('downloadButton');
            if (downloadButton) {
                downloadButton.addEventListener('click', () => {
                    if (isPolish) {
                        alert("Bilety zostały pobrane.");
                    } else {
                        alert("Tickets have been downloaded.");
                    }
                    const link = document.createElement('a');
                    link.href = url;
                    if (isPolish) {
                        link.download = "bilety_qr.png";
                    } else {
                        link.download = "tickets_qr.png";
                    }
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
                if (isPolish) {
                    alert("Bilety zostały dodane do teczki.");
                } else {
                    alert("Tickets have been added to your folder.");
                }
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
    const isPolish = get_language();
    if (contentContainer) {
        if (isPolish) {
            contentContainer.innerHTML = `
                <h3>Dziękujemy za dokonanie płatności!</h3>
                <p>Twoje bilety zostały zakupione.</p>
                <button id="downloadButton" data-target="../HTML/inteligentny_zakup_biletu.html">Pobierz</button>
            `;
        } else {
            contentContainer.innerHTML = `
                <h3>Thank you for making the payment!</h3>
                <p>Your tickets have been purchased.</p>
                <button id="downloadButton" data-target="../HTML/inteligentny_zakup_biletu.html">Download</button>
            `;
        }
        
        let currentBasket = getCurrentBasket();
        let qrContent = "";
        const now = new Date();
        const purchaseDate = now.toLocaleDateString('pl-PL');

        if (currentBasket.length > 0) {
            currentBasket.forEach(ticket => {
                if (isPolish) {
                    qrContent += `Bilet: ${ticket.name}, Ilość: ${ticket.quantity}, Cena: ${ticket.sum_price}, Data zakupu: ${purchaseDate}\n`;
                } else {
                    qrContent += `Ticket: ${ticket.name_ang}, Amount: ${ticket.quantity}, Price: ${ticket.sum_price}, Purchase Date: ${purchaseDate}\n`;
                }
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
                if (isPolish) {
                    console.error('Błąd generowania kodu QR:', err);
                } else {
                    console.error('QR code generation error:', err);
                }
                return;
            }

            console.log(qrContent);

            const qrImage = new Image();
            qrImage.src = url;
            qrContainer.appendChild(qrImage);

            const downloadButton = document.getElementById('downloadButton');
            if (downloadButton) {
                downloadButton.addEventListener('click', () => {
                    if (isPolish) {
                        alert("Bilety zostały pobrane.");
                    } else {
                        alert("Tickets have been downloaded.");
                    }
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