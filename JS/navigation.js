// Update the navigation dynamically based on user login status
function updateNavigation() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.isLoggedIn);
    const loggingDiv = document.getElementById('logging');

    if (currentUser && loggingDiv) {
        loggingDiv.innerHTML = `
            <div id="userMenu">
                <button id="toggleMenuButton" class="down-arrow">&darr;</button>
                <span id="userName">${currentUser.firstName} ${currentUser.lastName}</span>
                <div id="menuOptions" style="display: none;">
                    <button data-target="../HTML/moje_konto.html">Moje konto</button>
                    <button data-target="../HTML/ulubione.html">Ulubione</button>
                    <button data-target="//">Historia zakupów</button>
                    <button data-target="//">Moja teczka</button>
                    <button id="logoutButton">WYLOGUJ</button>
                </div>
            </div>`;

        const toggleMenuButton = document.getElementById('toggleMenuButton');
        const menuOptions = document.getElementById('menuOptions');

        toggleMenuButton.addEventListener('click', () => {
            const isMenuVisible = menuOptions.style.display === 'block';
            menuOptions.style.display = isMenuVisible ? 'none' : 'block';
            toggleMenuButton.classList.toggle('down', isMenuVisible);
            toggleMenuButton.classList.toggle('up', !isMenuVisible);
            toggleMenuButton.innerHTML = isMenuVisible ? '&darr;' : '&uarr;';
        });

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', () => {
            currentUser.isLoggedIn = false;
            localStorage.setItem('users', JSON.stringify(users));
            alert(`Wylogowano poprawnie, Do zobaczenia ${currentUser.firstName} ${currentUser.lastName}`)
            location.reload();
        });

    } else if (loggingDiv) {
        loggingDiv.innerHTML = `
            <button data-target="../HTML/register.html">Zarejestruj się</button>
            <button data-target="../HTML/login.html">Zaloguj się</button>
        `;
    }

    const navigationButtons = document.querySelectorAll('[data-target]');
        navigationButtons.forEach(button => {
            button.addEventListener('click', handleNavigation);
    });
}

// Function to handle navigation
function handleNavigation(event) {
    event.preventDefault();
    const targetUrl = event.currentTarget.dataset.target;
    if (targetUrl) {
        window.location.href = targetUrl;
    }
}

// Attach event listeners to buttons
const navigationButtons = document.querySelectorAll('[data-target]');
navigationButtons.forEach(button => {
    button.addEventListener('click', handleNavigation);
});

// Attach event listeners to back buttons
const backButton = document.querySelector('.back-arrow');
if (backButton) {
    backButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.back();
    });
}

// Run the navigation update on page load
document.addEventListener('DOMContentLoaded', updateNavigation);