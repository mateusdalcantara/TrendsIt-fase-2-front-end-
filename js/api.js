const API_BASE_URL = 'http://localhost:8080';

const ENDPOINTS = {
  posts: {
    create: '/api/post',          
    get: '/api/post',             
    delete: '/api/post/{id}'      
  },
  events: '/api/events',          
  jobs: '/api/jobs'               
};


// Utility Functions
function showLoading(button) {
    const originalText = button.textContent;
    button.innerHTML = `
        <div class="spinner"></div>
        ${originalText}
    `;
    button.disabled = true;
}

function hideLoading(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

// Main API Function
async function makeAuthenticatedRequest(url, method = 'GET', body = null, button = null) {
    const token = localStorage.getItem('token');
    let originalText;
    
    try {
        if (button) {
            originalText = button.textContent;
            showLoading(button);
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const config = {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        };

        const response = await fetch(`${API_BASE_URL}${url}`, config);

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Request failed');
        }

        return response;
    } finally {
        if (button) hideLoading(button, originalText);
    }
}

// Specific API Functions
async function getEvents() {
    return makeAuthenticatedRequest('/api/events');
}

async function createJobPosting(jobData) {
    return makeAuthenticatedRequest('/api/jobs', 'POST', jobData);
}

// Additional API Functions (for completeness)
async function updateProfile(profileData) {
    return makeAuthenticatedRequest('/auth/profile', 'PUT', profileData);
}

async function createEvent(eventData) {
    return makeAuthenticatedRequest('/api/events', 'POST', eventData);
}