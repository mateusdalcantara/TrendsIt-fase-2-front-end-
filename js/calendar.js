function submitEvent() {
  const eventData = {
      title: document.getElementById('eventTitle').value,
      description: document.getElementById('eventDescription').value,
      date: document.getElementById('eventDate').value
  };
  makeAuthenticatedRequest('/api/events', 'POST', eventData);
}

document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: '/api/events',
      eventClick: function(info) {
          showEventModal(info.event);
      }
  });
  calendar.render();
});