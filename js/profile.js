document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  
  // Load Profile Data
  async function loadProfile() {
      try {
          const response = await makeAuthenticatedRequest('/auth/me');
          const user = await response.json();
          
          document.getElementById('profileUsername').value = user.username;
          document.getElementById('profileEmail').value = user.email;
      } catch (error) {
          showError('Failed to load profile');
      }
  }

  // Save Profile Data
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.submitter;
    
    const updateData = {
        username: document.getElementById('profileUsername').value,
        email: document.getElementById('profileEmail').value
    };

    try {
        await makeAuthenticatedRequest(
            '/auth/profile', 
            'PUT', 
            updateData,
            submitButton
        );
        
        // Refresh profile display
        const profileBtn = document.getElementById('profileBtn');
        profileBtn.innerHTML = `<i class="fas fa-user"></i> ${updateData.username}`;
        document.getElementById('profileModal').style.display = 'none';
    } catch (error) {
        showError(error.message);
    }
});

document.getElementById('avatarInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      await uploadAvatar(file);
    } catch (error) {
      showError('Avatar upload failed: ' + error.message);
    }
  }
});

async function updateProfile(profileData) {
  return makeAuthenticatedRequest('/profiles/atualizar-meu-perfil', 'PUT', profileData);
}

  // Initial load
  loadProfile();
});