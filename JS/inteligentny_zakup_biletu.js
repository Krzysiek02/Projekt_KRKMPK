function setupAutoComplete(input, suggestionsBox) {
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const matches = shortPublicTransportLines
        .filter(line => line.toLowerCase().includes(query))
        .slice(0, 3);
  
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = matches.length ? 'block' : 'none';
  
      matches.forEach(match => {
        const li = document.createElement('li');
        li.textContent = match;
        li.addEventListener('click', () => {
          input.value = match;
          suggestionsBox.style.display = 'none';
        });
        suggestionsBox.appendChild(li);
      });
    });
  }
  
  function setupModal(triggerButton, modal, closeButton, onSelect) {
    triggerButton.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
      if (onSelect) onSelect();
    });
  }
  
  function addIntermediateStation(container) {
    if (container.childElementCount >= 1) {
      alert('Można dodać maksymalnie jeden przystanek pośredni.');
      return;
    }
  
    const div = document.createElement('div');
    div.className = 'station-input intermediate-station';
    div.innerHTML = `
      <label for="between-station-${container.childElementCount + 1}">Przystanek Pośredni ${container.childElementCount + 1}:</label>
      <input type="text" id="between-station-${container.childElementCount + 1}" name="between-station-${container.childElementCount + 1}" placeholder="Wprowadź przystanek" autocomplete="off" />
      <ul class="suggestions"></ul>
      <button type="button" class="remove-station">X</button>
    `;
    container.appendChild(div);
  
    const input = div.querySelector('input');
    const suggestionsBox = div.querySelector('.suggestions');
    setupAutoComplete(input, suggestionsBox);
  
    div.querySelector('.remove-station').addEventListener('click', () => {
      div.remove();
    });
  }
  
  function swapStations() {
    const startInput = document.getElementById('start-station');
    const endInput = document.getElementById('end-station');
    const temp = startInput.value;
    startInput.value = endInput.value;
    endInput.value = temp;
  }

  function validateForm() {
    const startStation = document.getElementById('start-station').value.trim();
    const endStation = document.getElementById('end-station').value.trim();
    const date = document.getElementById('date-picker').value.trim();
    const time = document.getElementById('time-picker').value.trim();
  
    if (!startStation || !endStation || !date || !time) {
      alert('Wszystkie pola: przystanek początkowy, przystanek końcowy, data oraz godzina muszą być wypełnione!');
      return false;
    }
  
    const normalTickets = parseInt(document.querySelector('input[data-type="normal"]').value) || 0;
    const discountTickets = parseInt(document.querySelector('input[data-type="discount"]').value) || 0;
  
    if (normalTickets === 0 && discountTickets === 0) {
      alert('Musisz wybrać przynajmniej jeden bilet!');
      return false;
    }
  
    return true;
  }
  
  setupAutoComplete(document.getElementById('start-station'), document.getElementById('start-suggestions'));
  setupAutoComplete(document.getElementById('end-station'), document.getElementById('end-suggestions'));
  
  document.getElementById('add-intermediate-station').addEventListener('click', () => {
    addIntermediateStation(document.getElementById('intermediate-stations-container'));
  });
  
  document.getElementById('swap-stations').addEventListener('click', swapStations);
  
  setupModal(
    document.getElementById('set-date'),
    document.getElementById('date-modal'),
    document.getElementById('close-date-modal'),
    () => {
      const date = document.getElementById('date-picker').value;
      document.getElementById('selected-date').textContent = `Data: ${date || 'Brak Wybranej Daty'}`;
    }
  );
  
  setupModal(
    document.getElementById('set-time'),
    document.getElementById('time-modal'),
    document.getElementById('close-time-modal'),
    () => {
      const time = document.getElementById('time-picker').value;
      document.getElementById('selected-time').textContent = `Godzina: ${time || 'Brak Wybranej Godziny'}`;
    }
  );
  
  document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('#search_ticket_button');
    const container = document.querySelector('.div_content_container');

    const saveToLocalStorage = (data) => {
        localStorage.setItem('ticketData', JSON.stringify(data));
    };

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        const startPoint = document.querySelector('#start-station').value || '';
        const endPoint = document.querySelector('#end-station').value || '';
        const travelDate = document.querySelector('#date-picker').value || '';
        const travelTime = document.querySelector('#time-picker').value || '';
        
        const intermediateStops = Array.from(document.querySelectorAll('.intermediate-station input'))
            .map(input => input.value)
            .filter(value => value);

        if (!startPoint || !endPoint || !travelDate || !travelTime) {
            alert("Proszę podać przystanek początkowy, przystanek końcowy, datę oraz godzinę.");
            return;
        }

        const initialData = {
            startPoint,
            endPoint,
            travelDate,
            travelTime,
            intermediateStops
        };

        saveToLocalStorage(initialData);

        container.innerHTML = `
            <div class="ticket_selection">
                <div class="ticket_left">
                    <h2>Wybierz rodzaj oraz ilość biletów</h2>
                </div>
                <div class="ticket_right">
                    <div class="ticket_type">
                        <span>Bilet normalny</span>
                        <div class="ticket_counter">
                            <button class="decrement" data-type="normal">-</button>
                            <input type="number" class="ticket_input" data-type="normal" value="0" min="0" readonly />
                            <button class="increment" data-type="normal">+</button>
                        </div>
                    </div>
                    <div class="ticket_type">
                        <span>Bilet ulgowy</span>
                        <div class="ticket_counter">
                            <button class="decrement" data-type="discount">-</button>
                            <input type="number" class="ticket_input" data-type="discount" value="0" min="0" readonly />
                            <button class="increment" data-type="discount">+</button>
                        </div>
                    </div>
                    <button class="next_button">Dalej</button>
                </div>
            </div>
        `;

        const counters = container.querySelectorAll('.ticket_counter');
        counters.forEach(counter => {
            const decrement = counter.querySelector('.decrement');
            const increment = counter.querySelector('.increment');
            const input = counter.querySelector('.ticket_input');

            decrement.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value > 0) input.value = value - 1;
            });

            increment.addEventListener('click', () => {
                let value = parseInt(input.value);
                input.value = value + 1;
            });
        });

        const nextButton = container.querySelector('.next_button');
        nextButton.addEventListener('click', () => {
            const normalTickets = parseInt(container.querySelector('input[data-type="normal"]').value) || 0;
            const discountTickets = parseInt(container.querySelector('input[data-type="discount"]').value) || 0;

            if (normalTickets === 0 && discountTickets === 0) {
                alert('Musisz wybrać przynajmniej jeden bilet!');
                return;
            }

            const updatedData = {
                ...JSON.parse(localStorage.getItem('ticketData')),
                normalTickets,
                discountTickets
            };

            saveToLocalStorage(updatedData);

            const ticketData = JSON.parse(localStorage.getItem('ticketData'));
            const selectedDate = ticketData ? ticketData.travelDate : 'Brak wybranej daty';

            const travelDate = new Date(ticketData.travelDate);
            const dayOfWeek = travelDate.getDay();
            let dayType = 'normal_days';
            if (dayOfWeek === 6) dayType = 'saturdays';
            if (dayOfWeek === 0) dayType = 'sundays';

            const availableConnections = [];

            publicTransportLines.forEach(line => {
                line.directions.forEach(direction => {
                    const routeStops = direction.route.split(', ');
                    const startIndex = routeStops.indexOf(ticketData.startPoint);
                    const endIndex = routeStops.indexOf(ticketData.endPoint);

                    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                        const intermediateStops = ticketData.intermediateStops;
                        let validRoute = true;

                        if (intermediateStops.length > 0) {
                            const intermediateStopIndex = routeStops.indexOf(intermediateStops[0]);
                            if (intermediateStopIndex === -1 || intermediateStopIndex <= startIndex || intermediateStopIndex >= endIndex) {
                                validRoute = false;
                            }
                        }

                        if (validRoute) {
                                const stationBegining = direction.lines[startIndex].time_table[0][dayType];
                                stationBegining.forEach((schedule, index1) => {
                                    const hour = parseInt(schedule.hour);
                                    schedule.minutes.forEach((minute, index2) => {
                                        const departureTime = `${hour}:${minute}`;
                                        const arrivalTime = `${hour}:${direction.lines[endIndex].time_table[0][dayType][index1].minutes[index2]}`;
                                        const userTime = ticketData.travelTime.split(':').slice(0, 2).join(':');
                                        const departureTimeInMinutes = convertToMinutes(departureTime);
                                        const arrivalTimeInMinutes = convertToMinutes(arrivalTime);
                                        const userTimeInMinutes = convertToMinutes(userTime);
                                        let travelDuration;
                                        if (arrivalTimeInMinutes > departureTimeInMinutes) {
                                            travelDuration = arrivalTimeInMinutes - departureTimeInMinutes;
                                        } else {
                                            travelDuration = departureTimeInMinutes - arrivalTimeInMinutes;
                                        }
                                        const bestTicket = findBestTicketCombination(base_tickets, ticketData, travelDuration);

                                        if (departureTimeInMinutes >= userTimeInMinutes && departureTimeInMinutes <= arrivalTimeInMinutes) {
                                            availableConnections.push({
                                                departure: departureTime,
                                                departureTimeInMinutes: departureTimeInMinutes,
                                                arrival: arrivalTime,
                                                lineNumber: line.number_of_line,
                                                vehicleType: line.vehicle_type,
                                                route: direction.route,
                                                bestTicket
                                            });
                                        } else if  (departureTimeInMinutes >= userTimeInMinutes && departureTimeInMinutes > arrivalTimeInMinutes) {
                                            availableConnections.push({
                                                departure: arrivalTime,
                                                departureTimeInMinutes: arrivalTimeInMinutes,
                                                arrival: departureTime,
                                                lineNumber: line.number_of_line,
                                                vehicleType: line.vehicle_type,
                                                route: direction.route,
                                                bestTicket
                                            });
                                        }
                                    });
                                });
                            availableConnections.sort((a, b) => a.departureTimeInMinutes - b.departureTimeInMinutes);
                        }
                    }
                });
            });

            let currentFilter = 'quickest-filter';

            function showResult(filteredConnections = availableConnections) {
                if (filteredConnections.length > 0) {
                    container.innerHTML = `
                    <div class="connections-list">
                        <h2>Lista połączeń</h2>
                        <p>Data podróży: ${selectedDate}</p>
                        <div class="filters">
                            <label><input type="radio" name="filter" id="quickest-filter" ${currentFilter === 'quickest-filter' ? 'checked' : ''}> Najszybszy</label>
                            <label><input type="radio" name="filter" id="shortest-filter" ${currentFilter === 'shortest-filter' ? 'checked' : ''}> Najkrótszy</label>
                            <label><input type="radio" name="filter" id="cheapest-filter" ${currentFilter === 'cheapest-filter' ? 'checked' : ''}> Najtańszy</label>
                        </div>
                        <div id="connections">${generateConnectionsHTML(filteredConnections)}</div>
                    </div>
                    `;
                } else {
                    container.innerHTML = `
                    <div class="connections-list">
                        <h2>Lista połączeń</h2>
                        <p>Data podróży: ${selectedDate}</p>
                        <p id="no-connections">Brak dostępnych połączeń dla wybranych przystanków.</p>
                    </div>
                    `;
                }

                document.querySelectorAll('input[name="filter"]').forEach(button => {
                    button.addEventListener('change', () => applyFilter(button.id));
                });

                const connectionElements = document.querySelectorAll('.connection');
                connectionElements.forEach((connectionElement, index) => {
                    connectionElement.addEventListener('click', () => {
                        const selectedConnection = filteredConnections[index];
                        showSummary(selectedConnection);  // Wywołanie showSummary z wybranym połączeniem
                    });
                });
            }

            function applyFilter(selectedFilter) {
                currentFilter = selectedFilter;

                let filteredConnections = [...availableConnections];
                switch (selectedFilter) {
                    case 'quickest-filter':
                        filteredConnections.sort((a, b) => a.departureTimeInMinutes - b.departureTimeInMinutes);
                        break;
                    case 'shortest-filter':
                        filteredConnections.sort((a, b) => {
                            const durationA = convertToMinutes(a.arrival) - convertToMinutes(a.departure);
                            const durationB = convertToMinutes(b.arrival) - convertToMinutes(b.departure);
                            return durationA - durationB;
                        });
                        break;
                    case 'cheapest-filter':
                        filteredConnections.sort((a, b) => a.bestTicket.totalCost - b.bestTicket.totalCost);
                        break;
                }

                showResult(filteredConnections);
            }

            showResult();

        });

        function generateConnectionsHTML(connections) {
            return connections.map(connection => {
                const vehicleImage = connection.vehicleType === 'bus' ? '../IMAGES/bus_image.png' : '../IMAGES/tram_image.png';
                const ticketDetails = connection.bestTicket.tickets.map(ticket => 
                    `${ticket.count} x ${ticket.ticket.client_type} (${ticket.ticket.quantity_type}) - ${ticket.ticket.price * ticket.count} PLN`
                ).join('<br>');
        
                return `
                <div class="connection">
                    <p>Odjazd: ${connection.departure}</p>
                    <p>Przyjazd: ${connection.arrival}</p>
                    <p>Linia: ${connection.lineNumber} <img src="${vehicleImage}" alt="${connection.vehicleType}" class="vehicle-image" /></p>
                    <p>Trasa: ${connection.route}</p>
                    <p>Najlepszy bilet/ty:<br>${ticketDetails}</p>
                    <p>Łączny koszt: ${connection.bestTicket.totalCost} PLN</p>
                </div>
                `;
            }).join('');
        }

        function convertToMinutes(time) {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }

        function findBestTicketCombination(baseTickets, ticketData, travelDuration) {
            const { normalTickets, discountTickets } = ticketData;
        
            function findCheapestTickets(tickets, travelDuration, ticketType) {
                const availableSingleTickets = tickets
                    .filter(ticket => ticket.travel_time >= travelDuration && ticket.quantity_type === 'pojedynczy' && ticket.client_type == ticketType)
                    .sort((a, b) => a.price - b.price);
        
                const availableGroupTickets = tickets
                    .filter(ticket => ticket.travel_time >= travelDuration && ticket.quantity_type === 'grupowy' && ticket.client_type == ticketType)
                    .sort((a, b) => a.price - b.price);
        
                const cheapestSingleTicket = availableSingleTickets[0] || null;
                const cheapestGroupTicket = availableGroupTickets[0] || null;
        
                return { cheapestSingleTicket, cheapestGroupTicket };
            }
        
            function generateBestCombination(ticketCount, cheapestSingleTicket, cheapestGroupTicket) {
                const combination = [];
                let remainingTickets = ticketCount;
            
                const maxGroupSize = 15;
            
                while (remainingTickets > 0) {
                    if (cheapestGroupTicket && remainingTickets >= 2) {
                        const groupPrice = cheapestGroupTicket.price;
                        const groupSize = Math.min(maxGroupSize, remainingTickets);
                        const singlePriceForGroupSize = cheapestSingleTicket.price * groupSize;
            
                        if (groupPrice < singlePriceForGroupSize) {
                            const ticketsNeeded = Math.floor(remainingTickets / maxGroupSize);
                            const groupTicketsCount = ticketsNeeded > 0 ? ticketsNeeded : 1;
                            const actualGroupSize = Math.min(maxGroupSize, remainingTickets);
            
                            const existingGroupTicket = combination.find(
                                (item) => item.ticket === cheapestGroupTicket
                            );
            
                            if (existingGroupTicket) {
                                existingGroupTicket.count += groupTicketsCount;
                            } else {
                                combination.push({
                                    ticket: cheapestGroupTicket,
                                    count: groupTicketsCount,
                                });
                            }
            
                            remainingTickets -= groupTicketsCount * actualGroupSize;
                            continue;
                        }
                    }
            
                    if (cheapestSingleTicket && remainingTickets > 0) {
                        const existingSingleTicket = combination.find(
                            (item) => item.ticket === cheapestSingleTicket
                        );
            
                        if (existingSingleTicket) {
                            existingSingleTicket.count += remainingTickets;
                        } else {
                            combination.push({
                                ticket: cheapestSingleTicket,
                                count: remainingTickets,
                            });
                        }
            
                        remainingTickets = 0;
                    }
                }
            
                return combination;
            }                                
        
            const normalTicketsList = findCheapestTickets(baseTickets, travelDuration, 'normalny');
            const discountTicketsList = findCheapestTickets(baseTickets, travelDuration, 'ulgowy');
        
            const normalCombination = generateBestCombination(normalTickets, normalTicketsList.cheapestSingleTicket, normalTicketsList.cheapestGroupTicket);
            const discountCombination = generateBestCombination(discountTickets, discountTicketsList.cheapestSingleTicket, discountTicketsList.cheapestGroupTicket);
        
            const allTickets = [...normalCombination, ...discountCombination];
        
            let totalCost = 0;
            allTickets.forEach(ticket => {
                totalCost += ticket.ticket.price * ticket.count;
            });
        
            return {
                tickets: allTickets,
                totalCost: totalCost
            };
        }        
    });
});

