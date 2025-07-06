// showTutorProfileOverlay.js
import { createModal } from './modal.js';
import { renderStars } from './renderStars.js';

export function showTutorProfileOverlay(tutor) {
  if (Array.isArray(tutor)) tutor = tutor[0];
  if (!tutor) return;
  let subjects = [];
  if (Array.isArray(tutor.subjects)) {
    subjects = tutor.subjects.map(s => typeof s === 'string' ? s : s.name || s.subject || '');
  } else if (typeof tutor.subjects === 'string') {
    subjects = tutor.subjects.split(',').map(s => s.trim()).filter(Boolean);
  }
  const name = tutor.first_name && tutor.last_name
    ? tutor.first_name + " " + tutor.last_name
    : tutor.name || tutor.user_name || '';
  const profilePic = tutor.profile_picture_url || tutor.user_profile_picture || '';
  createModal({
    id: "tutorProfileModal",
    title: `Tutor Profile: ${name}`,
    bodyHTML: `
    <section>
        <div class="container">
            <div class="tutor-profile">
                <div class="profile-sidebar">
                    <div class="profile-avatar">
                        <img src="${profilePic}" alt="${name}">
                    </div>
                    <h2 class="profile-name">${name}</h2>
                    <div class="profile-title">${tutor.title || tutor.description || ''}</div>
                    <div class="profile-rating">
                        ${renderStars(tutor.rating || tutor.ratingValue || 0)}
                        <span>${tutor.ratingValue || tutor.rating || ''}</span>
                    </div>
                    <div class="profile-stats">
                        <div class="stat">
                            <div class="stat-value">${tutor.years_experience || tutor.experience || '-'}</div>
                            <div class="stat-label">Years Exp.</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${tutor.success_rate || '-'}</div>
                            <div class="stat-label">Success Rate</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${tutor.students_count || tutor.students || '-'}</div>
                            <div class="stat-label">Students</div>
                        </div>
                    </div>
                    <div class="profile-price">${tutor.price || tutor.hourly_rate ? `$${tutor.price || tutor.hourly_rate} / hour` : ''}</div>
                    <div class="auth-buttons">
                        <button class="btn btn-primary">Book Session</button>
                        <button class="btn btn-outline">Send Message</button>
                    </div>
                </div>
                <div class="profile-main">
                    <div class="profile-section">
                        <h3>About Me</h3>
                        <p>${tutor.bio || tutor.about || tutor.description || ''}</p>
                    </div>
                    <div class="profile-section">
                        <h3>Education</h3>
                        <div class="education-item">${tutor.education || 'Not specified'}</div>
                    </div>
                    <div class="profile-section">
                        <h3>Subjects</h3>
                        <div class="tutor-subjects">
                          ${subjects.map(subj => `<span class="subject-tag">${subj}</span>`).join('')}
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
