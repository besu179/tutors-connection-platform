import { createModal } from './modal.js';
import { showNotification } from '../notification.js';

export function showSessionsOverlay() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    showNotification('Please login to view your sessions.', 'warning');
    return;
  }
  createModal({
    id: 'sessionsModal',
    title: 'My Sessions',
    bodyHTML: `
      <div id="sessionsList" class="sessions-list">
        <div class="loading">Loading sessions...</div>
      </div>
    `,
  });
  fetchSessions(user);
}

async function fetchSessions(user) {
  const list = document.getElementById('sessionsList');
  if (!list) return;
  try {
    const res = await fetch(`http://localhost/tutors-connection-platform/backend/fetchSessions.php?user_id=${user.user_id}`);
    const data = await res.json();
    if (!data.success || !data.sessions.length) {
      list.innerHTML = '<div class="no-sessions">No sessions found.</div>';
      return;
    }
    list.innerHTML = data.sessions.map(sess => `
      <div class="session-item ${sess.status}">
        <div><b>Date:</b> ${formatDate(sess.session_date)}</div>
        <div><b>Tutor:</b> ${sess.tutor_id == user.user_id ? 'You' : 'Tutor #' + sess.tutor_id}</div>
        <div><b>Student:</b> ${sess.student_id == user.user_id ? 'You' : 'Student #' + sess.student_id}</div>
        <div><b>Status:</b> <span class="session-status">${sess.status}</span></div>
        <div><b>Notes:</b> ${sess.notes || '-'}</div>
        ${user.role === 'tutor' && sess.tutor_id == user.user_id && sess.status === 'scheduled' ? `
          <button class="btn btn-success" data-action="complete" data-id="${sess.session_id}">Mark Completed</button>
          <button class="btn btn-danger" data-action="cancel" data-id="${sess.session_id}">Cancel</button>
        ` : ''}
      </div>
    `).join('');
    // Add event listeners for status update
    if (user.role === 'tutor') {
      list.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => updateSessionStatus(btn.dataset.id, btn.dataset.action));
      });
    }
  } catch (err) {
    list.innerHTML = '<div class="error">Failed to load sessions.</div>';
  }
}

async function updateSessionStatus(session_id, action) {
  const status = action === 'complete' ? 'completed' : 'cancelled';
  try {
    const res = await fetch('http://localhost/tutors-connection-platform/backend/updateSessionStatus.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, status })
    });
    const data = await res.json();
    if (data.success) {
      showNotification('Session updated.', 'success');
      setTimeout(() => showSessionsOverlay(), 800);
    } else {
      showNotification(data.message || 'Failed to update session.', 'error');
    }
  } catch (err) {
    showNotification('Failed to update session.', 'error');
  }
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleString();
} 