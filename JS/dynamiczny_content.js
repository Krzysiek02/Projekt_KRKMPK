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
    const loggedInUser = users.find(user => user.isLoggedIn);
    if (loggedInUser) {
        renderAuthorized(loggedInUser);
    } else {
        renderUnauthorized();
    }
}

// Add dynamicly loading content od the page
document.addEventListener('DOMContentLoaded', updateContent);