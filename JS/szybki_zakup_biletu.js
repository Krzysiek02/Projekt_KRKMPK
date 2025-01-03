let selectedTickets = [];

function renderContentPolish() {
    const contentContainer = document.querySelector('.div_content_container');

    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="ticket-purchase-container">
                <div class="tickets-display">
                    <h2>Dostępne Bilety</h2>
                    <div id="tickets-container" class="tickets-container"></div>
                </div>
                <div class="filters">
                    <h3>Filtry</h3>
                        <div class="filter-section">
                        <label><input type="checkbox" value="normalny" class="filter" data-filter="client_type"> Normalny</label>
                        <label><input type="checkbox" value="ulgowy" class="filter" data-filter="client_type"> Ulgowy</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="true" class="filter" data-filter="family"> Bilet Rodzinny</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="pojedynczy" class="filter" data-filter="quantity_type"> Pojedynczy</label>
                        <label><input type="checkbox" value="grupowy" class="filter" data-filter="quantity_type"> Grupowy</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="MPK" class="filter" data-filter="ticket_type"> MPK</label>
                        <label><input type="checkbox" value="MPK_KMŁ" class="filter" data-filter="ticket_type"> MPK + KMŁ</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="first" class="filter" data-filter="zone"> Strefa 1</label>
                        <label><input type="checkbox" value="all" class="filter" data-filter="zone"> Strefa 1 + 2 + 3</label>
                    </div>
                    <div class="filter-section">
                        <label>Czas Przejazdu:</label>
                        <select id="travel-time-filter" class="filter" data-filter="travel_time">
                            <option value="">Wszystkie</option>
                            <option value="20">20 minut</option>
                            <option value="60">60 minut</option>
                            <option value="90">90 minut</option>
                            <option value="1440">24 godziny</option>
                            <option value="2880">48 godziny</option>
                            <option value="4320">72 godziny</option>
                            <option value="10080">7 dni</option>
                        </select>
                    </div>
                    <div class="action-buttons">
                        <button id="reset-filters" disabled>Zresetuj Filtry</button>
                        <button id="add-to-cart" disabled>Dodaj do Koszyka</button>
                        <button id="proceed-to-payment" disabled>Przejdź do Płatności</button>
                    </div>
                </div>
            </div>
        `;   
    }
}

function renderContentEnglish() {
    const contentContainer = document.querySelector('.div_content_container');

    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="ticket-purchase-container">
                <div class="tickets-display">
                    <h2>Tickets Available</h2>
                    <div id="tickets-container" class="tickets-container"></div>
                </div>
                <div class="filters">
                    <h3>Filters</h3>
                        <div class="filter-section">
                        <label><input type="checkbox" value="normalny" class="filter" data-filter="client_type"> Regular</label>
                        <label><input type="checkbox" value="ulgowy" class="filter" data-filter="client_type"> Reduced</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="true" class="filter" data-filter="family"> Family Ticket</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="pojedynczy" class="filter" data-filter="quantity_type"> Single</label>
                        <label><input type="checkbox" value="grupowy" class="filter" data-filter="quantity_type"> Group</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="MPK" class="filter" data-filter="ticket_type"> MPK</label>
                        <label><input type="checkbox" value="MPK_KMŁ" class="filter" data-filter="ticket_type"> MPK + KMŁ</label>
                    </div>
                    <div class="filter-section">
                        <label><input type="checkbox" value="first" class="filter" data-filter="zone"> Zone 1</label>
                        <label><input type="checkbox" value="all" class="filter" data-filter="zone"> Zone 1 + 2 + 3</label>
                    </div>
                    <div class="filter-section">
                        <label>Travel Time:</label>
                        <select id="travel-time-filter" class="filter" data-filter="travel_time">
                            <option value="">All</option>
                            <option value="20">20 minut</option>
                            <option value="60">60 minut</option>
                            <option value="90">90 minut</option>
                            <option value="1440">24 godziny</option>
                            <option value="2880">48 godziny</option>
                            <option value="4320">72 godziny</option>
                            <option value="10080">7 dni</option>
                        </select>
                    </div>
                    <div class="action-buttons">
                        <button id="reset-filters" disabled>Reset Filters</button>
                        <button id="add-to-cart" disabled>Add to Cart</button>
                        <button id="proceed-to-payment" disabled>Go to Payments</button>
                    </div>
                </div>
            </div>
        `;   
    }
}