function showSummary(connection) {
    const container = document.querySelector('.div_content_container');
    const selectedTickets = connection.bestTicket.tickets;
    console.log(selectedTickets);
    const ticketSummary = selectedTickets.map(ticketInfo => {
        const ticket = ticketInfo.ticket;
        const count = ticketInfo.count;

        const clientType = ticket.client_type.charAt(0).toUpperCase() + ticket.client_type.slice(1);
        const ticketType = ticket.quantity_type.charAt(0).toUpperCase() + ticket.quantity_type.slice(1);
        const ticketTimeLabel = ticket.travel_time === 1440
            ? '24 h'
            : ticket.travel_time === 2880
            ? '48 h'
            : ticket.travel_time === 4320
            ? '72 h'
            : ticket.travel_time === 10080
            ? '7 dni'
            : `${ticket.travel_time} minut`;

        const ticketZone = ticket.zone === 'all' ? 'Strefa I + II + III' : 'Strefa I';

        return `
            <div class="ticket-row">
                <span>${ticketType} - ${clientType}</span>
                <span>${ticketTimeLabel}</span>
                <span>Strefa: ${ticketZone}</span>
                <span>Cena za szt.: ${ticket.price} zł</span>
                <span>Ilość: ${count}</span>
                <span>Suma: ${ticket.price * count} zł</span>
            </div>
        `;
    }).join('');

    const totalPrice = selectedTickets.reduce((sum, ticketInfo) => {
        return sum + (ticketInfo.ticket.price * ticketInfo.count);
    }, 0);
    
    container.innerHTML = `
        <div class="summary-container">
            <div class="summary-left">
                <h3>Twoje wybrane bilety</h3>
                ${ticketSummary}
                <div class="total-price">Łączna cena: ${totalPrice} zł</div>
            </div>
            <div class="summary-right">
                <button id="reselect-button">Ponowne Inteligentne Wybranie Biletu</button>
                <button id="add-to-cart-button">Dodaj do Koszyka</button>
                <button id="proceed-to-payment-button">Przejdź do Płatności</button>
            </div>
        </div>
    `;

    document.getElementById('reselect-button').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('add-to-cart-button').addEventListener('click', () => {
        const currentBasket = getCurrentBasket();
        const updatedBasket = selectedTickets
        .reduce((basket, ticketInfo) => {
            const ticket = ticketInfo.ticket;
            const count = ticketInfo.count;
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
        const basketSummary = connection.bestTicket.tickets.map(ticket => {
            const clientType = ticket.ticket.client_type.charAt(0).toUpperCase() + ticket.ticket.client_type.slice(1);
            const ticketType = ticket.ticket.quantity_type.charAt(0).toUpperCase() + ticket.ticket.quantity_type.slice(1);
            const ticketTimeLabel = ticket.ticket.travel_time === 1440
                ? '24 h'
                : ticket.ticket.travel_time === 2880
                ? '48 h'
                : ticket.ticket.travel_time === 4320
                ? '72 h'
                : ticket.ticket.travel_time === 10080
                ? '7 dni'
                : `${ticket.ticket.travel_time} minut`;

            return `${ticketType} - ${clientType} - ${ticketTimeLabel} - ${ticket.ticket.price} zł - ${ticket.count} szt. - ${ticket.count * ticket.ticket.price} zł`;
        }).join('\n');
        saveCurrentBasket(updatedBasket);
        alert(`Przechodzimy do koszyka z wybranymi biletami:\n${basketSummary}`);
        window.location.href = './koszyk.html';
    });

    document.getElementById('proceed-to-payment-button').addEventListener('click', () => {
        const currentBasket = getCurrentBasket();
        const updatedBasket = selectedTickets
        .reduce((basket, ticketInfo) => {
            const ticket = ticketInfo.ticket;
            const count = ticketInfo.count;
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
            const clientType = ticket.client_type.charAt(0).toUpperCase() + ticket.client_type.slice(1);
            const ticketType = ticket.quantity_type.charAt(0).toUpperCase() + ticket.quantity_type.slice(1);
            const ticketTimeLabel = ticket.travel_time === 1440
                ? '24 h'
                : ticket.travel_time === 2880
                ? '48 h'
                : ticket.travel_time === 4320
                ? '72 h'
                : ticket.travel_time === 10080
                ? '7 dni'
                : `${ticket.travel_time} minut`;

            return `${ticketType} - ${clientType} - ${ticketTimeLabel} - ${ticket.price} zł - ${ticket.quantity} szt. - ${ticket.sum_price} zł`;
        }).join('\n');
        const totalPrice = updatedBasket.reduce((sum, t) => sum + t.sum_price, 0);
        const totalNumber = updatedBasket.reduce((sum, t) => sum + t.quantity, 0);
        saveCurrentBasket(updatedBasket);
        alert(`Przechodzimy do płatności z wybranymi biletami:\n${basketSummary}\nŁączna cena: ${totalPrice} zł\nIlość wybranych biletów: ${totalNumber}`);
        window.location.href = './platnosci.html';
    });
}


  