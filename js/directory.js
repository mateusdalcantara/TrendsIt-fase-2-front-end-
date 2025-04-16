document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const pageSize = 12;
  let currentFilters = {};


  async function loadDirectory(reset = true) {
    try {
        const response = await makeAuthenticatedRequest(`/api/users?${params}`);
        const { users, total } = await response.json();

        const container = document.getElementById('directoryContainer');
        
        if (reset) container.innerHTML = '';

        container.innerHTML += users.map(user => `
            <div class="directory-card" 
                 role="article" 
                 aria-labelledby="user-${user.id}">
                <img src="${user.avatar || 'assets/default-avatar.png'}" 
                     class="user-avatar" 
                     alt="Profile picture of ${user.fullName}">
                <h4 id="user-${user.id}" aria-level="2">${user.fullName}</h4>
                <p>${user.department}</p>
                <div class="directory-actions">
                    <button class="btn-message" 
                            aria-label="Message ${user.fullName}"
                            onclick="openMessageModal('${user.id}')">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn-connect" 
                            aria-label="Connect with ${user.fullName}"
                            onclick="sendConnectionRequest('${user.id}')">
                        ${user.isConnected ? 'Connected' : 'Connect'}
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showError('Failed to load directory: ' + error.message);
    }
}


async function loadDirectory(page = 1) {
  return makeAuthenticatedRequest(
    `/api/users?page=${page}&pageSize=10`
  );
}

  // Initial load
  loadDirectory();

  // Search handler
  document.getElementById('searchInput').addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      currentPage = 1;
      loadDirectory();
  });

  // Filter handlers
  document.getElementById('filterDepartment').addEventListener('change', (e) => {
      currentFilters.department = e.target.value;
      currentPage = 1;
      loadDirectory();
  });

  document.getElementById('filterStatus').addEventListener('change', (e) => {
      currentFilters.status = e.target.value;
      currentPage = 1;
      loadDirectory();
  });

  // Load more handler
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
      currentPage++;
      loadDirectory(false);
  });

  async function loadDirectory(reset = true) {
      try {
          const params = new URLSearchParams({
              page: currentPage,
              pageSize,
              ...currentFilters
          });

          const response = await makeAuthenticatedRequest(`/api/users?${params}`);
          const { users, total } = await response.json();

          const container = document.getElementById('directoryContainer');
          
          if (reset) {
              container.innerHTML = '';
          }

          container.innerHTML += users.map(user => `
              <div class="directory-card">
                  <img src="${user.avatar || 'assets/default-avatar.png'}" class="user-avatar">
                  <h4>${user.fullName}</h4>
                  <p>${user.department}</p>
                  ${user.status ? `<p class="status">${user.status}</p>` : ''}
                  <div class="directory-actions">
                      <button class="btn-message" onclick="openMessageModal('${user.id}')">
                          <i class="fas fa-envelope"></i>
                      </button>
                      <button class="btn-connect" onclick="sendConnectionRequest('${user.id}')">
                          ${user.isConnected ? 'Connected' : 'Connect'}
                      </button>
                  </div>
              </div>
          `).join('');

          document.getElementById('loadMoreBtn').style.display = 
              (currentPage * pageSize) < total ? 'block' : 'none';

      } catch (error) {
          showError('Failed to load directory: ' + error.message);
      }
  }
});

// Connection request handler
async function sendConnectionRequest(userId) {
  try {
      await makeAuthenticatedRequest(`/api/connections/${userId}`, 'POST');
      showError('Connection request sent!', 'success');
  } catch (error) {
      showError(error.message);
  }
}

// Message modal handler
function openMessageModal(userId) {
  document.getElementById('connectionModal').style.display = 'flex';
  // Implement message sending logic here
}