let selectedTickets = [];

// Dynamicly rendering logged user
function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    const isPolish = get_language();
    language_validation(isPolish);

    if (contentContainer && isPolish) {
        contentContainer.innerHTML = `
        <div class="ticket-favourite-container">
          <div class="description-section">
            <h3>Historia Zakupów</h3>
            <div class="action-buttons">
              <button id="reset-purchase-history" disabled>Zresetuj Historię Zakupów</button>
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
    } else if (contentContainer && !isPolish) {
        contentContainer.innerHTML = `
        <div class="ticket-favourite-container">
          <div class="description-section">
            <h3>Purchase History</h3>
            <div class="action-buttons">
              <button id="reset-purchase-history" disabled>Reset Purchase History</button>
            </div>
          </div>
          <div class="tickets-display">
            <div id="tickets-container" class="tickets-container"></div>
            <div class="action-buttons">
              <button id="reset-tickets" disabled>Reset Selected Tickets</button>
              <button id="add-to-cart" disabled>Add to Cart</button>
              <button id="proceed-to-payment" disabled>Go to Payments</button>
            </div>
          </div>
        </div>
        `;   
    }

    let historyTickets = user.history || [];
    const resetTicketsButton = document.getElementById("reset-tickets");
    const addToCartButton = document.getElementById('add-to-cart');
    const proceedToPaymentButton = document.getElementById('proceed-to-payment');
    const resetPurchaseHistoryButton = document.getElementById("reset-purchase-history");
    renderTickets(historyTickets);
    updateProceedToPaymentButton();

    resetPurchaseHistoryButton.disabled = historyTickets.length === 0;
    resetPurchaseHistoryButton.addEventListener("click", () => {
        user.history = [];
        historyTickets = [];
        renderTickets(historyTickets);
        resetPurchaseHistoryButton.disabled = true;
        if (isPolish) {
            alert("Historia zakupów została zresetowana.");
        } else {
            alert("Your purchase history has been reset.");
        }
        saveCurrentHistory(user.history);
        location.reload();
    });

    resetTicketsButton.addEventListener("click", () => {
        Object.keys(selectedTickets).forEach(ticketId => {
            selectedTickets[ticketId] = 0;
            document.getElementById(`ticket-count-${ticketId}`).innerText = selectedTickets[ticketId];
        });
    
        addToCartButton.disabled = true;
        proceedToPaymentButton.disabled = true;
        resetTicketsButton.disabled = true;
        renderTickets(historyTickets);
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
        let basketSummary;
        if (isPolish) {
            basketSummary = Object.entries(selectedTickets)
            .filter(([_, count]) => count > 0)
            .map(([id, count]) => {
                const ticket = tickets.find(t => t.id == id);
                let firstLetter = ticket.client_type[0].toUpperCase();
                let restOfText = ticket.client_type.slice(1);
                const name = firstLetter + restOfText;
                firstLetter = ticket.quantity_type[0].toUpperCase();
                restOfText = ticket.quantity_type.slice(1);
                const type = firstLetter + restOfText;
                let ticketTimeLabel;
                if (ticket.travel_time == 1440) {
                    ticketTimeLabel = '24 h';
                } else if (ticket.travel_time == 2880) {
                    ticketTimeLabel = '48 h';
                } else if (ticket.travel_time == 4320) {
                    ticketTimeLabel = '72 h';
                } else if (ticket.travel_time == 10080) {
                    ticketTimeLabel = '7 dni';
                } else {
                    ticketTimeLabel = `${ticket.travel_time} minut`;
                }
                return `${type} - ${name} - ${ticketTimeLabel} - ${ticket.price} zł - ${count} szt. - ${ticket.price * count} zł`;
            }).join("\n");
        } else {
            basketSummary = Object.entries(selectedTickets)
            .filter(([_, count]) => count > 0)
            .map(([id, count]) => {
                const ticket = tickets.find(t => t.id == id);
                let firstLetter = ticket.client_type_ang[0].toUpperCase();
                let restOfText = ticket.client_type_ang.slice(1);
                const name = firstLetter + restOfText;
                firstLetter = ticket.quantity_type_ang[0].toUpperCase();
                restOfText = ticket.quantity_type_ang.slice(1);
                const type = firstLetter + restOfText;
                let ticketTimeLabel;
                if (ticket.travel_time == 1440) {
                    ticketTimeLabel = '24 h';
                } else if (ticket.travel_time == 2880) {
                    ticketTimeLabel = '48 h';
                } else if (ticket.travel_time == 4320) {
                    ticketTimeLabel = '72 h';
                } else if (ticket.travel_time == 10080) {
                    ticketTimeLabel = '7 days';
                } else {
                    ticketTimeLabel = `${ticket.travel_time} minutes`;
                }
                return `${type} - ${name} - ${ticketTimeLabel} - ${ticket.price} zł - ${count} piece - ${ticket.price * count} zł`;
            }).join("\n");
        }
        saveCurrentBasket(updatedBasket);
        if (isPolish) {
            alert(`Przechodzimy do koszyka z wybranymi biletami:\n${basketSummary}`);
        } else {
            alert(`We go to the basket with selected tickets:\n${basketSummary}`);
        }
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
        let basketSummary;
        if (isPolish) {
            basketSummary = Object.entries(selectedTickets)
            .filter(([_, count]) => count > 0)
            .map(([id, count]) => {
                const ticket = tickets.find(t => t.id == id);
                let firstLetter = ticket.client_type[0].toUpperCase();
                let restOfText = ticket.client_type.slice(1);
                const name = firstLetter + restOfText;
                firstLetter = ticket.quantity_type[0].toUpperCase();
                restOfText = ticket.quantity_type.slice(1);
                const type = firstLetter + restOfText;
                let ticketTimeLabel;
                if (ticket.travel_time == 1440) {
                    ticketTimeLabel = '24 h';
                } else if (ticket.travel_time == 2880) {
                    ticketTimeLabel = '48 h';
                } else if (ticket.travel_time == 4320) {
                    ticketTimeLabel = '72 h';
                } else if (ticket.travel_time == 10080) {
                    ticketTimeLabel = '7 dni';
                } else {
                    ticketTimeLabel = `${ticket.travel_time} minut`;
                }
                return `${type} - ${name} - ${ticketTimeLabel} - ${ticket.price} zł - ${count} szt. - ${ticket.price * count} zł`;
            }).join("\n");
        } else {
            basketSummary = Object.entries(selectedTickets)
            .filter(([_, count]) => count > 0)
            .map(([id, count]) => {
                const ticket = tickets.find(t => t.id == id);
                let firstLetter = ticket.client_type_ang[0].toUpperCase();
                let restOfText = ticket.client_type_ang.slice(1);
                const name = firstLetter + restOfText;
                firstLetter = ticket.quantity_type_ang[0].toUpperCase();
                restOfText = ticket.quantity_type_ang.slice(1);
                const type = firstLetter + restOfText;
                let ticketTimeLabel;
                if (ticket.travel_time == 1440) {
                    ticketTimeLabel = '24 h';
                } else if (ticket.travel_time == 2880) {
                    ticketTimeLabel = '48 h';
                } else if (ticket.travel_time == 4320) {
                    ticketTimeLabel = '72 h';
                } else if (ticket.travel_time == 10080) {
                    ticketTimeLabel = '7 days';
                } else {
                    ticketTimeLabel = `${ticket.travel_time} minutes`;
                }
                return `${type} - ${name} - ${ticketTimeLabel} - ${ticket.price} zł - ${count} piece - ${ticket.price * count} zł`;
            }).join("\n");
        }
        const totalPrice = updatedBasket.reduce((sum, t) => sum + t.sum_price, 0);
        const totalNumber = updatedBasket.reduce((sum, t) => sum + t.quantity, 0);
        saveCurrentBasket(updatedBasket);
        if (isPolish) {
            alert(`Przechodzimy do płatności z wybranymi biletami:\n${basketSummary}\nŁączna cena: ${totalPrice} zł\nIlość wybranych biletów: ${totalNumber}`);
        } else {
            alert(`We proceed to payment with selected tickets:\n${basketSummary}\nTotal price: ${totalPrice} zł\nNumber of selected tickets: ${totalNumber}`);
        }
        window.location.href = './platnosci.html';
    });    
};

function renderTickets(historyTickets) {
    const ticketsContainer = document.getElementById('tickets-container');
    const isPolish = get_language();
    ticketsContainer.innerHTML = '';

    if (historyTickets.length > 0) {
        historyTickets.forEach(ticket => {
            if (isPolish) {
                const first_letter = ticket.client_type[0].toUpperCase();
                const rest_of_text = ticket.client_type.slice(1);
                const name = first_letter + rest_of_text;
                const ticketElement = document.createElement('div');
                const currentCount = selectedTickets[ticket.id] || 0;
                let ticketTimeLabel;
                if (ticket.travel_time == 1440) {
                    ticketTimeLabel = '24 h';
                } else if (ticket.travel_time == 2440) {
                    ticketTimeLabel = '48 h';
                } else if (ticket.travel_time == 2880) {
                    ticketTimeLabel = '72 h';
                } else if (ticket.travel_time == 10080) {
                    ticketTimeLabel = '7 dni';
                } else {
                    ticketTimeLabel = `${ticket.travel_time} minut`;
                }
                ticketElement.classList.add('ticket');
                ticketElement.innerHTML = `
                    <div class="ticket-header">
                        <p class="ticket-date">${ticket.purchase_date}</p>
                        
                    </div>
                    
                    <div class="ticket-info">
                        <div class="ticket-description">
                            <p><strong>Bilet ${name}</strong></p>
                            ${ticket.family ? '<p>Bilet Rodzinny</p>' : ''}
                            <p>Czas: ${ticketTimeLabel}</p>
                            <p>Strefa: ${ticket.zone === 'first' ? '1 Strefa' : '1 + 2 + 3 Strefa'}</p>
                        </div>
                        
                        <div class="ticket-quantity">
                            <p>${ticket.quantity} szt.</p>
                        </div>
                        <div class="ticket-price">
                            <p>Cena za 1szt.<br>${ticket.price} zł</p>
                        </div>
                        <div class="ticket-sum-price">
                            ${ticket.sum_price != ticket.price ? `<p>Łącznie<br>${ticket.sum_price} zł</p>` : ''}
                        </div>
                    </div>
                    <div class="ticket-actions">
                        <button onclick="updateTicketCount(${ticket.id}, -1)">-</button>
                        <span id="ticket-count-${ticket.id}">${currentCount}</span>
                        <button onclick="updateTicketCount(${ticket.id}, 1)">+</button>
                    </div>
                `;   
                ticketsContainer.appendChild(ticketElement);
                selectedTickets[ticket.id] = currentCount;
            } else {
                const first_letter = ticket.client_type_ang[0].toUpperCase();
                const rest_of_text = ticket.client_type_ang.slice(1);
                const name = first_letter + rest_of_text;
                const ticketElement = document.createElement('div');
                const currentCount = selectedTickets[ticket.id] || 0;
                let ticketTimeLabel;
                if (ticket.travel_time == 1440) {
                    ticketTimeLabel = '24 h';
                } else if (ticket.travel_time == 2440) {
                    ticketTimeLabel = '48 h';
                } else if (ticket.travel_time == 2880) {
                    ticketTimeLabel = '72 h';
                } else if (ticket.travel_time == 10080) {
                    ticketTimeLabel = '7 days';
                } else {
                    ticketTimeLabel = `${ticket.travel_time} minutes`;
                }
                ticketElement.classList.add('ticket');
                ticketElement.innerHTML = `
                    <div class="ticket-header">
                        <p class="ticket-date">${ticket.purchase_date}</p>
                    </div>
                    <div class="ticket-info">
                        <div class="ticket-description">
                            <p><strong>Ticket ${name}</strong></p>
                            ${ticket.family ? '<p>Familly Ticket</p>' : ''}
                            <p>Time: ${ticketTimeLabel}</p>
                            <p>Zone: ${ticket.zone === 'first' ? '1 Zone' : '1 + 2 + 3 Zone'}</p>
                        </div>
                        
                        <div class="ticket-quantity">
                            <p>${ticket.quantity} pcs.</p>
                        </div>
                        <div class="ticket-price">
                            <p>Price for one ticket: <br>${ticket.price} zł</p>
                        </div>
                        <div class="ticket-sum-price">
                            ${ticket.sum_price != ticket.price ? `<p>Sum<br>${ticket.sum_price} zł</p>` : ''}
                        </div>
                    </div>
                    <div class="ticket-actions">
                        <button onclick="updateTicketCount(${ticket.id}, -1)">-</button>
                        <span id="ticket-count-${ticket.id}">${currentCount}</span>
                        <button onclick="updateTicketCount(${ticket.id}, 1)">+</button>
                    </div>
                `;   
                ticketsContainer.appendChild(ticketElement);
                selectedTickets[ticket.id] = currentCount;
            }
        });
    } else {
        const element = document.createElement('div');
        if (isPolish) {
            element.innerHTML = `
            <div class="ticket-info">
                <p><strong>Brak Ulubionych Biletów</strong></p>
            </div>
            `;
        } else {
            element.innerHTML = `
            <div class="ticket-info">
                <p><strong>No favorite tickets</strong></p>
            </div>
            `;
        }
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