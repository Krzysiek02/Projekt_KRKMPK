const users = JSON.parse(localStorage.getItem('users')) || [];
const loggedInUser = users.find(user => user.isLoggedIn);

// Function to validate form inputs
function validateInput(field, value) {
    const validationRules = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        cardNumber: /^\d{4} ?\d{4} ?\d{4} ?\d{4}$/,
        expiryDate: /^(0[1-9]|1[0-2])\/\d{2}$/,
        csv: /^\d{3}$/
    };

    if (field === 'expiryDate') {
        const [month, year] = value.split('/').map(Number);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }
    }

    return validationRules[field] ? validationRules[field].test(value) : true;
}

// Adding functionality to buttons
function addEventListeners(user) {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    const fields = ['email', 'card-Number', 'expiry-Date', 'csv'];

    editButton.addEventListener('click', () => {
        fields.forEach(field => {
            const element = document.getElementById(field);
            const input = document.createElement('input');
            input.type = 'text';
            input.value = element.textContent;
            input.id = `${field}-input`;
            element.replaceWith(input);
        });
        editButton.style.display = 'none';
        saveButton.style.display = 'inline';
        cancelButton.style.display = 'inline';
    });

    saveButton.addEventListener('click', () => {
        let isValid = true;

        fields.forEach(field => {
            const input = document.getElementById(`${field}-input`);
            const value = input.value;
            if (!validateInput(field.replace('-', ''), value)) {
                alert(`Nieprawidłowe dane dla ${field.replace('-', ' ')}`);
                isValid = false;
                return;
            }
        });

        if (isValid) {
            fields.forEach(field => {
                const input = document.getElementById(`${field}-input`);
                const span = document.createElement('span');
                span.id = field;
                span.textContent = input.value;
                input.replaceWith(span);
                user[field.replace('-', '')] = input.value;
            });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Dane zapisany w sposób prawidłowy');
            editButton.style.display = 'inline';
            saveButton.style.display = 'none';
            cancelButton.style.display = 'none';
            location.reload();
        }
    });

    cancelButton.addEventListener('click', () => {
        fields.forEach(field => {
            const input = document.getElementById(`${field}-input`);
            const span = document.createElement('span');
            span.id = field;
            span.textContent = user[field.replace('-', '')];
            input.replaceWith(span);
        });
        alert('Brak zapisu danych');
        editButton.style.display = 'inline';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    });
};

// Dynamicly rendering logged user
function renderUserProfile(user) {
    const contentContainer = document.querySelector('.div_content_container');
    contentContainer.innerHTML = `
    
        <div id="user-section">
            <h2><span>Moje konto</span></h2>
            <div id="formularz">
                <div id="lewa">
                    <p>Imię: </p>
                    <p>Nazwisko: </p>
                    <p>Email: </p>
                    <p>Numer karty: </p>
                    <p class="krotki">Data ważności: </p>
                    <p class="krotki">CSV: </p>
                </div>
                <div id="prawa">
                    <span id="firstName">${user.firstName}</span>
                    <span id="lastName">${user.lastName}</span>
                    <span id="email">${user.email}</span>
                    <span id="card-Number">${user.cardNumber}</span>
                    <span id="expiry-Date">${user.expiryDate}</span>
                    <span id="csv">${user.csv}</span>
                </div>
            </div>
            <div id="buttons">
            <button id="edit-button">Edytuj</button>
            <button id="cancel-button" style="display: none;">Cofnij</button>
            <button id="save-button" style="display: none; margin-left: 10px;" >Zapisz</button>
            </div>
        </div>
    `;
    addEventListeners(user);
};

// Dynamicly rendering whether user is logged 
function updateContent() {
    if (loggedInUser) {
        renderUserProfile(loggedInUser);
    } else {
        renderUnauthorized();
    }
}

// Add default user on page load
document.addEventListener('DOMContentLoaded', updateContent);