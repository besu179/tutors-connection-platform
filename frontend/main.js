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
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const authButtons = document.querySelector(".auth-buttons");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("mobile-active");
  authButtons.classList.toggle("mobile-active");
  hamburger.classList.toggle("active");
});

// Optional: Hide menu when clicking a nav link (for better UX)
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove("mobile-active");
      authButtons.classList.remove("mobile-active");
      hamburger.classList.remove("active");
    }
  });
});

// Swiper slider functionality
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Swiper !== "undefined") {
    const swiper = new Swiper(".swiper", {
      loop: true,
      speed: 800,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    
    // Add parallax effect
    const slides = document.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      slide.addEventListener("mousemove", (e) => {
        const img = slide.querySelector("img");
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        img.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
      });
      
      slide.addEventListener("mouseleave", () => {
        const img = slide.querySelector("img");
        img.style.transform = "scale(1.03)";
      });
    });
  }
});

// How It Works overlay logic
const howItWorksBtn = document.getElementById('how-it-works');
const howItWorksOverlay = document.getElementById('howItWorksOverlay');

if (howItWorksBtn && howItWorksOverlay) {
  howItWorksBtn.addEventListener('click', function(e) {
    e.preventDefault();
    howItWorksOverlay.style.display = 'flex';
  });
  howItWorksOverlay.querySelector('.close-how-it-works').addEventListener('click', function() {
    howItWorksOverlay.style.display = 'none';
  });
  // Optional: close overlay when clicking outside the content
  howItWorksOverlay.addEventListener('click', function(e) {
    if (e.target === howItWorksOverlay) {
      howItWorksOverlay.style.display = 'none';
    }
  });
}