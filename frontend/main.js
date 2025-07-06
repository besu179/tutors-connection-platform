// Modal functionality
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const closeButtons = document.querySelectorAll(".close-modal");
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");

loginBtn.addEventListener("click", () => {
  loginModal.classList.add("active");
});

registerBtn.addEventListener("click", () => {
  registerModal.classList.add("active");
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    loginModal.classList.remove("active");
    registerModal.classList.remove("active");
  });
});

switchToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.classList.remove("active");
  registerModal.classList.add("active");
});

switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerModal.classList.remove("active");
  loginModal.classList.add("active");
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove("active");
  }
  if (e.target === registerModal) {
    registerModal.classList.remove("active");
  }
});

// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');

hamburger.addEventListener('click', () => {
  // Toggle a class on navLinks and authButtons for mobile menu
  navLinks.classList.toggle('mobile-active');
  authButtons.classList.toggle('mobile-active');
  hamburger.classList.toggle('active');
});

// Optional: Hide menu when clicking a nav link (for better UX)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('mobile-active');
      authButtons.classList.remove('mobile-active');
      hamburger.classList.remove('active');
    }
  });
});
