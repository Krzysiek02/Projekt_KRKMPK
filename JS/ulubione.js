let selectedTickets = [];

// Dynamicly rendering logged user
function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    if (contentContainer) {
        contentContainer.innerHTML = `
        <div class="ticket-favourite-container">
          <div class="description-section">
            <h3>Ulubione Bilety</h3>
            <div class="action-buttons">
              <button id="reset-favourites" disabled>Zresetuj Ulubione</button>
              <button id="add-to-favourites">Dodaj do Ulubionych</button>
            </div>
          </div>
          <div class="tickets-display">
            <div id="tickets-container" class="tickets-container"></div>
            <div class="action-buttons">
              <button id="reset-tickets" disabled>Zresetuj Zaznaczone Bilety</button>
              <button id="add-to-cart" disabled>Dodaj do Koszyka</button>
              <button id="proceed-to-payment" disabled>Przejdź do Płatności</button>
            </div>
          </div>
        </div>
        `;   
    }

    let favouriteTickets = user.favourites || [];
    const resetTicketsButton = document.getElementById("reset-tickets");
    const addToCartButton = document.getElementById('add-to-cart');
    const proceedToPaymentButton = document.getElementById('proceed-to-payment');
    const resetFavouritesButton = document.getElementById("reset-favourites");
    const addToFavouritesButton = document.getElementById("add-to-favourites");
    renderTickets(favouriteTickets);
    updateProceedToPaymentButton();

    resetFavouritesButton.disabled = favouriteTickets.length === 0;
    resetFavouritesButton.addEventListener("click", () => {
        user.favourites = [];
        favouriteTickets = [];
        renderTickets(favouriteTickets);
        resetFavouritesButton.disabled = true;
        alert("Wszystkie ulubione bilety zostały zresetowane.");
        saveCurrentFavourites(user.favourites);
        location.reload();
    });

    addToFavouritesButton.addEventListener("click", () => {
        if (favouriteTickets.length >= tickets.length) {
            alert("Osiągnięto maksymalną liczbę ulubionych biletów.");
        } else {
            window.location.href = './bilety.html';
        }
    });
    addToFavouritesButton.disabled = favouriteTickets.length >= tickets.length;

    resetTicketsButton.addEventListener("click", () => {
        Object.keys(selectedTickets).forEach(ticketId => {
            selectedTickets[ticketId] = 0;
            document.getElementById(`ticket-count-${ticketId}`).innerText = selectedTickets[ticketId];
        });
    
        addToCartButton.disabled = true;
        proceedToPaymentButton.disabled = true;
        resetTicketsButton.disabled = true;
        renderTickets(favouriteTickets);
        location.reload();
    });
    
    addToCartButton.addEventListener('click', () => {
        const currentBasket = getCurrentBasket();
        const updatedBasket = Object.entries(selectedTickets)
            .filter(([_, count]) => count > 0)
            .reduce((basket, [id, count]) => {
                const ticket = tickets.find(t => t.id == id);
                const existingTicket = basket.find(t => t.id === ticket.id);
                if (existingTicket) {
                    existingTicket.quantity += count;
                    existingTicket.sum_price = existingTicket.quantity * ticket.price;
                } else {
                    basket.push({
                        ...ticket,
                        quantity: count,
                        sum_price: ticket.price * count
                    });
                }
                return basket;
            }, [...currentBasket]);
        const basketSummary = Object.entries(selectedTickets)
            .filter(([_, count]) => count > 0)
            .map(([id, count]) => {
                const ticket = tickets.find(t => t.id == id);
                const firstLetter = ticket.client_type[0].toUpperCase();
                const restOfText = ticket.client_type.slice(1);
                const name = firstLetter + restOfText;
                return `${name} - ${ticket.travel_time} min - ${ticket.price} zł - ${count} szt. - ${ticket.price * count} zł`;
            }).join("\n");
        saveCurrentBasket(updatedBasket);
        alert(`Przechodzimy do koszyka z wybranymi biletami:\n${basketSummary}`);
        window.location.href = './koszyk.html';
    });
    
    proceedToPaymentButton.addEventListener('click', () => {
        const currentBasket = getCurrentBasket();
        const updatedBasket = Object.entries(selectedTickets)
            .filter(([_, count]) => count > 0)
            .reduce((basket, [id, count]) => {
                const ticket = tickets.find(t => t.id == id);
                const existingTicket = basket.find(t => t.id === ticket.id);
                if (existingTicket) {
                    existingTicket.quantity += count;
                    existingTicket.sum_price = existingTicket.quantity * ticket.price;
                } else {
                    basket.push({
                        ...ticket,
                        quantity: count,
                        sum_price: ticket.price * count
                    });
                }
                return basket;
            }, [...currentBasket]);
        const basketSummary = updatedBasket.map(ticket => {
            const first_letter = ticket.client_type[0].toUpperCase();
            const rest_of_text = ticket.client_type.slice(1);
            const name = first_letter + rest_of_text;
            return `${name} - ${ticket.travel_time} min - ${ticket.price} zł - ${ticket.quantity} szt. - ${ticket.sum_price} zł`;
        }).join("\n");
        const totalPrice = updatedBasket.reduce((sum, t) => sum + t.sum_price, 0);
        const totalNumber = updatedBasket.reduce((sum, t) => sum + t.quantity, 0);
        saveCurrentBasket(updatedBasket);
        alert(`Przechodzimy do płatności z wybranymi biletami:\n${basketSummary}\nŁączna cena: ${totalPrice} zł\nIlość wybranych biletów: ${totalNumber}`);
        window.location.href = './platnosci.html';
    });    
};

