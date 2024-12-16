const ticketsContainer = document.getElementById('tickets-container');
const resetFiltersButton = document.getElementById("reset-filters");
const filters = document.querySelectorAll('.filter');
const addToCartButton = document.getElementById('add-to-cart');
const proceedToPaymentButton = document.getElementById('proceed-to-payment');

let selectedTickets = {};

function renderTickets(filteredTickets) {
    ticketsContainer.innerHTML = '';

    if (filteredTickets.length > 0) {
        filteredTickets.forEach(ticket => {
            const ticketElement = document.createElement('div');
            ticketElement.classList.add('ticket');
            ticketElement.innerHTML = `
            <div class="ticket-info">
                <p><strong>Bilet ${ticket.client_type.toUpperCase()}</strong></p>
                <p>Czas: ${ticket.travel_time === 1440 ? '24 godziny' : `${ticket.travel_time} minut`}</p>
                <p>Strefa: ${ticket.zone === 'first' ? '1 Strefa' : '1 + 2 + 3 Strefa'}</p>
                <p>Cena: ${ticket.price} zł</p>
            </div>
            <div class="ticket-actions">
                <button onclick="updateTicketCount(${ticket.id}, -1)">-</button>
                <span id="ticket-count-${ticket.id}">0</span>
                <button onclick="updateTicketCount(${ticket.id}, 1)">+</button>
            </div>
            `;
            ticketsContainer.appendChild(ticketElement);
            selectedTickets[ticket.id] = selectedTickets[ticket.id] || 0;
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
    proceedToPaymentButton.disabled = totalSelected === 0;
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

function summary_description(selectedTickets) { 
    return Object.entries(selectedTickets)
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => {
        const ticket = tickets.find(t => t.id == id);
        const ticket_description = ticket_name(ticket)
        return `${ticket_description} - ${count} szt.`;
    });
}

function summary_for_buying(selectedTickets) {
    let selectedTicketsForBuy = JSON.parse(localStorage.getItem('selectedTicketsToBuy')) || [];
    return Object.entries(selectedTickets)
        .filter(([_, count]) => count > 0)
        .map(([id, count]) => {
            const ticket = tickets.find(t => t.id == id);
            const existingTicket = selectedTicketsForBuy.find(t => t.id === ticket.id);
            if (existingTicket) {
                existingTicket.quantity += count;
                existingTicket.sum_price = existingTicket.quantity * ticket.price;
                return existingTicket;
            } else {
                return {
                    ...ticket,
                    quantity: count,
                    sum_price: ticket.price * count
                };
            }
        }
    );
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
});

addToCartButton.addEventListener('click', () => {
    const selectedTicketsForBuy = summary_for_buying(selectedTickets);
    localStorage.setItem('selectedTicketsToBuy', JSON.stringify(selectedTicketsForBuy));
    const selectedTicketsSummary = summary_description(selectedTickets);
    alert(`Przechodzimy do koszyka z wybranymi biletami:\n${selectedTicketsSummary.join("\n")}`);
    window.location.href = './koszyk.html';
});

proceedToPaymentButton.addEventListener('click', () => {
    const selectedTicketsForBuy = summary_for_buying(selectedTickets);
    localStorage.setItem('selectedTicketsToBuy', JSON.stringify(selectedTicketsForBuy));
    const selectedTicketsSummary = summary_description(selectedTickets);
    alert(`Przechodzimy do płatności z wybranymi biletami:\n${selectedTicketsSummary.join("\n")}`);
    window.location.href = './platnosci.html';
});

// Initial render
renderTickets(tickets);