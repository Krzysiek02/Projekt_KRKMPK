function renderAuthorized(user) {
    const contentContainer = document.querySelector('.div_content_container');
    const availableTickets = tickets.filter(ticket => !user.favourites.some(fav => fav.id === ticket.id));
    const ticketsHTML = availableTickets.map(ticket => `
        <button class="ticket-button" data-id="${ticket.id}">
            <img src="../IMAGES/TICKETS/ticket${ticket.id}.jpg" alt="${ticket.name}" />
        </button>
    `).join('');
    
    if (contentContainer) {
        contentContainer.innerHTML = `
        <div class="tickets-container">
            ${ticketsHTML}
        </div>
        <button id="add-to-favourites" class="favourites-button" disabled>
            Dodaj Do Ulubionych
        </button>
        `;
        setupEventListeners(user);
    }
}

function setupEventListeners(user) {
    const ticketButtons = document.querySelectorAll('.ticket-button');
    const favouritesButton = document.getElementById('add-to-favourites');
    let selectedTickets = [];

    ticketButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketId = parseInt(button.dataset.id, 10);
            if (selectedTickets.includes(ticketId)) {
                selectedTickets = selectedTickets.filter(id => id !== ticketId);
                button.classList.remove('selected');
            } else {
                selectedTickets.push(ticketId);
                button.classList.add('selected');
            }
            favouritesButton.disabled = selectedTickets.length === 0;
        });
    });

    favouritesButton.addEventListener('click', () => {
        const addedTickets = tickets.filter(ticket => selectedTickets.includes(ticket.id));

        addedTickets.forEach(ticket => {
            if (!user.favourites.some(fav => fav.id === ticket.id)) {
                user.favourites.push(ticket);
            }
        });

        const ticketNames = addedTickets.map(ticket => ticket.name).join(', ');
        alert(`Dodano do ulubionych następujące bilety: ${ticketNames}`);
        saveCurrentFavourites(user.favourites);
        window.location.href = './ulubione.html';
    });
}

document.addEventListener('DOMContentLoaded', updateContentLogin);