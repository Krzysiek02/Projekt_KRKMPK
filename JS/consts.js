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
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 6,
    },
    {
        id: 2,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 3,
    },
    {
        id: 3,
        client_type: 'normalny',
        quantity_type: 'grupowy',
        family: false,
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 60,
        price: 50,
    },
    {
        id: 4,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 20,
        price: 4,
    },
    {
        id: 5,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 20,
        price: 2,
    },
    {
        id: 6,
        client_type: 'ulgowy',
        quantity_type: 'grupowy',
        family: false,
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 60,
        price: 25,
    },
    {
        id: 7,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 90,
        price: 8,
    },
    {
        id: 8,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 90,
        price: 4,
    },
    {
        id: 9,
        client_type: 'normalny',
        quantity_type: 'grupowy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 60,
    },
    {
        id: 10,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 1440,
        price: 17,
    },
    {
        id: 11,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 1440,
        price: 8.50,
    },
    {
        id: 12,
        client_type: 'ulgowy',
        quantity_type: 'grupowy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 60,
        price: 30,
    },
    {
        id: 13,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 1440,
        price: 22,
    },
    {
        id: 14,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 1440,
        price: 11,
    },
    {
        id: 15,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK_KMŁ',
        zone: 'all',
        travel_time: 70,
        price: 7,
    },
    {
        id: 16,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 2880,
        price: 35,
    },
    {
        id: 17,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 2880,
        price: 17.50,
    },
    {
        id: 18,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 4320,
        price: 50,
    },
    {
        id: 19,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 4320,
        price: 25,
    },
    {
        id: 20,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 10080,
        price: 56,
    },
    {
        id: 21,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'first',
        travel_time: 10080,
        price: 28,
    },
    {
        id: 22,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 10080,
        price: 68,
    },
    {
        id: 23,
        client_type: 'ulgowy',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 10080,
        price: 34,
    },
    {
        id: 24,
        client_type: 'normalny',
        quantity_type: 'pojedynczy',
        family: false,
        ticket_type: 'MPK_KMŁ',
        zone: 'all',
        travel_time: 70,
        price: 3.50,
    },
    {
        id: 25,
        client_type: 'normalny',
        quantity_type: 'grupowy',
        family: true,
        ticket_type: 'MPK',
        zone: 'all',
        travel_time: 4320,
        price: 25,
    },
]

function ticket_name_change(ticket_string) {
    const first_letter = ticket_string[0].toUpperCase();
    const rest_of_text = ticket_string.slice(1);
    return first_letter + rest_of_text; 
}

// Function to produce ticket names
function ticket_name(ticket) {
    const name = ticket_name_change(ticket.client_type);
    let time;
    if (ticket.travel_time == 1440) {
        time = '24 h';
    } else if (ticket.travel_time == 2880) {
        time = '48 h';
    } else if (ticket.travel_time == 4320) {
        time = '72 h';
    } else if (ticket.travel_time == 10080) {
        time = '7 dni';
    } else {
        time = `${ticket.travel_time} minut`;
    }
    const zone = ticket.zone === 'first' ? 'Strefa 1' : 'Strefa 1 + 2 + 3'
    const quantity_type = ticket_name_change(ticket.quantity_type);
    return `${name} ${time} ${zone} ${quantity_type}`;
}

// Update tickets with names
const tickets = base_tickets.map(ticket => ({
    ...ticket,
    name: ticket_name(ticket)
}));

// Choosen tickets to buy
const selectedTicketsToBuy = JSON.parse(localStorage.getItem('selectedTicketsToBuy')) || [];