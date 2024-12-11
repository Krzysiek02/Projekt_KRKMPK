// Function to handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        user.isLoggedIn = true;
        localStorage.setItem('users', JSON.stringify(users));
        alert(`Zalogowano pomyślnie! Witaj, ${user.firstName} ${user.lastName}.`);
        window.location.href = '../HTML/inteligentny_zakup_biletu.html';
    } else {
        alert('Nieprawidłowy email lub hasło.');
    }
}

// Attach event listener to the login form
document.getElementById('loginForm').addEventListener('submit', handleLogin);