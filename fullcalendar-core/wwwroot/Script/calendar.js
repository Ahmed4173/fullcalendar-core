let currentFilter = 'eventName'; // Default filter

const formatDate = date => date === null ? '' : moment(date).format("MM/DD/YYYY h:mm A");

$('#calendar').fullCalendar({
    locale: 'it', // Set the locale to Italian
    defaultView: 'agendaDay',
    height: 'parent',
    header: {
        left: 'prev,next today, separator,month,agendaWeek,agendaDay',
        center: 'title',
        right: 'locationFilter,attendeeFilter,eventNameFilter' // Add custom buttons here
    },
    customButtons: {
        locationFilter: {
            text: 'Location',
            click: function () {
                currentFilter = 'location';
                $('#calendar').fullCalendar('rerenderEvents');
            }
        },
        attendeeFilter: {
            text: 'Collaboratore',
            click: function () {
                currentFilter = 'attendee';
                $('#calendar').fullCalendar('rerenderEvents');
            }
        },
        eventNameFilter: {
            text: 'Evento',
            click: function () {
                currentFilter = 'eventName';
                $('#calendar').fullCalendar('rerenderEvents');
            }
        }
    },
    eventRender(event, $el) {
        // Set the title based on the current filter
        let displayTitle;
        if (currentFilter === 'location') {
            displayTitle = event.location || 'N/A';
        } else if (currentFilter === 'attendee') {
            displayTitle = event.atandee || 'N/A';
        } else if (currentFilter === 'eventName') {
            displayTitle = event.title || 'N/A';
        }
        $el.find('.fc-title').text(displayTitle);

        // Initial tooltip content
        let tooltipContent = `
            <b>Descrizione:</b> ${event.description}<br>
            <b>Tipo:</b> ${event.eventType}<br>
            <b>Ora di inizio:</b> ${formatDate(event.start)}<br>
            <b>Ora di fine:</b> ${formatDate(event.end)}<br>
            <b>Tutto il giorno:</b> ${event.allDay ? 'Sì' : 'No'}<br>
            <b>Luogo:</b> ${event.location || 'N/A'}<br>
            <b>Partecipanti:</b> ${event.attendees ? `${event.attendees.length}/${event.maxAttendees}` : '0/0'}<br>
            <b>Organizzatore:</b> ${event.organizer}<br>
            <b>No. di Atande:</b> ${event.noOfAtande}<br>
            <b>Atandee:</b> ${event.atandee}<br>
            <b>Partecipanti:</b> ${"per vedere i dettagli dei partecipanti clicca sull'evento"}
            
        `;

        $el.qtip({
            content: {
                title: event.title, // Keep original title for tooltip
                text: tooltipContent
            },
            hide: {
                event: 'mouseleave'
            },
            show: {
                solo: true
            },
            position: {
                my: 'top left',
                at: 'bottom left',
                viewport: $('#calendar-wrapper'),
                adjust: {
                    method: 'shift'
                }
            }
        });

        // Set the background color based on event type
        const color = getColorForEventType(event.eventType);
        $el.css('background-color', color);
        $el.css('border-color', color);

        // Fetch attendees and update tooltip content
        $.ajax({
            url: '/Home/GetAttendees',
            type: 'GET',
            data: { eventId: event.id },
            success: function (response) {
                let attendeesHTML = '';
                response.attendees.forEach(attendee => {
                    attendeesHTML += `<tr>
                        <td>${attendee.name}</td>
                        <td>${attendee.surname}</td>
                        <td>${attendee.email}</td>
                        <td>${attendee.phone}</td>
                    </tr>`;
                });

                $(`#attendeeList_${event.id}`).html(attendeesHTML);
            },
            error: function () {
                alert("Errore nel recupero dei partecipanti");
            }
        });
    },
    events: '/Home/GetCalendarEvents',
    eventClick: viewEventDetails // Change to viewEventDetails for read-only modal
});

/**
 * Calendar Methods
 **/

function viewEventDetails(event) {
    currentEvent = event;

    $('#eventDetailsModalLabel').html('Dettagli dell\'evento');
    $('#EventDetailsTitle').html(event.title);
    $('#EventDetailsDescription').html(event.description);
    $('#EventDetailsType').html(event.eventType);
    $('#EventDetailsStartTime').html(formatDate(event.start) + "-" + formatDate(event.end));
    $('#EventDetailsEndTime').html(formatDate(event.end));
    $('#EventDetailsAllDay').html(event.allDay ? 'Sì' : 'No');
    $('#EventDetailsLocation').html(event.location || 'N/A'); // Add location if available
    $('#EventDetailsAttendees').html(event.attendees ? `${event.attendees.length}/${event.maxAttendees}` : '0/0');
    $('#EventDetailsOrganizer').html(event.organizer);
    $('#EventDetailsNoOfAtande').html(event.noOfAtande);
    $('#EventDetailsattendee').html(event.atandee);
    $('#EventDetailsType1').html(event.eventType);

    // Clear and append attendee list
    const attendeeList = $('#attendeeList');
    attendeeList.empty();

    $.ajax({
        url: '/Home/GetAttendees',
        type: 'GET',
        data: { eventId: event.id },
        success: function (response) {
            response.attendees.forEach(attendee => {
                attendeeList.append(`<tr>
                    <td>${attendee.name}</td>
                    <td>${attendee.surname}</td>
                    <td>${attendee.email}</td>
                    <td>${attendee.phone}</td>
                </tr>`);
            });
        },
        error: function () {
            alert("Errore nel recupero dei partecipanti");
        }
    });

    $('#eventDetailsModal').modal('show');
}

$(document).on('click', '#manageBookingsButton', function () {
    if (currentEvent) {
        $.ajax({
            url: '/Home/ManageBookings',
            type: 'POST',
            data: { eventId: currentEvent.eventId },
            success: function (response) {
                if (response.redirectUrl) {
                    window.location.href = response.redirectUrl;
                } else {
                    alert("Impossibile ottenere l'URL di reindirizzamento");
                }
            },
            error: function () {
                alert("Errore nella gestione delle prenotazioni");
            }
        });
    }
});

/**
 * Utility Methods
 **/

function getColorForEventType(eventType) {
    switch (eventType) {
        case "Meeting":
            return "#ff0000"; // Rosso
        case "Task":
            return "#00ff00"; // Verde
        case "Reminder":
            return "#0000ff"; // Blu
        default:
            return "#808080"; // Grigio per altri tipi
    }
}
