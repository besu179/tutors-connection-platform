// modalsRegisterLogin.js
import { createModal } from './modal.js';
import { showNotification } from '../notification.js';

export function showRegisterModal() {
  createModal({
    id: "registerModal",
    title: "Create an Account",
    bodyHTML: `
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" id="firstName" placeholder="John Doe">
        <label for="lastName">Last Name</label>
        <input type="text" id="lastName" placeholder="John Doe">
      </div>
      <div class="form-group">
        <label for="registerEmail">Email Address</label>
        <input type="email" id="registerEmail" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label for="registerPassword">Password</label>
        <input type="password" id="registerPassword" placeholder="Create a password">
      </div>
      <div class="form-group">
        <label for="registerPasswordConfirm">Confirm Password</label>
        <input type="password" id="registerPasswordConfirm" placeholder="Confirm your password">
      </div>
      <div class="form-group">
        <label for="registerRole">I am a</label>
        <select id="registerRole">
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
          <option value="parent">Parent</option>
        </select>
      </div>
      <button class="btn btn-primary" id="registerSubmitBtn">Create Account</button>
    `,
  });

  // Registration logic
  setTimeout(() => {
    const submitBtn = document.getElementById('registerSubmitBtn');
    if (submitBtn) {
      submitBtn.onclick = async function (e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const role = document.getElementById('registerRole').value;
        if (!firstName || !lastName || !email || !password || !passwordConfirm || !role) {
          showNotification('Please fill in all fields.', 'warning');
          return;
        }
        if (password !== passwordConfirm) {
          showNotification('Passwords do not match.', 'error');
          return;
        }
        // Send registration data
        try {
          const res = await fetch('http://localhost/tutors-connection-platform/backend/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              email,
              password,
              role
            })
          });
          const data = await res.json();
          if (data.success) {
            showNotification('Registration successful! You can now log in.', 'success');
            document.getElementById('registerModal').remove();
          } else {
            showNotification(data.message || 'Registration failed.', 'error');
          }
        } catch (err) {
          showNotification('Registration failed. Please try again.', 'error');
        }
      };
    }
  }, 100);
}

export function showLoginModal() {
  createModal({
    id: "loginModal",
    title: "Login to Your Account",
    bodyHTML: `
      <div class="form-group">
        <label for="loginEmail">Email Address</label>
        <input type="email" id="loginEmail" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" id="loginPassword" placeholder="Enter your password">
      </div>
      <button class="btn btn-primary">Login</button>
    `,
  });
}