function renderTickets(filteredTickets) {
    const ticketsContainer = document.getElementById('tickets-container');
    const isPolish = get_language();
    ticketsContainer.innerHTML = '';

    if (filteredTickets.length > 0) {
        filteredTickets.forEach(ticket => {
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
                    <div class="ticket-info">
                        <p><strong>Bilet ${name}</strong></p>
                        ${ticket.family ? '<p>Bilet Rodzinny</p>' : ''}
                        <p>Czas: ${ticketTimeLabel}</p>
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
                    <div class="ticket-info">
                        <p><strong>Ticket ${name}</strong></p>
                        ${ticket.family ? '<p>Family Ticket</p>' : ''}
                        <p>Time: ${ticketTimeLabel}</p>
                        <p>Zone: ${ticket.zone === 'first' ? '1 Zone' : '1 + 2 + 3 Zone'}</p>
                        <p>Price: ${ticket.price} zł</p>
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
    const resetFiltersButton = document.getElementById("reset-filters");
    const addToCartButton = document.getElementById('add-to-cart');

    if (!selectedTickets[ticketId]) selectedTickets[ticketId] = 0;
    selectedTickets[ticketId] = Math.max(0, selectedTickets[ticketId] + change);

    document.getElementById(`ticket-count-${ticketId}`).innerText = selectedTickets[ticketId];

    const totalSelected = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

    resetFiltersButton.disabled = totalSelected === 0;
    addToCartButton.disabled = totalSelected === 0;
    updateProceedToPaymentButton();
}

function updateProceedToPaymentButton() {
    const proceedToPaymentButton = document.getElementById('proceed-to-payment');
    const currentBasket = getCurrentBasket();
    const totalSelected = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);

    proceedToPaymentButton.disabled = totalSelected === 0 && currentBasket.length === 0;
}

function applyFilters() {
    const filters = document.querySelectorAll('.filter');
    let filteredTickets = tickets;
    filters.forEach(filter => {
        if (filter.type === 'checkbox' && filter.checked) {
            const filterType = filter.dataset.filter;
            const filterValue = filter.value;
            if (filterType === 'family') {
                filteredTickets = filteredTickets.filter(ticket => 
                    (filterValue === 'true' && ticket.family) || (filterValue === 'false' && !ticket.family)
                );
            } else {
                filteredTickets = filteredTickets.filter(ticket => ticket[filterType] === filterValue);
            }        
        }

        if (filter.type === 'select-one' && filter.value) {
            filteredTickets = filteredTickets.filter(ticket => ticket.travel_time == filter.value);
        }
    });
    renderTickets(filteredTickets);
}

document.addEventListener('DOMContentLoaded', () => {

    updateContent();

    const resetFiltersButton = document.getElementById("reset-filters");
    const filters = document.querySelectorAll('.filter');
    const addToCartButton = document.getElementById('add-to-cart');
    const proceedToPaymentButton = document.getElementById('proceed-to-payment');

    const isPolish = get_language();

    filters.forEach(filter => filter.addEventListener('change', applyFilters));

    resetFiltersButton.addEventListener("click", () => {
        // Object.keys(selectedTickets).forEach(ticketId => {
        //     console.log(ticketId)
        //     selectedTickets[ticketId] = 0;
        //     document.getElementById(`ticket-count-${ticketId}`).innerText = selectedTickets[ticketId];
        // });

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
            basketSummary = updatedBasket.map(ticket => {
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
                return `${type} - ${name} - ${ticketTimeLabel} - ${ticket.price} zł - ${ticket.quantity} szt. - ${ticket.price * ticket.quantity} zł`;
            }).join("\n");
        } else {
            basketSummary = updatedBasket.map(ticket => {
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
                return `${type} - ${name} - ${ticketTimeLabel} - ${ticket.price} zł - ${ticket.quantity} piece - ${ticket.price * ticket.quantity} zł`;
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

    // Button initiation
    updateProceedToPaymentButton();

    // Initial render
    renderTickets(tickets);

});