document.addEventListener('DOMContentLoaded', () => {
  loadPrograms();

  document.getElementById('filterCategory').addEventListener('change', (e) => {
      loadPrograms(e.target.value);
  });

  // Enrollment form handler
  document.getElementById('enrollmentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = e.submitter;
      
      const applicationData = {
          programId: document.getElementById('enrollmentModal').dataset.programId,
          motivation: e.target.querySelector('textarea').value
      };

      try {
          await makeAuthenticatedRequest(
              '/api/training/enroll',
              'POST',
              applicationData,
              submitButton
          );
          document.getElementById('enrollmentModal').style.display = 'none';
          showError('Application submitted successfully!', 'success');
      } catch (error) {
          showError(error.message);
      }
  });
});

async function loadPrograms(category = '') {
  try {
      const response = await makeAuthenticatedRequest(`/api/training?category=${category}`);
      const programs = await response.json();

      const container = document.getElementById('programsContainer');
      container.innerHTML = programs.map(program => `
          <div class="program-card">
              <span class="program-status">${program.status}</span>
              <h3>${program.title}</h3>
              <div class="program-details">
                  <div class="program-meta">
                      <span>Duration: ${program.duration}</span>
                      <span>Seats: ${program.availableSeats}</span>
                  </div>
                  <p>${program.description}</p>
                  <div class="program-actions">
                      <button class="btn-primary" 
                              onclick="showProgramDetails('${program.id}')">
                          ${program.enrolled ? 'View Progress' : 'Enroll Now'}
                      </button>
                  </div>
              </div>
          </div>
      `).join('');
  } catch (error) {
      showError('Failed to load programs: ' + error.message);
  }
}

function showProgramDetails(programId) {
  // Fetch detailed program info and show modal
  document.getElementById('enrollmentModal').style.display = 'flex';
  document.getElementById('enrollmentModal').dataset.programId = programId;
}