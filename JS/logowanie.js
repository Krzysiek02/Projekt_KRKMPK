// Function to handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        user.is_logged_in = true;
        localStorage.setItem('users', JSON.stringify(users));
        alert(`Zalogowano pomyślnie! Witaj, ${user.first_name} ${user.last_name}.`);
        window.location.href = '../HTML/inteligentny_zakup_biletu.html';
    } else {
        alert('Nieprawidłowy email lub hasło.');
        location.reload();
    }
}

// Attach event listener to the login form
document.querySelector('.login_form').addEventListener('submit', handleLogin);