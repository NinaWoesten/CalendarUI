const dayInMilliseconds = 1000 * 60 * 60 * 24;
const backendUrl = 'https://localhost:7253/api/Calendar';

export class Calendar {

    constructor() {
        this.startOfWeek = null;
        this.endOfWeek = null;
        this.weekOffSet = 0;
        this.appointments = [];
    }

    setup() {
        console.log("working...");
        this.setupTimes();
        this.setupDays();
        this.calculateCurrentWeek();
        this.displayWeek();
        this.setupControl();
        this.setupSaveButton();
    }

    setupTimes() {
        const header = $("<div></div>").addClass("calendar-header");
        const slots = $("<div></div>").addClass("calendar-slots");
        for (let hour = 0; hour < 24; hour++) {
            $("<div></div>").attr("hour", hour).addClass("timestamp")
                .text(`${hour}:00 - ${hour + 1}:00`)
                .appendTo(slots);
        }
        $(".timeTable").append(header).append(slots);
    }

    setupDays() {
        const call = this;
        $(".day").each(function () {
            const dayIndex = parseInt($(this).attr("dayIndex"));
            const name = $(this).attr("data-name");
            const header = $("<div></div>").addClass("calendar-header").text(name);
            $("<div></div>").addClass("displayDay").appendTo(header);
            const slots = $("<div></div>").addClass("slots");
            $("<div></div>").addClass("dayDisplay").appendTo(header);
            for (let hour = 0; hour < 24; hour++) {
                $("<div></div>").attr("hour", hour)
                    .appendTo(slots)
                    .addClass("slot")
                    .click(() => call.clickSlot(hour, dayIndex))
                    .hover(() => call.hoverOver(hour),
                        () => call.hoverOut());
            }
            $(this).append(header).append(slots);
        });
    }

    addAppointment(title, date, startTime, endTime, description) {
        const appointment = {
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime,
            description: description,
        };

        fetch(backendUrl, {
            method: 'POST',
            body: JSON.stringify(appointment),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Appointment saved:', data);
                this.displayAppointment(data);
            })
            .catch(error => console.error('Error:', error));
    }

    setupSaveButton() {
        const saveButton = document.getElementById('btnSave');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const title = $("#title").val();
                const date = $("#appointmentDate").val();
                const startTime = $("#appointmentStartTime").val();
                const endTime = $("#appointmentEndTime").val();
                const description = $("#appointmentDesc").val();

                this.addAppointment(title, date, startTime, endTime, description);
            });
        }
    }

    displayAppointments(appointment) {
        const calendar = document.getElementById('calendar');
        const appointmentElement = document.createElement('div');
        appointmentElement.textContent = `Title: ${appointment.title}, Date: ${appointment.date}, Time: ${appointment.startTime} - ${appointment.endTime}, Description: ${appointment.description}`;
        calendar.appendChild(appointmentElement);
    }


    clickSlot(hour, dayIndex) {
        console.log("click", hour, dayIndex);
    }

    hoverOver(hour) {
        console.log("Hover", hour)
    }

    hoverOut() {
        console.log("Hover out");
    }
    addDays(date, numberOfDays) {
        return new Date(date.getTime() + numberOfDays * dayInMilliseconds);
    }
    getDayIndex(date) {
        const falseIndex = date.getDate();
        return falseIndex == 0 ? 6 : falseIndex - 1; 
    }
    calculateCurrentWeek() { 
        const currentDay = new Date();
        this.startOfWeek = this.addDays(currentDay, -this.getDayIndex(currentDay));
        this.endOfWeek = this.addDays(this.startOfWeek, 6);
    }
    displayWeek() {
        const options ={
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
        }
    
        $("#displayStartOfWeek").text(this.startOfWeek.toLocaleDateString(undefined, options));
        $("#displayEndOfWeek").text(this.endOfWeek.toLocaleDateString(undefined, options));
    
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = this.addDays(this.startOfWeek, dayIndex); 
            const display = date.toLocaleDateString(undefined, {
                month: "2-digit",
                day: "2-digit"
            });
                const elementSelector = `.day[dayIndex=${dayIndex}] .calendar-header .displayDay`;
                const displayDayElement = $(elementSelector)
                displayDayElement.text(display);
        }
        if(this.weekOffSet == 0) {
            this.displayCurrentDay();
        }else{
            this.hideCurrentDay();
        }
    }
    setupControl(){
        $("#nextWeek").click(() => this.changeWeek(1));
        $("#preWeek").click(() => this.changeWeek(-1));
        $("#btnSave").click((event) => this.saveButton(event));
    }
    changeWeek(number) {
        this.startOfWeek = this.addDays(this.startOfWeek, 7 * number);
        this.endOfWeek = this.addDays(this.endOfWeek, 7 * number);
        this.weekOffSet += number;
        this.displayWeek();
    }
    
    displayCurrentDay(){
        const now = new Date ();
        const dayIndex = this.getDayIndex(now);
        $(`.day[dayIndex=${dayIndex}]`).addClass("currentDay");
    }
    hideCurrentDay() {
        $(".day").removeClass("currentDay");
    }
    addAppointment(appointment) {
        this.appointments.push(appointment);
        this.displayAppointments();
    }

    deleteAppointment(appointmentIndex) {
        this.appointments.splice(appointmentIndex, 1);
        this.displayAppointments();
    }

    saveButton() {
        const title = $("#title").val();
        const date = $("#appointmentDate").val();
        const startTime = $("#appointmentStartTime").val();
        const endTime = $("#appointmentEndTime").val();
        const description = $("#appointmentDesc").val();

        const appointment = {
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime,
            description: description
        };

        this.addAppointment(appointment);
    }


    displayAppointment(appointment) {
        const selector = `.day[data-name=${appointment.date}] .slots .slot[hour=${appointment.startTime}]`;
        $(selector).addClass("has-appointment");
    }
}

