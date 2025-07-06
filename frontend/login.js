// Form validation
function validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    clearMessages();

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
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;

            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
            const response = await fetch('/backend/api/login_api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showSuccess('Login successful! Redirecting...');
                    setTimeout(() => window.location.href = 'dashboard.html', 2000);
                } else {
                    showError(data.error || 'Login failed');
                }
            } catch (error) {
                showError('An error occurred. Please try again.');
            }
        });
    }
});
