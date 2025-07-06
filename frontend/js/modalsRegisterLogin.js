// modalsRegisterLogin.js
import { createModal } from './modal.js';

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
        <label for="registerRole">I am a</label>
        <select id="registerRole">
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
          <option value="parent">Parent</option>
        </select>
      </div>
      <button class="btn btn-primary">Create Account</button>
    `,
  });
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
