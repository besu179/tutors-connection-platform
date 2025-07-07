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
                        <button class="btn btn-primary" id="bookSessionBtn">Book Session</button>
                        <button class="btn btn-outline" id="sendMessageBtn">Send Message</button>
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
                    <div class="profile-section" id="tutorReviewsSection">
                        <h3>Reviews</h3>
                        <div id="reviewsList"><div class="loading">Loading reviews...</div></div>
                        <div id="reviewFormContainer"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `,
  });

  // Add event listeners for the buttons after modal is rendered
  setTimeout(() => {
    const bookBtn = document.getElementById('bookSessionBtn');
    const msgBtn = document.getElementById('sendMessageBtn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => showBookSessionModal(tutor));
    }
    if (msgBtn) {
      msgBtn.addEventListener('click', () => showMessageModalToTutor(tutor));
    }
  }, 200);

  // Load reviews and show review form if eligible
  setTimeout(() => {
    loadTutorReviews(tutor.user_id);
    showReviewFormIfEligible(tutor.user_id);
  }, 200);
}

// Book Session Modal
function showBookSessionModal(tutor) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    import('../notification.js').then(m => m.showNotification('Please login to book a session.', 'warning'));
    return;
  }
  import('./modal.js').then(({ createModal }) => {
    createModal({
      id: 'bookSessionModal',
      title: `Book a Session with ${tutor.first_name} ${tutor.last_name}`,
      bodyHTML: `
        <form id="bookSessionForm">
          <div class="form-group">
            <label for="sessionDate">Session Date & Time</label>
            <input type="datetime-local" id="sessionDate" name="session_date" required>
          </div>
          <div class="form-group">
            <label for="sessionNotes">Notes (optional)</label>
            <textarea id="sessionNotes" name="notes" rows="2"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Book Session</button>
        </form>
      `,
    });
    setTimeout(() => {
      const form = document.getElementById('bookSessionForm');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const session_date = form.session_date.value;
          const notes = form.notes.value;
          try {
            const res = await fetch('http://localhost/tutors-connection-platform/backend/createSession.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tutor_id: tutor.user_id, student_id: user.user_id, session_date, notes })
            });
            const data = await res.json();
            import('../notification.js').then(m => {
              if (data.success) {
                m.showNotification('Session booked successfully!', 'success');
                setTimeout(() => {
                  const modal = document.getElementById('bookSessionModal');
                  if (modal) {
                    modal.remove();
                    console.log('Book session modal removed');
                  } else {
                    console.log('Book session modal not found');
                  }
                }, 1500);
              } else {
                m.showNotification(data.message || 'Failed to book session.', 'error');
              }
            });
          } catch (err) {
            import('../notification.js').then(m => m.showNotification('Failed to book session.', 'error'));
          }
        });
      }
    }, 200);
  });
}

// Send Message Modal (pre-select tutor)
function showMessageModalToTutor(tutor) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    import('../notification.js').then(m => m.showNotification('Please login to send a message.', 'warning'));
    return;
  }
  import('./messagesOverlay.js').then(m => {
    m.showMessagesOverlay();
    setTimeout(() => {
      // Simulate selecting this tutor in the conversation list
      const convList = document.getElementById('conversationList');
      if (convList) {
        let item = Array.from(convList.querySelectorAll('.conversation-item')).find(li => li.getAttribute('data-userid') == tutor.user_id);
        if (item) {
          item.click();
        } else {
          // If no conversation exists, create a new one by sending a dummy message
          const chatInput = document.getElementById('chatInput');
          const sendBtn = document.getElementById('sendMsgBtn');
          if (chatInput && sendBtn) {
            chatInput.value = '';
            chatInput.disabled = false;
            sendBtn.disabled = false;
          }
        }
      }
    }, 500);
  });
}

async function loadTutorReviews(tutor_id) {
  const reviewsList = document.getElementById('reviewsList');
  if (!reviewsList) return;
  try {
    const res = await fetch(`http://localhost/tutors-connection-platform/backend/fetchTutorReviews.php?tutor_id=${tutor_id}`);
    const data = await res.json();
    if (!data.success || !data.reviews.length) {
      reviewsList.innerHTML = '<div class="no-reviews">No reviews yet.</div>';
      return;
    }
    reviewsList.innerHTML = data.reviews.map(r => `
      <div class="review-item">
        <div class="review-header">
          <span class="reviewer-name">${r.student_name || 'User'}</span>
          <span class="review-date">${formatDate(r.created_at)}</span>
        </div>
        <div class="review-stars">${renderStars(r.rating)}</div>
        <div class="review-text">${r.comment}</div>
      </div>
    `).join('');
  } catch (err) {
    reviewsList.innerHTML = '<div class="error">Failed to load reviews.</div>';
  }
}

function showReviewFormIfEligible(tutor_id) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const container = document.getElementById('reviewFormContainer');
  if (!container) return;
  if (!user || (user.role !== 'student' && user.role !== 'parent')) {
    container.innerHTML = '';
    return;
  }
  // Only allow one review per user per tutor
  fetch(`http://localhost/tutors-connection-platform/backend/fetchTutorReviews.php?tutor_id=${tutor_id}`)
    .then(res => res.json())
    .then(data => {
      if (data.reviews && data.reviews.some(r => r.student_id == user.user_id)) {
        container.innerHTML = '<div class="info">You have already reviewed this tutor.</div>';
      } else {
        container.innerHTML = `
          <form id="tutorReviewForm">
            <div class="form-group">
              <label>Rating:</label>
              <span class="review-stars-input">
                <input type="radio" name="rating" value="5" id="star5"><label for="star5">&#9733;</label>
                <input type="radio" name="rating" value="4" id="star4"><label for="star4">&#9733;</label>
                <input type="radio" name="rating" value="3" id="star3"><label for="star3">&#9733;</label>
                <input type="radio" name="rating" value="2" id="star2"><label for="star2">&#9733;</label>
                <input type="radio" name="rating" value="1" id="star1"><label for="star1">&#9733;</label>
              </span>
            </div>
            <div class="form-group">
              <label for="reviewText">Review:</label>
              <textarea id="reviewText" name="comment" rows="2" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit Review</button>
          </form>
        `;
        setTimeout(() => {
          const form = document.getElementById('tutorReviewForm');
          if (form) {
            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const rating = parseInt(form.rating.value);
              const comment = form.comment.value.trim();
              if (!rating || rating < 1 || rating > 5) {
                import('../notification.js').then(m => m.showNotification('Please select a rating.', 'warning'));
                return;
              }
              try {
                const res = await fetch('http://localhost/tutors-connection-platform/backend/submitTutorReview.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tutor_id, student_id: user.user_id, rating, comment })
                });
                const data = await res.json();
                import('../notification.js').then(m => {
                  if (data.success) {
                    m.showNotification('Review submitted!', 'success');
                    loadTutorReviews(tutor_id);
                    showReviewFormIfEligible(tutor_id);
                  } else {
                    m.showNotification(data.message || 'Failed to submit review.', 'error');
                  }
                });
              } catch (err) {
                import('../notification.js').then(m => m.showNotification('Failed to submit review.', 'error'));
              }
            });
          }
        }, 100);
      }
    });
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
