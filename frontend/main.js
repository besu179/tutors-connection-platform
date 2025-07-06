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

// Utility to create and show a modal overlay
function createModal({ id, title, bodyHTML }) {
  // Remove existing modal with same id
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = id;
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
    </div>
  `;
  document.body.appendChild(modal);
  // Show modal
  modal.classList.add("active");
  // Close logic
  modal.querySelector(".close-modal").onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  return modal;
}

// Register Modal Example
function showRegisterModal() {
  createModal({
    id: "registerModal",
    title: "Create an Account",
    bodyHTML: `
      <div class="form-group">
        <label for="registerName">Full Name</label>
        <input type="text" id="registerName" placeholder="John Doe">
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
      <div class="form-footer">
        <div>
          <input type="checkbox" id="terms">
          <label for="terms">I agree to the <a href="#">Terms & Conditions</a></label>
        </div>
      </div>
      <button class="btn btn-primary">Create Account</button>
      <div class="divider"><span>Or continue with</span></div>
      <div class="social-login">
        <button class="social-login-btn"><i class="fab fa-google"></i>Google</button>
        <button class="social-login-btn"><i class="fab fa-facebook"></i>Facebook</button>
      </div>
      <p>Already have an account? <a href="#" id="switchToLogin">Login</a></p>
    `,
  });
}

// How It Works Overlay Example
function showHowItWorksOverlay() {
  createModal({
    id: "howItWorksOverlay",
    title: "How EduConnect Works",
    bodyHTML: `
      <ol>
        <li><strong>Sign Up:</strong> Create a free account as a student, tutor, or parent.</li>
        <li><strong>Find a Tutor:</strong> Browse and filter tutors by subject, rating, and availability.</li>
        <li><strong>Book a Session:</strong> Schedule a session and communicate directly with your tutor.</li>
        <li><strong>Learn & Succeed:</strong> Join your session, track your progress, and achieve your goals!</li>
      </ol>
    `,
  });
}

// Attach to buttons/links
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) registerBtn.onclick = showRegisterModal;
const howItWorksBtn = document.getElementById("how-it-works");
if (howItWorksBtn)
  howItWorksBtn.onclick = function (e) {
    e.preventDefault();
    showHowItWorksOverlay();
  };

// Login Modal Example
function showLoginModal() {
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
      <div class="form-footer">
        <div>
          <input type="checkbox" id="remember">
          <label for="remember">Remember me</label>
        </div>
        <a href="#">Forgot password?</a>
      </div>
      <button class="btn btn-primary">Login</button>
      <div class="divider"><span>Or continue with</span></div>
      <div class="social-login">
        <button class="social-login-btn"><i class="fab fa-google"></i>Google</button>
        <button class="social-login-btn"><i class="fab fa-facebook"></i>Facebook</button>
      </div>
      <p>Don't have an account? <a href="#" id="switchToRegister">Register</a></p>
    `,
  });
}

// Attach login modal to login button
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) loginBtn.onclick = showLoginModal;

// Example: Dynamically create and insert a modal with JS
function createLoginModal() {
  // Only create if not already present
  if (document.getElementById("loginModal")) return;
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "loginModal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Login to Your Account</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="loginEmail">Email Address</label>
          <input type="email" id="loginEmail" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label for="loginPassword">Password</label>
          <input type="password" id="loginPassword" placeholder="Enter your password">
        </div>
        <div class="form-footer">
          <div>
            <input type="checkbox" id="remember">
            <label for="remember">Remember me</label>
          </div>
          <a href="#">Forgot password?</a>
        </div>
        <button class="btn btn-primary">Login</button>
        <div class="divider">
          <span>Or continue with</span>
        </div>
        <div class="social-login">
          <button class="social-login-btn">
            <i class="fab fa-google"></i>
            Google
          </button>
          <button class="social-login-btn">
            <i class="fab fa-facebook"></i>
            Facebook
          </button>
        </div>
        <p>Don't have an account? <a href="#" id="switchToRegister">Register</a></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Usage: createLoginModal();
// Then you can add event listeners as usual

document.getElementById("fetchTutors").addEventListener("click", function (e) {
  e.preventDefault(); // prevent page reload

  fetch("http://localhost/tutors-connection-platform/backend/fetchTutors.php")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error("Error fetching tutors:", err);
    });
});
document
  .getElementById("fetchSubjects")
  .addEventListener("click", function (e) {
    e.preventDefault(); // prevent page reload

    fetch(
      "http://localhost/tutors-connection-platform/backend/fetch_subjects.php"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err);
      });
    createLoginModal();
  });

function showHowItWorksOverlay() {
  createModal({
    id: "howItWorksOverlay",
    title: "How TutorConnect Works",
    bodyHTML: `
    <div class="modal-content">
      <di class="modal-body">
        <ol class="howitworks-list">
        <li><strong>Create Your Profile:</strong> Sign up as a student or tutor and complete your profile.</li>
        <li><strong>Book a Session:</strong> Select a time that works for both of you and.</li>
        <li><strong>Review & Improve:</strong> After each session, provide feedback to help tutors improve and help other students find great tutors.</li>
        <li><strong>Continue Learning:</strong> Schedule follow-up sessions, track your progress, and achieve your learning goals with your tutor.</li>
      </ol>
      <div class="howitworks-benefits">
        <h4>Why Choose TutorConnect?</h4>
        <ul class="howitworks-benefits-list">
          <li><i class="fas fa-check"></i> Verified tutors</li>
          <li><i class="fas fa-check"></i> Secure payments</li>
          <li><i class="fas fa-check"></i> Flexible scheduling</li>
          <li><i class="fas fa-check"></i> Affordable pricing</li>
        </ul>
      </div>

      </di>
    </div>
`,
  });
}
