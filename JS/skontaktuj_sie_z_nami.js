// Counter for message
const messageField = document.getElementById('message');
const charCounter = document.getElementById('charCounter');

messageField.addEventListener('input', () => {
  const currentLength = messageField.value.length;
  charCounter.textContent = `${currentLength}/1000`;
});

// Function for validate message form
function validateForm() {
  const fields = [
    { id: 'firstName', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Imię może zawierać tylko litery i maksymalnie 50 znaków.' },
    { id: 'lastName', regex: /^[a-zA-Ząćęłńóśżź]{1,50}$/, error: 'Nazwisko może zawierać tylko litery i maksymalnie 50 znaków.' },
    { id: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Wprowadź poprawny adres email.' },
    { id: 'phone', regex: /^\d{3} ?\d{3} ?\d{3}$/, error: 'Numer telefonu musi zawierać 9 cyfr.' },
    { id: 'message', regex: /^.{1,1000}$/, error: 'Treść wiadomości nie może być pusta i musi zawierać maksymalnie 1000 znaków.' }
  ];

  let isValid = true;

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const errorElement = document.getElementById(`${field.id}-error`);

    input.style.border = '';
    if (errorElement) errorElement.remove();

    if (!field.regex.test(input.value.trim())) {
      isValid = false;
      input.style.border = '2px solid red';
      const errorMessage = document.createElement('div');
      errorMessage.id = `${field.id}-error`;
      errorMessage.style.color = 'red';
      errorMessage.textContent = field.error;
      input.insertAdjacentElement('afterend', errorMessage);
    }
  });

  return isValid;
}

// Function to save form data to localStorage
function saveMessage(message) {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
}

// Attach event listener to the form
document.getElementById('contactForm').addEventListener('submit', function (event) {
  event.preventDefault();

  if (validateForm()) {
    const message = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    saveMessage(message);
    alert('Twoja wiadomość została wysłana pomyślnie!');
    this.reset();
    charCounter.textContent = '0/1000';
    location.reload();
  }
});

// Validation forms
console.log(JSON.parse(localStorage.getItem('messages')));