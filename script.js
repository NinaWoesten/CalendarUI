import {Calendar} from './Calendar.js';
const backendUrl = 'https://localhost:7253/api/Calendar';

$(() =>{
    new Calendar().setup();

});

function saveAppointment() {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const description = document.getElementById('description').value;

    const appointment = {
        title: title,
        date: date,
        startTime: startTime,
        endTime: endTime,
        description: description,
    };

    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Appointment saved:', data);
        // Update the UI to display the appointment
        displayAppointment(data);
    })
    .catch(error => console.error('Error:', error));
}

function displayAppointment(appointment) {
    const calendar = document.getElementById('calendar');
    const appointmentElement = document.createElement('div');
    appointmentElement.textContent = `Title: ${appointment.title}, Date: ${appointment.date}, Time: ${appointment.startTime} - ${appointment.endTime}, Description: ${appointment.description}`;
    calendar.appendChild(appointmentElement);
}