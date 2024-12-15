// Function to handle navigation
function handleNavigation(event) {
    event.preventDefault();

    const targetUrl = event.currentTarget.dataset.target;
    if (targetUrl) {
        window.location.href = targetUrl;
    }
}

// Update the navigation dynamically based on user login status
function updateNavigation() {
    const currentUser = users.find(user => user.is_logged_in);
    const loggingDiv = document.querySelector('.logging');

    if (currentUser && loggingDiv) {
        loggingDiv.innerHTML = `
            <div class="user_menu">
                <button class="toggle_menu_button">&darr;</button>
                <span class="user_name">${currentUser.first_name} ${currentUser.last_name}</span>
                <div class="menu_options" style="display: none;">
                    <button data-target="../HTML/moje_konto.html">Moje konto</button>
                    <button data-target="../HTML/ulubione.html">Ulubione</button>
                    <button data-target="../HTML/historia_zakupow.html">Historia zakupów</button>
                    <button data-target="../HTML/moja_teczka.html">Moja teczka</button>
                    <button class="logout_button">WYLOGUJ</button>
                </div>
            </div>`;

        const toggleMenuButton = document.querySelector('.toggle_menu_button');
        const menuOptions = document.querySelector('.menu_options');

        toggleMenuButton.addEventListener('click', () => {
            const isMenuVisible = menuOptions.style.display === 'block';
            menuOptions.style.display = isMenuVisible ? 'none' : 'block';
            toggleMenuButton.classList.toggle('down', isMenuVisible);
            toggleMenuButton.classList.toggle('up', !isMenuVisible);
            toggleMenuButton.innerHTML = isMenuVisible ? '&darr;' : '&uarr;';
        });

        const logoutButton = document.querySelector('.logout_button');
        logoutButton.addEventListener('click', () => {
            currentUser.is_logged_in = false;
            localStorage.setItem('users', JSON.stringify(users));
            alert(`Wylogowano poprawnie, Do zobaczenia ${currentUser.firstName} ${currentUser.lastName}`)
            location.reload();
        });

    } else if (loggingDiv) {
        loggingDiv.innerHTML = `
            <button data-target="../HTML/rejestracja.html">Zarejestruj się</button>
            <button data-target="../HTML/logowanie.html">Zaloguj się</button>
        `;
    }

    const navigationButtons = document.querySelectorAll('[data-target]');

    if (navigationButtons) {
        navigationButtons.forEach(button => {
            button.addEventListener('click', handleNavigation);
        });
    }

    const backButton = document.querySelector('.back_arrow');

    if (backButton) {
        backButton.addEventListener('click', (event) => {
            event.preventDefault();
            window.history.back();
        });
    }
}

// Run the navigation update on page load
document.addEventListener('DOMContentLoaded', updateNavigation);