function renderTickets(favouriteTickets) {
    const ticketsContainer = document.getElementById('tickets-container');

    ticketsContainer.innerHTML = '';

    if (favouriteTickets.length > 0) {
        favouriteTickets.forEach(ticket => {
            const first_letter = ticket.client_type[0].toUpperCase();
            const rest_of_text = ticket.client_type.slice(1);
            const name = first_letter + rest_of_text;
            const ticketElement = document.createElement('div');
            const currentCount = selectedTickets[ticket.id] || 0;
            ticketElement.classList.add('ticket');
            ticketElement.innerHTML = `
                <div class="ticket-info">
                    <p><strong>Bilet ${name}</strong></p>
                    <p>Czas: ${ticket.travel_time === 1440 ? '24 godziny' : `${ticket.travel_time} minut`}</p>
                    <p>Strefa: ${ticket.zone === 'first' ? '1 Strefa' : '1 + 2 + 3 Strefa'}</p>
                    <p>Cena: ${ticket.price} zł</p>
                </div>
                <div class="ticket-actions">
                    <button onclick="updateTicketCount(${ticket.id}, -1)">-</button>
                    <span id="ticket-count-${ticket.id}">${currentCount}</span>
                    <button onclick="updateTicketCount(${ticket.id}, 1)">+</button>
                </div>
            `;
            ticketsContainer.appendChild(ticketElement);
            selectedTickets[ticket.id] = currentCount;
        });
    } else {
        const element = document.createElement('div');
        element.innerHTML = `
            <div class="ticket-info">
                <p><strong>Brak Ulubionych Biletów</strong></p>
            </div>
        `;
        ticketsContainer.appendChild(element);
    }
}

function updateTicketCount(ticketId, change) {
    const resetTicketsButton = document.getElementById("reset-tickets");
    const addToCartButton = document.getElementById('add-to-cart');

    if (!selectedTickets[ticketId]) selectedTickets[ticketId] = 0;
    selectedTickets[ticketId] = Math.max(0, selectedTickets[ticketId] + change);

    document.getElementById(`ticket-count-${ticketId}`).innerText = selectedTickets[ticketId];

    const totalSelected = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

    resetTicketsButton.disabled = totalSelected === 0;
    addToCartButton.disabled = totalSelected === 0;
    updateProceedToPaymentButton();
}

function updateProceedToPaymentButton() {
    const proceedToPaymentButton = document.getElementById('proceed-to-payment');
    const currentBasket = getCurrentBasket();
    const totalSelected = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

    proceedToPaymentButton.disabled = totalSelected === 0 && currentBasket.length === 0;
}

// Add dynamicly loading content od the page
document.addEventListener('DOMContentLoaded', updateContentLogin);