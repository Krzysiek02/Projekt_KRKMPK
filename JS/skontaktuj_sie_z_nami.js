// Counter for message
const messageField = document.querySelector('.message');
const charCounter = document.querySelector('.char_counter');

messageField.addEventListener('input', () => {
  const currentLength = messageField.value.length;
  charCounter.textContent = `${currentLength}/1000`;
});

// Function for validate message form
function validateForm() {
  const fields = [
    { class: 'first_name', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Imię może zawierać tylko litery i maksymalnie 50 znaków.' },
    { class: 'last_name', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Nazwisko może zawierać tylko litery i maksymalnie 50 znaków.' },
    { class: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Wprowadź poprawny adres email.' },
    { class: 'phone', regex: /^\d{3} ?\d{3} ?\d{3}$/, error: 'Numer telefonu musi zawierać 9 cyfr.' },
    { class: 'message', regex: /^.{1,1000}$/, error: 'Treść wiadomości nie może być pusta i musi zawierać maksymalnie 1000 znaków.' }
  ];

  let isValid = true;

  fields.forEach(field => {
    const input = document.querySelector(`.${field.class}`);
    const errorElement = document.querySelector(`.${field.class}_error`);

    input.style.border = '';
    if (errorElement) {
      errorElement.remove();
      console.log("xd");
    }

    if (!field.regex.test(input.value.trim())) {
      isValid = false;
      input.style.border = '2px solid red';
      const errorMessage = document.createElement('div');
      errorMessage.className = `${field.class}_error`;
      errorMessage.style.color = 'red';
      errorMessage.textContent = field.error;
      input.insertAdjacentElement('afterend', errorMessage);
      console.log("xd1");
    }
  });

  return isValid;
}

// Function to save form data to localStorage
function saveMessage(message) {
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
}

// Function for messaging

function message(event) {
  event.preventDefault();

  if (validateForm()) {
    const message = {
      firstName: document.querySelector('.first_name').value.trim(),
      lastName: document.querySelector('.last_name').value.trim(),
      email: document.querySelector('.email').value.trim(),
      phone: document.querySelector('.phone').value.trim(),
      message: document.querySelector('.message').value.trim()
    };

    saveMessage(message);
    alert('Twoja wiadomość została wysłana pomyślnie!');
    this.reset();
    charCounter.textContent = '0/1000';
    window.location.href = '../HTML/inteligentny_zakup_biletu.html';
  }
}

// Attach event listener to the form
document.querySelector('.contact_form').addEventListener('submit', message);