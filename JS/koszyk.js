const ticketsContainer = document.getElementById('tickets-container');
const summarySection = document.querySelector('.summary-section');
const resetFiltersButton = document.getElementById("reset-filters");
const proceedToPaymentButton = document.getElementById('proceed-to-payment');

function renderTickets() {
    const currentBasket = getCurrentBasket();
    ticketsContainer.innerHTML = '';
    let totalPrice = 0;
    let totalCount = 0;

    if (currentBasket.length > 0) {
        currentBasket.forEach(ticket => {
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
                    <span id="ticket-count-${ticket.id}">${ticket.quantity || 0}</span>
                    <button onclick="updateTicketCount(${ticket.id}, 1)">+</button>
                </div>
            `;
            ticketsContainer.appendChild(ticketElement);

            totalPrice += ticket.sum_price || 0;
            totalCount += ticket.quantity || 0;
        });
    } else {
        const element = document.createElement('div');
        element.innerHTML = `
            <div class="ticket-info">
                <p><strong>Brak biletów w koszyku</strong></p>
            </div>
        `;
        ticketsContainer.appendChild(element);
    }

    updateSummary(currentBasket);
}

function updateTicketCount(ticketId, change) {
    let currentBasket = getCurrentBasket();
    const ticket = currentBasket.find(t => t.id === ticketId);

    if (ticket) {
        ticket.quantity = Math.max(0, (ticket.quantity || 0) + change);
        ticket.sum_price = ticket.quantity * ticket.price;

        if (ticket.quantity === 0) {
            currentBasket = currentBasket.filter(t => t.id !== ticketId);
        }

        document.getElementById(`ticket-count-${ticket.id}`).innerText = ticket.quantity;

        saveCurrentBasket(currentBasket);
        updateSummary(currentBasket);
        renderTickets();
    }
}

function updateSummary(currentBasket) {
    let totalPrice = 0;
    let totalCount = 0;

    currentBasket = currentBasket.filter(ticket => ticket.quantity > 0);
    for (let i = 0; i < currentBasket.length; i++) {
        const ticket = currentBasket[i];
        totalPrice += ticket.sum_price || 0;
        totalCount += ticket.quantity || 0;
    }

    summarySection.innerHTML = `
        <p>Wartość biletów: ${totalPrice} zł</p>
        <p>Liczba biletów: ${totalCount}</p>
    `;
    resetFiltersButton.disabled = totalCount === 0;
    proceedToPaymentButton.disabled = totalCount === 0;
}

function summary_for_buying() {
    const currentBasket = getCurrentBasket();
    return currentBasket.filter(ticket => ticket.quantity > 0).map(ticket => ({ ...ticket }));
}

resetFiltersButton.addEventListener("click", () => {
    let currentBasket = getCurrentBasket();
    if (currentBasket.length > 0) {
        currentBasket.forEach(ticket => {
            ticket.quantity = 0;
            ticket.sum_price = 0;
        });

        currentBasket = currentBasket.filter(ticket => ticket.quantity > 0);

        saveCurrentBasket(currentBasket);
        renderTickets();
        resetFiltersButton.disabled = true;
        proceedToPaymentButton.disabled = true;
        location.reload();
    }
});

proceedToPaymentButton.addEventListener('click', () => {
    const selectedTicketsForBuy = summary_for_buying();
    saveCurrentBasket(selectedTicketsForBuy);
    const basketSummary = selectedTicketsForBuy.map(ticket => {
        const firstLetter = ticket.client_type[0].toUpperCase();
        const restOfText = ticket.client_type.slice(1);
        const name = firstLetter + restOfText;
        return `${name} - ${ticket.travel_time} min - ${ticket.price} zł - ${ticket.quantity} szt. - ${ticket.sum_price} zł`;
    }).join("\n");
    const totalPrice = selectedTicketsForBuy.reduce((sum, t) => sum + t.sum_price, 0);
    const totalNumber = selectedTicketsForBuy.reduce((sum, t) => sum + t.quantity, 0);
    alert(`Przechodzimy do płatności z wybranymi biletami:\n${basketSummary}\nŁączna cena: ${totalPrice} zł\nIlość wybranych biletów: ${totalNumber}`);
    window.location.href = './platnosci.html';
});

// Initial render of tickets and summary
renderTickets();