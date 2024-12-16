// Dynamicly rendering whether user isn't logged 
function renderUnauthorized() {
    const contentContainer = document.querySelector('.div_content_container');
    contentContainer.innerHTML = `
        <div id="unauthorized-section">
            <h2>Brak dostępu!</h2>
            <p>Musisz być zalogowany aby widzieć tą stronę.</p>
        </div>
    `;
};

// Dynamicly rendering whether user is logged 
function updateContent() {
    const loggedInUser = users.find(user => user.is_logged_in);
    const ticketCount = selectedTicketsToBuy.length > 0;
    if (loggedInUser) {
        renderAuthorized(loggedInUser);
    } else if (ticketCount) {
        if (loggedInUser) {
            renderAuthorized(loggedInUser);
        }
        else {
            renderUnauthorizedWithTickets();
        }
    } else {
        renderUnauthorized();
    }
}

// Add dynamicly loading content od the page
document.addEventListener('DOMContentLoaded', updateContent);