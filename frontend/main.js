document.addEventListener("DOMContentLoaded", showMessagesOverlay);
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
function createModal({ id = "", title, bodyHTML }) {
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
      <button class="btn btn-primary">Login</button>
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
function showMessagesOverlay() {
  createModal({
    id: "",
    title: "messages",
    bodyHTML: `
            <div class="messages-container">
                <div class="conversations">
                    <div class="conversation-header">
                        <h3>Conversations</h3>
                    </div>
                    <ul class="conversation-list">
                        <li class="conversation-item active">
                            <div class="conversation-avatar">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Sarah Johnson">
                            </div>
                            <div class="conversation-info">
                                <div class="conversation-name">Sarah Johnson</div>
                                <div class="conversation-preview">Thanks for the session today! Let me know if you have any questions about the homework.</div>
                            </div>
                        </li>
                        <li class="conversation-item">
                            <div class="conversation-avatar">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="David Chen">
                            </div>
                            <div class="conversation-info">
                                <div class="conversation-name">David Chen</div>
                                <div class="conversation-preview">I've scheduled our next session for Tuesday at 4pm. Does that work for you?</div>
                            </div>
                        </li>
                        <li class="conversation-item">
                            <div class="conversation-avatar">
                                <img src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Maria Rodriguez">
                            </div>
                            <div class="conversation-info">
                                <div class="conversation-name">Maria Rodriguez</div>
                                <div class="conversation-preview">Here's the reading material for our next lesson...</div>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div class="chat-area">
                    <div class="chat-header">
                        <div class="conversation-avatar">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Sarah Johnson">
                        </div>
                        <div>
                            <div class="conversation-name">Sarah Johnson</div>
                            <div>Mathematics Tutor</div>
                        </div>
                    </div>
                    
                    <div class="chat-messages">
                        <div class="message received">
                            Hi Alex! How are you doing with the calculus problems we discussed?
                            <div class="message-time">10:15 AM</div>
                        </div>
                        
                        <div class="message sent">
                            Hi Sarah! I was able to solve the first few, but I'm stuck on problem 4. Could we go over it in our next session?
                            <div class="message-time">10:18 AM</div>
                        </div>
                        
                        <div class="message received">
                            Absolutely! I'd be happy to help. How about tomorrow at 3pm?
                            <div class="message-time">10:20 AM</div>
                        </div>
                        
                        <div class="message sent">
                            That works perfectly for me. Thanks!
                            <div class="message-time">10:22 AM</div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <input type="text" placeholder="Type your message...">
                        <button class="btn btn-primary">Send</button>
                    </div>
                </div>
            </div>
        </div>
`,
  });
}

function showTutorProfileOverlay() {
  createModal({
    id: "",
    title: "Tutor profile",
    bodyHTML: `
    <section class="section">
        <div class="container">
            <div class="section-header">
                <h2>Tutor Profile</h2>
                <p>Detailed profile of our expert tutors</p>
            </div>
            
            <div class="tutor-profile">
                <div class="profile-sidebar">
                    <div class="profile-avatar">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Sarah Johnson">
                    </div>
                    <h2 class="profile-name">Sarah Johnson</h2>
                    <div class="profile-title">Mathematics & Physics Tutor</div>
                    <div class="profile-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>4.7 (128 reviews)</span>
                    </div>
                    
                    <div class="profile-stats">
                        <div class="stat">
                            <div class="stat-value">5+</div>
                            <div class="stat-label">Years Exp.</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">97%</div>
                            <div class="stat-label">Success Rate</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">350+</div>
                            <div class="stat-label">Students</div>
                        </div>
                    </div>
                    
                    <div class="profile-price">$45 / hour</div>
                    <div class="auth-buttons">
                        <button class="btn btn-primary">Book Session</button>
                        <button class="btn btn-outline">Send Message</button>
                    </div>
                </div>
                
                <div class="profile-main">
                    <div class="profile-section">
                        <h3>About Me</h3>
                        <p>I'm a passionate mathematics educator with a Master's degree in Applied Mathematics from Stanford University. I specialize in making complex mathematical concepts accessible and enjoyable for students of all levels.</p>
                        <p>With over 5 years of tutoring experience, I've helped hundreds of students improve their grades, build confidence, and develop a genuine appreciation for mathematics and physics.</p>
                    </div>
                    
                    <div class="profile-section">
                        <h3>Education</h3>
                        <div class="education-item">
                            <div class="education-degree">M.S. Applied Mathematics</div>
                            <div class="education-school">Stanford University</div>
                            <div class="education-years">2015 - 2017</div>
                        </div>
                        <div class="education-item">
                            <div class="education-degree">B.S. Mathematics & Physics</div>
                            <div class="education-school">University of California, Berkeley</div>
                            <div class="education-years">2011 - 2015</div>
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3>Subjects</h3>
                        <div class="tutor-subjects">
                            <span class="subject-tag">Calculus</span>
                            <span class="subject-tag">Algebra</span>
                            <span class="subject-tag">Geometry</span>
                            <span class="subject-tag">Trigonometry</span>
                            <span class="subject-tag">Physics</span>
                            <span class="subject-tag">Statistics</span>
                            <span class="subject-tag">SAT Math</span>
                            <span class="subject-tag">ACT Math</span>
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3>Availability</h3>
                        <div class="availability-grid">
                            <div class="availability-day">Mon</div>
                            <div class="availability-day available">Tue</div>
                            <div class="availability-day">Wed</div>
                            <div class="availability-day available">Thu</div>
                            <div class="availability-day available">Fri</div>
                            <div class="availability-day available">Sat</div>
                            <div class="availability-day">Sun</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    `,
  });
}
