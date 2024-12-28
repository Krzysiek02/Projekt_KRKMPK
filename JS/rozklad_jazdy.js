const stopsContainer = document.getElementById("stops-container");
const lineFilter = document.getElementById("line-filter");
const vehicleTypeInputs = document.querySelectorAll("input[name='vehicle-type']");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const noResultsMessage = document.createElement("p");
const resetButton = document.getElementById("reset-filters");

noResultsMessage.textContent = "Brak linii o wskazanych kryteriach.";
noResultsMessage.style.color = "red";
noResultsMessage.style.display = "none";
stopsContainer.parentNode.appendChild(noResultsMessage);

function renderStops(filter = "", vehicleType = "tram") {
  stopsContainer.innerHTML = "";
  const filteredLines = publicTransportLines.filter(
    (line) =>
      (!filter || line.number_of_line.toString().includes(filter)) &&
      line.vehicle_type === vehicleType
  );

  if (filteredLines.length === 0) {
    noResultsMessage.style.display = "block";
  } else {
    noResultsMessage.style.display = "none";
  }

  filteredLines.forEach((line) => {
    const button = document.createElement("button");
    button.textContent = `Linia ${line.number_of_line}`;
    button.addEventListener("click", () => showModal(line));
    stopsContainer.appendChild(button);
  });
}

function showModal(line) {
    const lineNumberElement = modal.querySelector("#line-number");
    lineNumberElement.textContent = `Linia ${line.number_of_line}`;
  
    const vehicleIconElement = modal.querySelector("#vehicle-icon");
    vehicleIconElement.src = `../IMAGES/${line.vehicle_type}_image.png`;
  
    const direction1Button = modal.querySelector("#direction1");
    const direction2Button = modal.querySelector("#direction2");
  
    const directions = line.directions;
    direction1Button.textContent = directions[0].destination;
    direction2Button.textContent = directions[1] ? directions[1].destination : 'Brak';
  
    let selectedDirection = directions[0];

    const changeDirection = (direction) => {
        selectedDirection = direction;
        updateModalForDirection(selectedDirection);
    };

    direction1Button.addEventListener("click", () => changeDirection(directions[0]));
    direction2Button.addEventListener("click", () => directions[1] && changeDirection(directions[1]));

    const updateModalForDirection = (direction) => {
        const routeContainer = modal.querySelector("#route");
        routeContainer.textContent = direction.route;
        const stationsList = modal.querySelector("#stations-list");
        stationsList.innerHTML = '';
        direction.lines.forEach((station) => {
            const stationElement = document.createElement("p");
            stationElement.textContent = station.name_of_station;
            stationElement.addEventListener("click", () => displayTimetableForStation(station, direction.lines));
            stationsList.appendChild(stationElement);
        });
        displayTimetableForStation(direction.lines[0], direction.lines);
    };

    const displayTimetableForStation = (station, lines) => {
        const timetableContainer = modal.querySelector("#timetable");
        timetableContainer.innerHTML = '';

        const stationHeader = document.createElement("h3");
        stationHeader.textContent = `Rozkład dla przystanku: ${station.name_of_station}`;
        timetableContainer.appendChild(stationHeader);

        const timetableTable = document.createElement("table");
        timetableTable.classList.add("timetable-table");
        timetableTable.innerHTML = `
            <thead>
                <tr>
                    <th>Dzień</th>
                    <th>Godzina</th>
                    <th>Minuta</th>
                </tr>
            </thead>
            <tbody>
                <tr class="${station === lines[0] ? 'selected' : ''}">
                    <td>Dni powszednie</td>
                    <td>${formatTimeForSchedule(station.time_table, 'normal_days').hour}</td>
                    <td>${formatTimeForSchedule(station.time_table, 'normal_days').minutes}</td>
                </tr>
                <tr class="${station === lines[1] ? 'selected' : ''}">
                    <td>Sobota</td>
                    <td>${formatTimeForSchedule(station.time_table, 'saturdays').hour}</td>
                    <td>${formatTimeForSchedule(station.time_table, 'saturdays').minutes}</td>
                </tr>
                <tr class="${station === lines[2] ? 'selected' : ''}">
                    <td>Święta</td>
                    <td>${formatTimeForSchedule(station.time_table, 'sundays').hour}</td>
                    <td>${formatTimeForSchedule(station.time_table, 'sundays').minutes}</td>
                </tr>
            </tbody>
        `;
        timetableContainer.appendChild(timetableTable);
    };

    const formatTimeForSchedule = (timeTable, dayType) => {
        const daySchedule = timeTable.find(schedule => schedule[dayType]);
        if (daySchedule) {
            return {
                hour: daySchedule[dayType].map(t => t.hour).join(', '),
                minutes: daySchedule[dayType].map(t => t.minutes.join(':')).join(', ')
            };
        }
        return { hour: 'Brak', minutes: 'Brak' };
    };

    updateModalForDirection(selectedDirection);  
    modal.classList.remove("hidden");
}

function resetFilters() {
  lineFilter.value = "";
  document.querySelector("input[name='vehicle-type'][value='tram']").checked = true;
  renderStops();
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

lineFilter.addEventListener("input", () => {
  const filterValue = lineFilter.value;
  const selectedType = [...vehicleTypeInputs].find((input) => input.checked).value;
  renderStops(filterValue, selectedType);
});

vehicleTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const filterValue = lineFilter.value;
    renderStops(filterValue, input.value);
  });
});

// Event listener dla przycisku resetowania
resetButton.addEventListener("click", resetFilters);

document.addEventListener("DOMContentLoaded", resetFilters);