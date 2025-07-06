// howItWorks.js
import { createModal } from './modal.js';

export function showHowItWorksOverlay() {
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
