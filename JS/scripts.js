// Add default user if not already present
function addDefaultUser() {
    if (users.length === 0) {
        const defaultUser = {
            firstName: 'Jan',
            lastName: 'Kowalski',
            email: 'jan.kowalski@gmail.com',
            password: 'janKOWALSKI123!',
            cardNumber: '1234 1234 1234 1234',
            expiryDate: '01/25',
            csv: '123',
            isLoggedIn: false
        };
        users.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Validation accounts
    console.log(JSON.parse(localStorage.getItem('users')));
}

// Add default user on page load
document.addEventListener('DOMContentLoaded', addDefaultUser);