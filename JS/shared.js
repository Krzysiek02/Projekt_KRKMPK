// Validation accounts
console.log(JSON.parse(localStorage.getItem('users')));

// Validation unauthorized login for specific content
function renderUnauthorized() {
    const contentContainer = document.querySelector('.div_content_container');
    contentContainer.innerHTML = `
        <div id="unauthorized-section">
            <h2>Brak dostępu!</h2>
            <p>Musisz być zalogowany aby widzieć tą stronę.</p>
        </div>
    `;
};