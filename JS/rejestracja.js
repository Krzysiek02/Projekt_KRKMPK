// Function to validate form inputs
function validateForm() {
    const fields = [
        { class: 'first_name', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Imię może zawierać tylko litery i maksymalnie 50 znaków.' },
        { class: 'last_name', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Nazwisko może zawierać tylko litery i maksymalnie 50 znaków.' },
        { class: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Wprowadź poprawny adres email.' },
        { class: 'password', regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,100}$/, error: 'Hasło musi mieć co najmniej 8 znaków, jedną dużą literę, jedną cyfrę i jeden znak specjalny.' },
        { class: 'card_number', regex: /^\d{4} ?\d{4} ?\d{4} ?\d{4}$/, error: 'Numer karty musi składać się z 16 cyfr, może zawierać spacje co 4 cyfry.' },
        { class: 'expiry_date', regex: /^(0[1-9]|1[0-2])\/\d{2}$/, error: 'Data ważności w formacie MM/YY.' },
        { class: 'csv', regex: /^\d{3}$/, error: 'CSV musi zawierać 3 cyfry.' }
    ];

    let isValid = true;

    fields.forEach(field => {
        const input = document.querySelector(`.${field.class}`);
        const errorElement = document.querySelector(`.${field.class}_error`);

        input.style.border = '';
        if (errorElement) errorElement.remove();

        if (!field.regex.test(input.value.trim())) {
            isValid = false;
            input.style.border = '2px solid red';
            const errorMessage = document.createElement('div');
            errorMessage.className = `${field.class}_error`;
            errorMessage.style.color = 'red';
            errorMessage.textContent = field.error;
            input.insertAdjacentElement('afterend', errorMessage);
        }

        // Additional validation for expiry date
        if (field.class === 'expiry_date' && field.regex.test(input.value.trim())) {
            const [month, year] = input.value.trim().split('/').map(Number);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                isValid = false;
                input.style.border = '2px solid red';
                const errorMessage = document.createElement('div');
                errorMessage.className = `${field.class}-error`;
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
    const lastId = users.length > 0 ? Math.max(...users.map(u => u.id || 1)) : 1;
    user.id = lastId + 1;
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to check if the email is already taken
function isEmailTaken(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.email === email);
}

// Function to reper proper card adress formula
function formatCardNumber(cardNumber) {
    const cleanedCardNumber = cardNumber.replace(/\D/g, '');
    return cleanedCardNumber.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

// Function for registration
function registration(event) {
    event.preventDefault();

    const emailInput = document.querySelector('.email').value.trim();

    if (isEmailTaken(emailInput)) {
        alert('Konto z tym adresem email już istnieje. Wybierz inny adres.');
        this.reset();
        return;
    }
    
    if (validateForm()) {
        const firstNameInput = document.querySelector('.first_name').value.trim();
        const lastNameInput = document.querySelector('.last_name').value.trim();
        const emailInput = document.querySelector('.email').value.trim();

        const user = {
            first_name: firstNameInput.charAt(0).toUpperCase() + firstNameInput.slice(1).toLowerCase(),
            last_name: lastNameInput.charAt(0).toUpperCase() + lastNameInput.slice(1).toLowerCase(),
            email: emailInput.toLowerCase(),
            password: document.querySelector('.password').value.trim(),
            card_number: formatCardNumber(document.querySelector('.card_number').value.trim()),
            expiry_date: document.querySelector('.expiry_date').value.trim(),
            csv: document.querySelector('.csv').value.trim(),
            is_logged_in: false,
            basket: [],
            favourites: [],
            not_active_file: [],
            active_file: [],
            history: []
        };
        saveUser(user);
        alert('Rejestracja zakończona pomyślnie!');
        this.reset();
        window.location.href = '../HTML/logowanie.html';
    }
}

// Attach event listener to the form
document.querySelector('.registration_form').addEventListener('submit', registration);