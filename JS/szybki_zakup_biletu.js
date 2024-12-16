const ticketsContainer = document.getElementById('tickets-container');
const resetFiltersButton = document.getElementById("reset-filters");
const filters = document.querySelectorAll('.filter');
const addToCartButton = document.getElementById('add-to-cart');
const proceedToPaymentButton = document.getElementById('proceed-to-payment');

let selectedTickets = [];

function renderTickets(filteredTickets) {
    ticketsContainer.innerHTML = '';

    if (filteredTickets.length > 0) {
        filteredTickets.forEach(ticket => {
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
                <p><strong>Brak biletów o wskazanych kryteriach</strong></p>
            </div>
        `;
        ticketsContainer.appendChild(element);
    }
}

function updateTicketCount(ticketId, change) {
    if (!selectedTickets[ticketId]) selectedTickets[ticketId] = 0;
    selectedTickets[ticketId] = Math.max(0, selectedTickets[ticketId] + change);

    document.getElementById(`ticket-count-${ticketId}`).innerText = selectedTickets[ticketId];

    const totalSelected = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

    resetFiltersButton.disabled = totalSelected === 0;
    addToCartButton.disabled = totalSelected === 0;
    updateProceedToPaymentButton();
}

function updateProceedToPaymentButton() {
    const currentBasket = getCurrentBasket();
    const totalSelected = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

    proceedToPaymentButton.disabled = totalSelected === 0 && currentBasket.length === 0;
}

function applyFilters() {
    let filteredTickets = tickets;
    filters.forEach(filter => {
        if (filter.type === 'checkbox' && filter.checked) {
            const filterType = filter.dataset.filter;
            const filterValue = filter.value;
            filteredTickets = filteredTickets.filter(ticket => ticket[filterType] === filterValue);
        }

        if (filter.type === 'select-one' && filter.value) {
            filteredTickets = filteredTickets.filter(ticket => ticket.travel_time == filter.value);
        }
    });
    renderTickets(filteredTickets);
}

filters.forEach(filter => filter.addEventListener('change', applyFilters));

resetFiltersButton.addEventListener("click", () => {
    Object.keys(selectedTickets).forEach(ticketId => {
        selectedTickets[ticketId] = 0;
        document.getElementById(`ticket-count-${ticketId}`).innerText = selectedTickets[ticketId];
    });

    addToCartButton.disabled = true;
    proceedToPaymentButton.disabled = true;
    resetFiltersButton.disabled = true;
    applyFilters();
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

// Button initiation
updateProceedToPaymentButton();

// Initial render
renderTickets(tickets);