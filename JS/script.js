// Add default user if not already present
function addDefaultUser() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        const defaultUser = {
            firstName: 'Jan',
            lastName: 'Kowalski',
            email: 'jan.kowalski@gmail.com',
            password: 'janKOWALSKI123!',
            cardNumber: '1234123412341234',
            expiryDate: '01/25',
            csv: '123',
            isLoggedIn: false
        };
        users.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
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

// Add default user on page load
document.addEventListener('DOMContentLoaded', addDefaultUser);

// Validation
console.log(JSON.parse(localStorage.getItem('users')));