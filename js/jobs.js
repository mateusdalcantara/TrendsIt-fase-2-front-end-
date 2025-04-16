document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const pageSize = 10;
  let currentFilters = {};

  // Initial load
  loadJobs();

  // Job creation
  document.getElementById('createJobBtn').addEventListener('click', () => {
      document.getElementById('jobModal').style.display = 'flex';
  });

  // Job form submission
  document.getElementById('jobForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = e.submitter;
      
      const jobData = {
          title: document.getElementById('jobTitle').value,
          company: document.getElementById('jobCompany').value,
          description: document.getElementById('jobDescription').value,
          location: document.getElementById('jobLocation').value,
          type: document.getElementById('jobType').value,
          salary: document.getElementById('jobSalary').value || null
      };

      try {
          await makeAuthenticatedRequest(
              '/api/jobs',
              'POST',
              jobData,
              submitButton
          );
          document.getElementById('jobModal').style.display = 'none';
          loadJobs();
      } catch (error) {
          showError(error.message);
      }
  });

  // Search/filter handlers
  document.getElementById('jobSearch').addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      currentPage = 1;
      loadJobs();
  });

  document.getElementById('filterJobType').addEventListener('change', (e) => {
      currentFilters.type = e.target.value;
      currentPage = 1;
      loadJobs();
  });

  document.getElementById('filterLocation').addEventListener('change', (e) => {
      currentFilters.location = e.target.value;
      currentPage = 1;
      loadJobs();
  });

  async function loadJobs() {
      try {
          const params = new URLSearchParams({
              page: currentPage,
              pageSize,
              ...currentFilters
          });

          const response = await makeAuthenticatedRequest(`/api/jobs?${params}`);
          const { jobs, total } = await response.json();

          const container = document.getElementById('jobsContainer');
          container.innerHTML = jobs.map(job => `
              <div class="job-card">
                  <span class="job-type">${job.type}</span>
                  <h3>${job.title}</h3>
                  <div class="job-meta">
                      <span>${job.company}</span>
                      <span>${job.location}</span>
                  </div>
                  <p>${job.description.substring(0, 100)}...</p>
                  ${job.salary ? `<div class="salary">$${job.salary.toLocaleString()}/year</div>` : ''}
                  <button class="btn-apply" onclick="applyJob('${job.id}')">
                      ${job.applied ? 'Applied' : 'Apply Now'}
                  </button>
              </div>
          `).join('');
      } catch (error) {
          showError('Failed to load jobs: ' + error.message);
      }
  }
});

// Job application handler
async function applyJob(jobId) {
  try {
      const response = await makeAuthenticatedRequest(
          `/api/jobs/${jobId}/apply`,
          'POST'
      );
      
      if (response.ok) {
          const btn = document.querySelector(`button[onclick="applyJob('${jobId}')]`);
          btn.textContent = 'Applied';
          btn.disabled = true;
      }
  } catch (error) {
      showError(error.message);
  }
}