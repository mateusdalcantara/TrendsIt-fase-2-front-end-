// home.js - Main Feed Controller
document.addEventListener('DOMContentLoaded', async () => {
  // Authentication Check
  if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
    return;
  }

  // DOM Elements
  const elements = {
    postsContainer: document.getElementById('postsContainer'),
    postForm: document.getElementById('postForm'),
    postTitle: document.getElementById('postTitle'),
    postContent: document.getElementById('postContent'),
    createPostBtn: document.getElementById('createPostBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    profileBtn: document.getElementById('profileBtn'),
    loader: document.getElementById('loader')
  };

  // State
  let currentUser = JSON.parse(localStorage.getItem('user'));
  let posts = [];

  // Initialize
  toggleLoader(true);
  await loadPosts();
  setupEventListeners();
  updateProfileButton();

  // ------------------
  // Core Functionality
  // ------------------

  async function loadPosts() {
    try {
      const response = await makeAuthenticatedRequest('/api/post');
      if (!response.ok) throw new Error('Failed to load posts');
      
      posts = await response.json();
      renderPosts();
    } catch (error) {
      showError(error.message);
    } finally {
      toggleLoader(false);
    }
  }

  async function createPost(postData) {
    try {
      const response = await makeAuthenticatedRequest('/api/post', 'POST', postData);
      if (!response.ok) throw new Error('Failed to create post');
      
      await loadPosts();
      resetForm();
    } catch (error) {
      throw error;
    }
  }

  // ------------------
  // UI Interactions
  // ------------------

  function renderPosts() {
    elements.postsContainer.innerHTML = posts.map(post => `
      <article class="post-card" data-post-id="${post.id}">
        <header class="post-header">
          <img src="${post.autor?.avatar || 'default-avatar.png'}" 
               alt="${post.autor?.username}'s avatar" 
               class="post-avatar">
          <div>
            <h3 class="post-author">${post.autor?.username}</h3>
            <time class="post-date">
              ${new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
        </header>
        <div class="post-body">
          <h4 class="post-title">${post.titulo}</h4>
          <p class="post-content">${post.conteudo}</p>
        </div>
        <footer class="post-footer">
          <button class="btn-like" aria-label="Like post">
            <span>❤️ ${post.likes || 0}</span>
          </button>
          <button class="btn-comment" aria-label="Comment">
            <span>💬 ${post.comentarios?.length || 0}</span>
          </button>
        </footer>
      </article>
    `).join('');
  }

  function setupEventListeners() {
    // Post Creation
    elements.postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = elements.createPostBtn;
      
      try {
        toggleButtonState(button, true);
        await createPost({
          titulo: elements.postTitle.value,
          conteudo: elements.postContent.value
        });
      } catch (error) {
        showError(error.message);
      } finally {
        toggleButtonState(button, false);
      }
    });

    // Logout
    elements.logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });

    // Profile Click
    elements.profileBtn.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }

  // ------------------
  // Utility Functions
  // ------------------

  function toggleButtonState(button, isLoading) {
    button.disabled = isLoading;
    button.innerHTML = isLoading
      ? `<div class="spinner"></div> Posting...`
      : 'Create Post';
  }

  function toggleLoader(show) {
    elements.loader.style.display = show ? 'block' : 'none';
    elements.postsContainer.style.visibility = show ? 'hidden' : 'visible';
  }

  function resetForm() {
    elements.postForm.reset();
    elements.postTitle.focus();
  }

  function updateProfileButton() {
    if (currentUser?.avatar) {
      elements.profileBtn.innerHTML = `
        <img src="${currentUser.avatar}" 
             alt="Your profile" 
             class="profile-avatar">
      `;
    } else {
      elements.profileBtn.innerHTML = `
        <i class="fas fa-user"></i>
        ${currentUser?.username || 'Profile'}
      `;
    }
  }

  function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'global-error';
    errorEl.textContent = message;
    
    document.body.prepend(errorEl);
    setTimeout(() => errorEl.remove(), 5000);
  }

  // ------------------
  // API Abstraction
  // ------------------

  async function makeAuthenticatedRequest(url, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    if (body) config.body = JSON.stringify(body);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      }

      return response;
    } catch (error) {
      throw new Error('Network error - please check your connection');
    }
  }
});