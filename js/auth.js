// auth.js - Authentication Service
const SUPABASE_URL = 'https://fnpiceiegapewhufzlff.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucGljZWllZ2FwZXdodWZ6bGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NzA3NjcsImV4cCI6MjA1NjE0Njc2N30.J4WVxwLVZs-oi9-vfCpjjcDTaLgxNsUqgx0PVaONKbw';
const API_BASE_URL = 'https://your-backend-api.com';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const authForms = {
  login: document.getElementById('loginForm'),
  register: document.getElementById('registerForm'),
  forgot: document.getElementById('forgotForm')
};

// Auth State Listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) throw new Error('Social login verification failed');
      
      const { token, user } = await response.json();
      storeAuthData(token, user);
      redirectAuthenticatedUser();
    } catch (error) {
      showError(error.message, 'social-auth');
    }
  }
});

// Store Authentication Data
function storeAuthData(token, userData) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({
    id: userData.id,
    username: userData.username,
    role: userData.role,
    avatar: userData.avatar
  }));
}

// Login Handler
authForms.login?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = e.submitter;
  const formData = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };

  try {
    toggleButtonState(button, true);
    const response = await handleAuthRequest('/auth/login', formData);
    
    if (response.ok) {
      const { token, userId, username, role } = await response.json();
      storeAuthData(token, { userId, username, role });
      redirectAuthenticatedUser();
    }
  } catch (error) {
    showError(error.message, 'login');
  } finally {
    toggleButtonState(button, false);
  }
});

// Registration Handler
authForms.register?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = e.submitter;
  const formData = {
    email: document.getElementById('registerEmail').value,
    password: document.getElementById('registerPassword').value,
    username: document.getElementById('registerUsername').value
  };

  try {
    toggleButtonState(button, true);
    const response = await handleAuthRequest('/auth/register', formData);
    
    if (response.ok) {
      showError('Registration successful! Please login.', 'success');
      toggleForms('signin');
    }
  } catch (error) {
    handleFormErrors(error.errors || { general: error.message });
  } finally {
    toggleButtonState(button, false);
  }
});

// Password Reset Handler
authForms.forgot?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = e.submitter;
  const email = document.getElementById('resetEmail').value;

  try {
    toggleButtonState(button, true);
    const response = await handleAuthRequest('/auth/forgot-password', { email });
    
    if (response.ok) {
      showError('Password reset instructions sent! Check your email.', 'success');
      toggleForms('signin');
    }
  } catch (error) {
    showError(error.message, 'forgot');
  } finally {
    toggleButtonState(button, false);
  }
});

// Social Login Handlers
window.handleSocialLogin = async (provider) => {
  const button = document.querySelector(`.btn-${provider}`);
  try {
    toggleButtonState(button, true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth-callback.html`,
        scopes: provider === 'microsoft' ? 'User.Read' : ''
      }
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    showError(error.message, 'social');
  } finally {
    toggleButtonState(button, false);
  }
};

// Token Validation
export async function validateAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-auth`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      clearAuthData();
      return false;
    }
    return true;
  } catch (error) {
    clearAuthData();
    return false;
  }
}

// Auth Utilities
function handleAuthRequest(endpoint, data) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    if (!response.ok) return response.json().then(error => { throw error; });
    return response;
  });
}

function toggleButtonState(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.innerHTML = isLoading 
    ? `<div class="spinner"></div> ${button.dataset.loadingText || 'Processing...'}`
    : button.dataset.originalText;
}

function redirectAuthenticatedUser() {
  const redirectUrl = localStorage.getItem('redirectUrl') || 'home.html';
  localStorage.removeItem('redirectUrl');
  window.location.href = redirectUrl;
}

function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Error Handling
export function handleFormErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (input) {
      const errorContainer = input.parentElement.querySelector('.error-message') || createErrorElement();
      errorContainer.textContent = Array.isArray(message) ? message.join(', ') : message;
    }
  });
}

function createErrorElement() {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  return errorEl;
}

// Initial Auth Check
document.addEventListener('DOMContentLoaded', async () => {
  if (!await validateAuthToken() && !window.location.pathname.includes('index.html')) {
    localStorage.setItem('redirectUrl', window.location.pathname);
    window.location.href = 'index.html';
  }
});