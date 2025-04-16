document.addEventListener('DOMContentLoaded', () => {
  loadGroups();
  
  document.getElementById('createGroupBtn').addEventListener('click', () => {
      document.getElementById('groupModal').style.display = 'flex';
  });

  document.getElementById('groupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = e.submitter;
      
      const groupData = {
          name: document.getElementById('groupName').value,
          description: document.getElementById('groupDescription').value
      };

      try {
          await makeAuthenticatedRequest(
              '/api/groups',
              'POST',
              groupData,
              submitButton
          );
          document.getElementById('groupModal').style.display = 'none';
          loadGroups();
      } catch (error) {
          showError(error.message);
      }
  });
});

async function loadGroups() {
  try {
      const response = await makeAuthenticatedRequest('/api/groups');
      const groups = await response.json();
      
      const container = document.getElementById('groupsContainer');
      container.innerHTML = groups.map(group => `
          <div class="group-card">
              <h3>${group.name}</h3>
              <p>${group.description}</p>
              <div class="group-meta">
                  <span>${group.membersCount} members</span>
                  <span>Created ${new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="group-actions">
                  <button class="btn-primary">Join Group</button>
                  <button class="btn-secondary">View Details</button>
              </div>
          </div>
      `).join('');
  } catch (error) {
      showError('Failed to load groups: ' + error.message);
  }
}