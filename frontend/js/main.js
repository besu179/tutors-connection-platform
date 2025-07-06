// main.js
import { createTutorCard } from './tutorCard.js';
import { renderStars } from './renderStars.js';
import { showTutorProfileOverlay } from './showTutorProfileOverlay.js';
import { setupHamburgerMenu } from './hamburger.js';
import { setupSwiper } from './swiperInit.js';
import { showRegisterModal, showLoginModal, updateAuthUI } from './modalsRegisterLogin.js';
import { showHowItWorksOverlay, showHowPricingWorksOverlay } from './howItWorks.js';
import { showMessagesOverlay } from './messagesOverlay.js';
import { showListOfSubjects } from './subjects.js';

// Populate UI with tutors
function populateUi() {
  fetch("http://localhost/tutors-connection-platform/backend/fetchTutors.php")
    .then((res) => res.json())
    .then((data) => {
      const tutorsContainer = document.getElementById("tutorsContainer");
      if (tutorsContainer) {
        const numOfTutors = data.length;
        for (let i = 0; i < 7; i++) {
          const random = data[Math.floor(Math.random() * numOfTutors)];
          const tutorCard = createTutorCard(random, renderStars);
          tutorsContainer.appendChild(tutorCard);
        }
      }
    })
    .catch((err) => {
      console.error("Error fetching tutors:", err);
    });
}

document.addEventListener("DOMContentLoaded", populateUi);

document.addEventListener("DOMContentLoaded", function () {
  const tutorsContainer = document.getElementById("tutorsContainer");
  if (tutorsContainer) {
    tutorsContainer.addEventListener("click", function (e) {
      const button = e.target.closest("button[id^='viewProfile-']");
      if (button) {
        const tutorId = button.id.split("-")[1];
        fetch(`http://localhost/tutors-connection-platform/backend/fetchTutors.php?tutor_id=${tutorId}`)
          .then((res) => res.json())
          .then((data) => {
            let tutor = Array.isArray(data) ? data[0] : data;
            if (tutor) {
              showTutorProfileOverlay(tutor);
            } else {
              console.error("No tutor data found for ID:", tutorId);
            }
          })
          .catch((err) => {
            console.error("Error fetching tutor details:", err);
          });
      }
    });
  }
});

// Initialize hamburger menu
setupHamburgerMenu();
// Initialize Swiper slider
setupSwiper();
// Populate subjects list on DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
  showListOfSubjects();
});

// Register event listeners for overlays and modals

document.addEventListener('DOMContentLoaded', () => {
  // Register button
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', showRegisterModal);
  }
  // Login button
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', showLoginModal);
  }
  // How it works
  const howItWorksBtn = document.getElementById('how-it-works');
  if (howItWorksBtn) {
    howItWorksBtn.addEventListener('click', showHowItWorksOverlay);
  }
  // Messages overlay (if you have a button for messages)
  const messagesBtn = document.getElementById('messagesBtn');
  if (messagesBtn) {
    messagesBtn.addEventListener('click', showMessagesOverlay);
  }
  // Pricing overlay (if you have a function for it)
  const pricingBtn = document.getElementById('howPricingWorksOverlay');
  if (pricingBtn && typeof showHowPricingWorksOverlay === 'function') {
    pricingBtn.addEventListener('click', showHowPricingWorksOverlay);
  }
});

// ...other code for modals, hamburger, etc. should be split into their own files as needed
