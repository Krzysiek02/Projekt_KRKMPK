// Function to validate form inputs
function validateForm() {
    const fields = [
        { id: 'firstName', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Imię może zawierać tylko litery i maksymalnie 50 znaków.' },
        { id: 'lastName', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Nazwisko może zawierać tylko litery i maksymalnie 50 znaków.' },
        { id: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Wprowadź poprawny adres email.' },
        { id: 'password', regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,100}$/, error: 'Hasło musi mieć co najmniej 8 znaków, jedną dużą literę, jedną cyfrę i jeden znak specjalny.' },
        { id: 'cardNumber', regex: /^\d{4} ?\d{4} ?\d{4} ?\d{4}$/, error: 'Numer karty musi składać się z 16 cyfr, może zawierać spacje co 4 cyfry.' },
        { id: 'expiryDate', regex: /^(0[1-9]|1[0-2])\/\d{2}$/, error: 'Data ważności w formacie MM/YY.' },
        { id: 'csv', regex: /^\d{3}$/, error: 'CSV musi zawierać 3 cyfry.' }
    ];

    let isValid = true;

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}-error`);

        input.style.border = '';
        if (errorElement) errorElement.remove();

        if (!field.regex.test(input.value)) {
            isValid = false;
            input.style.border = '2px solid red';
            const errorMessage = document.createElement('div');
            errorMessage.id = `${field.id}-error`;
            errorMessage.style.color = 'red';
            errorMessage.textContent = field.error;
            input.insertAdjacentElement('afterend', errorMessage);
        }

        // Additional validation for expiry date
        if (field.id === 'expiryDate' && field.regex.test(input.value)) {
            const [month, year] = input.value.split('/').map(Number);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                isValid = false;
                input.style.border = '2px solid red';
                const errorMessage = document.createElement('div');
                errorMessage.id = `${field.id}-error`;
                errorMessage.style.color = 'red';
                errorMessage.textContent = 'Karta nieaktualna. Podaj poprawną datę ważności.';
                input.insertAdjacentElement('afterend', errorMessage);
            }
        }
    });

    return isValid;
}

// Function to save user data to localStorage
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Attach event listener to the form
document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateForm()) {
        const user = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            cardNumber: document.getElementById('cardNumber').value.replaceAll(' ', ''),
            expiryDate: document.getElementById('expiryDate').value,
            csv: document.getElementById('csv').value,
            isLoggedIn: false
        };
        saveUser(user);
        alert('Rejestracja zakończona pomyślnie!');
        this.reset();
        window.location.href = '../HTML/login.html';
    }
});