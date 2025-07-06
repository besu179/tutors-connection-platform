// modalsRegisterLogin.js
import { createModal } from './modal.js';
import { showNotification, showConfirmation } from '../notification.js';

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
            showNotification('Registration successful! You are now logged in.', 'success');
            document.getElementById('registerModal').remove();
            // Auto-login: store user data and update UI
            localStorage.setItem('user', JSON.stringify(data.user));
            updateAuthUI();
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
      <button class="btn btn-primary" id="loginSubmitBtn">Login</button>
    `,
  });

  // Login logic
  setTimeout(() => {
    const loginBtn = document.getElementById('loginSubmitBtn');
    if (loginBtn) {
      loginBtn.onclick = async function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) {
          showNotification('Please enter both email and password.', 'warning');
          return;
        }
        try {
          const res = await fetch('http://localhost/tutors-connection-platform/backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (data.success) {
            showNotification('Login successful!', 'success');
            document.getElementById('loginModal').remove();
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            // Update UI to show user info and logout
            updateAuthUI();
          } else {
            showNotification(data.message || 'Login failed.', 'error');
          }
        } catch (err) {
          showNotification('Login failed. Please try again.', 'error');
        }
      };
    }
  }, 100);
}

// Function to update authentication UI
function updateAuthUI() {
  const authButtons = document.querySelector('.auth-buttons');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (user) {
    // User is logged in
    authButtons.innerHTML = `
      <div class="user-info">
        <span class="user-name">${user.first_name} ${user.last_name}</span>
        <div class="user-actions">
          <button class="btn btn-outline" id="messagesBtn" title="Messages">
            <i class="fas fa-envelope"></i>
          </button>
          ${user.role === 'tutor' ? `
            <button class="btn btn-outline" id="editProfileBtn" title="Edit Profile">
              <i class="fas fa-edit"></i>
            </button>
          ` : ''}
          <button class="btn btn-outline" id="logoutBtn" title="Logout">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners for new buttons
    setTimeout(() => {
      const logoutBtn = document.getElementById('logoutBtn');
      const messagesBtn = document.getElementById('messagesBtn');
      const editProfileBtn = document.getElementById('editProfileBtn');
      
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }
      
      if (messagesBtn) {
        messagesBtn.addEventListener('click', () => {
          // Import and call showMessagesOverlay
          import('./messagesOverlay.js').then(module => {
            module.showMessagesOverlay();
          });
        });
      }
      
      if (editProfileBtn) {
        editProfileBtn.addEventListener('click', showEditProfileModal);
      }
    }, 100);
  } else {
    // User is not logged in
    authButtons.innerHTML = `
      <button class="btn btn-outline" id="loginBtn">Login</button>
      <button class="btn btn-primary" id="registerBtn">Register</button>
    `;
    
    // Re-add event listeners for login/register buttons
    setTimeout(() => {
      const loginBtn = document.getElementById('loginBtn');
      const registerBtn = document.getElementById('registerBtn');
      
      if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
      }
      
      if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterModal);
      }
    }, 100);
  }
}

// Logout function
function logout() {
  showConfirmation('Are you sure you want to logout?', () => {
    localStorage.removeItem('user');
    showNotification('Logged out successfully.', 'info');
    updateAuthUI();
  });
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
});

// Export functions for use in other modules
export { updateAuthUI, logout };

// Edit Profile Modal for Tutors
export function showEditProfileModal() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || user.role !== 'tutor') {
    showNotification('Only tutors can edit their profile.', 'warning');
    return;
  }

  // Fetch current tutor profile data
  fetch(`http://localhost/tutors-connection-platform/backend/getTutorProfile.php?tutor_id=${user.user_id}`)
    .then(res => res.json())
    .then(data => {
      const profile = data.profile || {};
      const userData = data.user || user;
      
      createModal({
        id: "editProfileModal",
        title: "Edit Tutor Profile",
        bodyHTML: `
          <form id="editProfileForm" enctype="multipart/form-data">
            <div class="form-section">
              <h4>Profile Picture</h4>
              <div class="form-group">
                <label for="profileImage">Profile Image</label>
                <input type="file" id="profileImage" name="profile_image" accept="image/*">
                <small>Current: ${userData.profile_picture_url || 'No image'}</small>
              </div>
            </div>
            
            <div class="form-section">
              <h4>Personal Information</h4>
              <div class="form-group">
                <label for="editFirstName">First Name</label>
                <input type="text" id="editFirstName" name="first_name" value="${userData.first_name || ''}" required>
              </div>
              <div class="form-group">
                <label for="editLastName">Last Name</label>
                <input type="text" id="editLastName" name="last_name" value="${userData.last_name || ''}" required>
              </div>
              <div class="form-group">
                <label for="editPhone">Phone Number</label>
                <input type="tel" id="editPhone" name="phone_number" value="${userData.phone_number || ''}">
              </div>
              <div class="form-group">
                <label for="editAddress">Address</label>
                <textarea id="editAddress" name="address" rows="3">${userData.address || ''}</textarea>
              </div>
            </div>
            
            <div class="form-section">
              <h4>Tutor Information</h4>
              <div class="form-group">
                <label for="editBio">Bio</label>
                <textarea id="editBio" name="bio" rows="4" placeholder="Tell students about your teaching experience and approach...">${profile.bio || ''}</textarea>
              </div>
              <div class="form-group">
                <label for="editEducation">Education</label>
                <textarea id="editEducation" name="education" rows="3" placeholder="Your educational background, degrees, certifications...">${profile.education || ''}</textarea>
              </div>
              <div class="form-group">
                <label for="editHourlyRate">Hourly Rate ($)</label>
                <input type="number" id="editHourlyRate" name="hourly_rate" value="${profile.hourly_rate || ''}" min="0" step="0.01">
              </div>
              <div class="form-group">
                <label for="editAvailability">Availability</label>
                <textarea id="editAvailability" name="availability" rows="3" placeholder="Your available days and times for tutoring...">${profile.availability || ''}</textarea>
              </div>
            </div>
            
            <div class="form-section">
              <h4>Subjects You Teach</h4>
              <div class="form-group">
                <label>Select up to 7 subjects:</label>
                <div id="subjectsCheckboxes" class="subjects-grid">
                  <div class="loading">Loading subjects...</div>
                </div>
                <small class="subjects-limit">Selected: <span id="selectedCount">0</span>/7</small>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-outline" onclick="document.getElementById('editProfileModal').remove()">Cancel</button>
            </div>
          </form>
        `,
      });

      // Handle form submission
      setTimeout(() => {
        const form = document.getElementById('editProfileForm');
        if (form) {
          form.addEventListener('submit', handleProfileUpdate);
        }
        
        // Load subjects and current tutor subjects
        loadSubjects(user.user_id);
      }, 100);
    })
    .catch(err => {
      showNotification('Error loading profile data.', 'error');
    });
}

