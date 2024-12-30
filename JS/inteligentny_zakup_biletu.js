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
  
  // Initialize auto-complete and modals
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
        
        // Collect intermediate stops
        const intermediateStops = Array.from(document.querySelectorAll('.intermediate-station input'))
            .map(input => input.value)
            .filter(value => value); // Remove empty stops

        // Validate form before searching for tickets
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

        // Increment and decrement logic
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

            // Ustalamy dzień tygodnia
            const travelDate = new Date(ticketData.travelDate);
            const dayOfWeek = travelDate.getDay();
            let dayType = 'normal_days'; // Domyślnie dzień roboczy
            if (dayOfWeek === 6) dayType = 'saturdays'; // Sobota
            if (dayOfWeek === 0) dayType = 'sundays'; // Niedziela

            // Wyszukiwanie połączeń
            const availableConnections = [];

            publicTransportLines.forEach(line => {
                line.directions.forEach(direction => {
                    // Sprawdzamy, czy przystanek początkowy i końcowy są w trasie
                    const routeStops = direction.route.split(', ');
                    const startIndex = routeStops.indexOf(ticketData.startPoint);
                    const endIndex = routeStops.indexOf(ticketData.endPoint);

                    // Jeżeli są przystanki pośrednie, uwzględniamy je
                    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                        const intermediateStops = ticketData.intermediateStops;
                        let validRoute = true;

                        // Jeżeli są przystanki pośrednie, sprawdzamy, czy są na trasie
                        if (intermediateStops.length > 0) {
                            const intermediateStopIndex = routeStops.indexOf(intermediateStops[0]);
                            if (intermediateStopIndex === -1 || intermediateStopIndex <= startIndex || intermediateStopIndex >= endIndex) {
                                validRoute = false;
                            }
                        }

                        // Jeżeli trasa jest ważna, sprawdzamy godziny odjazdów
                        if (validRoute) {
                            direction.lines.forEach(lineDetails => {
                                const station = lineDetails.time_table[0][dayType]; // Wybieramy odpowiedni dzień
                                station.forEach(schedule => {
                                    const hour = parseInt(schedule.hour);
                                    schedule.minutes.forEach(minute => {
                                        const departureTime = `${hour}:${minute}`;
                                        const userTime = ticketData.travelTime.split(':').slice(0, 2).join(':');
                                        const departureTimeInMinutes = convertToMinutes(departureTime);
                                        const userTimeInMinutes = convertToMinutes(userTime);

                                        if (departureTimeInMinutes >= userTimeInMinutes) {
                                            availableConnections.push({
                                                departure: departureTime,
                                                departureTimeInMinutes: departureTimeInMinutes,
                                                arrival: calculateArrivalTime(departureTime, routeStops),
                                                lineNumber: line.number_of_line,
                                                vehicleType: line.vehicle_type,
                                                route: direction.route,
                                                price: 1
                                            });
                                        }
                                    });
                                });
                            });
                            availableConnections.sort((a, b) => a.departureTimeInMinutes - b.departureTimeInMinutes);
                        }
                    }
                });
            });

            function showResult() {
                if (availableConnections.length > 0) {
                    container.innerHTML = `
                    <div class="connections-list">
                        <h2>Lista połączeń</h2>
                        <p>Data podróży: ${selectedDate}</p>
                        <div class="filters">
                            <label><input type="radio" name="filter" id="quickest-filter" checked> Najszybszy</label>
                            <label><input type="radio" name="filter" id="shortest-filter"> Najkrótszy</label>
                            <label><input type="radio" name="filter" id="cheapest-filter"> Najtańszy</label>
                        </div>
                        <div id="connections">${generateConnectionsHTML(availableConnections)}</div>
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
                
            }

            // Wyświetlanie wyników
            showResult();

            // Funkcja dla aktywnego filtra
            const filterRadioButtons = document.querySelectorAll('input[name="filter"]');
            filterRadioButtons.forEach(button => {
                button.addEventListener('change', () => {
                    const selectedFilter = document.querySelector('input[name="filter"]:checked').id;

                    switch (selectedFilter) {
                        case 'quickest-filter':
                            availableConnections.sort((a, b) => a.departureTimeInMinutes - b.departureTimeInMinutes);
                            break;
                        case 'shortest-filter':
                            availableConnections.sort((a, b) => {
                                const departureInMinutesA = convertToMinutes(a.departure);
                                const arrivalInMinutesA = convertToMinutes(a.arrival);
                                const departureInMinutesB = convertToMinutes(b.departure);
                                const arrivalInMinutesB = convertToMinutes(b.arrival);
                                return (arrivalInMinutesA - departureInMinutesA) - (arrivalInMinutesB - departureInMinutesB);
                            });
                            break;
                        case 'cheapest-filter':
                            availableConnections.sort((a, b) => a.price - b.price);
                            break;
                    }

                    showResult();
                });
            });
        });

        // Funkcja generująca HTML dla połączeń
        function generateConnectionsHTML(connections) {
            return connections.map(connection => {
                const vehicleImage = connection.vehicleType === 'bus' ? '../IMAGES/bus_image.png' : '../IMAGES/tram_image.png';

                return `
                <div class="connection">
                    <p>Odjazd: ${connection.departure}</p>
                    <p>Przyjazd: ${connection.arrival}</p>
                    <p>Linia: ${connection.lineNumber} <img src="${vehicleImage}" alt="${connection.vehicleType}" class="vehicle-image" /></p>
                    <p>Trasa: ${connection.route}</p>
                    <p>Cena: ${connection.price} PLN</p>
                </div>
                `;
            }).join('');
        }

        // Funkcja obliczająca czas przyjazdu
        function calculateArrivalTime(departureTime, routeStops) {
            const departure = departureTime.split(':');
            let hours = parseInt(departure[0]);
            let minutes = parseInt(departure[1]) + 15; // Dodajemy 15 minut do czasu odjazdu
            if (minutes >= 60) {
                minutes -= 60;
                hours += 1;
            }
            return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        }

        // Funkcja konwertująca czas na minuty
        function convertToMinutes(time) {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }

    });
});


  