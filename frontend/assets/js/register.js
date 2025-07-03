// Form validation
function validateForm() {
    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    clearMessages();

    // Validate first name
    if (!firstName) {
        showError('First name is required');
        return false;
    }

    // Validate last name
    if (!lastName) {
        showError('Last name is required');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    // Validate password
    if (!password) {
        showError('Password is required');
        return false;
    } else if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
    }

    return true;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.form-container').insertBefore(errorDiv, document.querySelector('form'));
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.form-container').insertBefore(successDiv, document.querySelector('form'));
}

// Clear all messages
function clearMessages() {
    document.querySelectorAll('.error, .success').forEach(el => el.remove());
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;

            // Disable form and show loading state
            form.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = 'Registering...';

            const formData = {
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                role: document.getElementById('role').value
            };

            try {
                const response = await fetch(window.location.origin + '/tutors-connection-platform/backend/api/register_api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                let data;
                try {
                    data = await response.json();
                } catch (jsonError) {
                    showError('Server error: Invalid response format.');
                    console.error('Invalid JSON:', jsonError);
                    return;
                }

                if (response.ok && data && data.success) {
                    showSuccess('Registration successful! Redirecting to login...');
                    setTimeout(() => window.location.href = 'login.html', 2000);
                } else {
                    showError((data && data.error) || 'Registration failed');
                }
            } catch (error) {
                showError('An error occurred. Please try again.');
                console.error('Network or server error:', error);
            } finally {
                // Reset form state
                form.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.textContent = 'Register';
                form.reset();
            }
        });
    }
});