// Load subjects and populate checkboxes
async function loadSubjects(tutorId) {
  try {
    // Fetch all subjects
    const subjectsRes = await fetch('http://localhost/tutors-connection-platform/backend/fetch_subjects.php');
    const subjectsData = await subjectsRes.json();
    
    // Fetch tutor's current subjects
    const tutorSubjectsRes = await fetch(`http://localhost/tutors-connection-platform/backend/getTutorSubjects.php?tutor_id=${tutorId}`);
    const tutorSubjectsData = await tutorSubjectsRes.json();
    
    const subjectsContainer = document.getElementById('subjectsCheckboxes');
    const selectedSubjectIds = tutorSubjectsData.subjects || [];
    
    if (subjectsData.length > 0) {
      subjectsContainer.innerHTML = subjectsData.map(subject => `
        <label class="subject-checkbox">
          <input type="checkbox" 
                 name="subjects[]" 
                 value="${subject.subject_id}"
                 ${selectedSubjectIds.includes(subject.subject_id) ? 'checked' : ''}>
          <span class="checkbox-label">${subject.name}</span>
        </label>
      `).join('');
      
      // Add event listeners to checkboxes
      const checkboxes = subjectsContainer.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
      });
      
      updateSelectedCount();
    } else {
      subjectsContainer.innerHTML = '<p>No subjects available.</p>';
    }
  } catch (err) {
    document.getElementById('subjectsCheckboxes').innerHTML = '<p>Error loading subjects.</p>';
  }
}

// Update selected subjects count
function updateSelectedCount() {
  const checkboxes = document.querySelectorAll('input[name="subjects[]"]:checked');
  const selectedCount = checkboxes.length;
  const countElement = document.getElementById('selectedCount');
  
  countElement.textContent = selectedCount;
  
  // Disable unchecked boxes if limit reached
  const uncheckedBoxes = document.querySelectorAll('input[name="subjects[]"]:not(:checked)');
  uncheckedBoxes.forEach(checkbox => {
    checkbox.disabled = selectedCount >= 7;
  });
  
  // Visual feedback
  if (selectedCount >= 7) {
    countElement.style.color = '#ef476f';
  } else {
    countElement.style.color = '#06d6a0';
  }
}

// Handle profile update submission
async function handleProfileUpdate(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    showNotification('User session expired. Please login again.', 'error');
    return;
  }

  const formData = new FormData();
  
  // Add user data
  formData.append('user_id', user.user_id);
  formData.append('first_name', document.getElementById('editFirstName').value);
  formData.append('last_name', document.getElementById('editLastName').value);
  formData.append('phone_number', document.getElementById('editPhone').value);
  formData.append('address', document.getElementById('editAddress').value);
  
  // Add tutor profile data
  formData.append('bio', document.getElementById('editBio').value);
  formData.append('education', document.getElementById('editEducation').value);
  formData.append('hourly_rate', document.getElementById('editHourlyRate').value);
  formData.append('availability', document.getElementById('editAvailability').value);
  
  // Add selected subjects
  const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects[]"]:checked'))
    .map(checkbox => checkbox.value);
  formData.append('subjects', JSON.stringify(selectedSubjects));
  
  // Add image file if selected
  const imageFile = document.getElementById('profileImage').files[0];
  if (imageFile) {
    formData.append('profile_image', imageFile);
  }

  try {
    const response = await fetch('http://localhost/tutors-connection-platform/backend/updateTutorProfile.php', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      showNotification('Profile updated successfully!', 'success');
      // Update localStorage with new user data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        updateAuthUI();
      }
      document.getElementById('editProfileModal').remove();
    } else {
      showNotification(data.message || 'Failed to update profile.', 'error');
    }
  } catch (err) {
    showNotification('Error updating profile. Please try again.', 'error');
  }
}
