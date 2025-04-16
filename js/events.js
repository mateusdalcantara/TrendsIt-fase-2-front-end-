document.addEventListener('DOMContentLoaded', () => {
  const eventForm = document.getElementById('eventForm');

  eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = e.submitter;
      
      const eventData = {
          title: document.getElementById('eventTitle').value,
          description: document.getElementById('eventDescription').value,
          date: new Date(document.getElementById('eventDate').value).toISOString()
      };

      try {
          const response = await makeAuthenticatedRequest(
              '/api/events', 
              'POST', 
              eventData,
              submitButton
          );

          if (response.ok) {
              document.getElementById('eventModal').style.display = 'none';
              eventForm.reset();
              
              // Refresh calendar if on calendar page
              if (window.location.pathname.includes('calendar.html')) {
                  window.location.reload();
              }
          }
      } catch (error) {
          showError(error.message);
      }
  });
});