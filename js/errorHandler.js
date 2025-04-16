export function handleFormErrors(errors) {
  document.querySelectorAll('.error-message').forEach(el => el.remove());

  Object.entries(errors).forEach(([field, messages]) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (input) {
      const errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      errorEl.textContent = Array.isArray(messages) ? messages.join(', ') : messages;
      input.parentNode.insertBefore(errorEl, input.nextSibling);
    }
  });
}

try {
  await createPost(postData);
} catch (error) {
  if (error.errors) { // Match backend's ValidationError format
    handleFormErrors(error.errors);
  } else {
    showError(error.message);
  }
}