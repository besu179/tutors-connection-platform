// tutorCard.js
// Dynamically create a tutor card from an object
export function createTutorCard(tutor, renderStars) {
  const card = document.createElement("div");
  card.className = "tutor-card";
  // Use user table fields if available
  const name = tutor.first_name && tutor.last_name
    ? tutor.first_name + " " + tutor.last_name
    : tutor.name || tutor.user_name || "";
  const profilePic = tutor.profile_picture_url || tutor.user_profile_picture || "";
  // Subjects: try to handle array, string, or missing
  let subjects = [];
  if (Array.isArray(tutor.subjects)) {
    subjects = tutor.subjects.map(s => typeof s === 'string' ? s : s.name || s.subject || '');
  } else if (typeof tutor.subjects === 'string') {
    subjects = tutor.subjects.split(',').map(s => s.trim()).filter(Boolean);
  }
  card.innerHTML = `
    <div class="tutor-img">
      <img src="${profilePic}" alt="${name}">
    </div>
    <div class="tutor-info">
      <div class="tutor-header">
        <h3 class="tutor-name">${name}</h3>
        <div class="tutor-rating">
          ${renderStars(tutor.rating || tutor.ratingValue || 0)}
          <span>${tutor.ratingValue || tutor.rating || ""}</span>
        </div>
      </div>
      <p>${tutor.description || ""}</p>
      <div class="tutor-subjects">
        ${subjects
          .map((subj) => `<span class="subject-tag">${subj}</span>`)
          .join("")}
      </div>
      <div class="tutor-footer">
        <div class="tutor-price">${tutor.price || tutor.hourly_rate || ""}</div>
        <button class="btn btn-outline" id="viewProfile-${
          tutor.user_id || tutor.tutor_id
        }">View Profile</button>
      </div>
    </div>
  `;
  return card;
}
