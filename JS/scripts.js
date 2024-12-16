// Add default user if not already present
function addDefaultUser() {
    if (users.length === 0) {
        const defaultUser = {
            first_name: 'Jan',
            last_name: 'Kowalski',
            email: 'jan.kowalski@gmail.com',
            password: 'janKOWALSKI123!',
            card_number: '1234 1234 1234 1234',
            expiry_date: '01/25',
            csv: '123',
            is_logged_in: false
        };
        users.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Validation accounts
    console.log(JSON.parse(localStorage.getItem('users')));

    // Validation messages
    console.log(JSON.parse(localStorage.getItem('messages')));
}

// Hamburger menu
function hamburger_menu() {
    console.log("test");
    const hamburger = document.querySelector(".hamburger_menu");
    const navLinks = document.querySelector(".nav_links");

    hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("show");
    });
}

// Add default user on page load
document.addEventListener('DOMContentLoaded', addDefaultUser);
// Add hamburger menu on page load
document.addEventListener('DOMContentLoaded', hamburger_menu);