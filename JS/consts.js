// Users
const users = JSON.parse(localStorage.getItem('users')) || [];

// Messages
const messages = JSON.parse(localStorage.getItem('messages')) || [];

// Base Tickets
const base_tickets = [
    {
        id: 1,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 6,
    },
    {
        id: 2,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 3,
    },
    {
        id: 3,
        client_type: 'normalny',
        quantity_type: 'grupowy',
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 60,
        price: 50,
    },
    {
        id: 4,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 20,
        price: 4,
    },
    {
        id: 5,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 20,
        price: 2,
    },
    {
        id: 6,
        client_type: 'ulgowy',
        quantity_type: 'grupowy',
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 60,
        price: 25,
    },
    {
        id: 7,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 90,
        price: 8,
    },
    {
        id: 8,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 90,
        price: 4,
    },
    {
        id: 9,
        client_type: 'normalny',
        quantity_type: 'grupowy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 60,
    },
    {
        id: 10,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 1440,
        price: 17,
    },
    {
        id: 11,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 1440,
        price: 8.50,
    },
    {
        id: 12,
        client_type: 'ulgowy',
        quantity_type: 'grupowy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 30,
    },
    {
        id: 13,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 1440,
        price: 22,
    },
    {
        id: 14,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 1440,
        price: 11,
    },
    {
        id: 15,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        ticket_type: 'MPK_KMŁ',
        zone: 'all',
        travel_time: 70,
        price: 7,
    },
]

// Function to produce ticket names
function ticket_name(ticket) {
    const first_letter = ticket.client_type[0].toUpperCase();
    const rest_of_text = ticket.client_type.slice(1);
    const name = first_letter + rest_of_text; 
    const time = ticket.travel_time === 1440 ? '24 godziny' : `${ticket.travel_time} minut`
    const zone = ticket.zone === 'first' ? 'Strefa 1' : 'Strefa 1 + 2 + 3'
    return `${name} ${time} ${zone}`;
}

// Update tickets with names
const tickets = base_tickets.map(ticket => ({
    ...ticket,
    name: ticket_name(ticket)
}));

// Choosen tickets to buy
const selectedTicketsToBuy = JSON.parse(localStorage.getItem('selectedTicketsToBuy')) || [];