// main.js
import { createTutorCard } from './tutorCard.js';
import { renderStars } from './renderStars.js';
import { showTutorProfileOverlay } from './showTutorProfileOverlay.js';

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
        fetch(`http://localhost/tutors-connection-platform/backend/fetch_tutor_detail.php?tutor_id=${tutorId}`)
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

// ...other code for modals, hamburger, etc. should be split into their own files as needed
