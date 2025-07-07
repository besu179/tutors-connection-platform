# 🎓 Tutors Connection Platform

A modern web platform that connects **tutors** with **parents/students** for personalized learning experiences.

## 🚀 Features

- Tutor, Parent, and Student registration & login
- Profile management for tutors (bio, education, subjects, hourly rate, image upload)
- Dynamic tutor search and subject filtering
- **Top Rated Tutors** section (dynamic, based on real ratings)
- Messaging system (real-time modal chat between users)
- Session scheduling (students/parents can book sessions with tutors, tutors manage sessions)
- Tutor reviews & ratings (students/parents can rate and review tutors)
- Responsive, modern UI with modals and overlays
- Contact Us and Website Review forms
- All data stored in MySQL, robust backend in PHP

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (modular, ES6)
- **Backend**: PHP (REST-style endpoints)
- **Database**: MySQL
- **Authentication**: LocalStorage-based (for demo; can be extended)

## 📦 Setup Instructions

1. **Clone the repository**
2. **Backend setup:**
   - Place the `backend/` folder in your PHP server root (e.g., XAMPP's `htdocs`)
   - Ensure MySQL is running and credentials in `backend/Database.php` match your setup
   - The database and tables are auto-created on first run
3. **Frontend setup:**
   - Open `frontend/index.html` in your browser (use Live Server or serve via localhost for full functionality)
   - Make sure the backend is accessible at `http://localhost/tutors-connection-platform/backend/`
4. **Dependencies:**
   - FontAwesome and Swiper are loaded via CDN in `index.html`

## 💡 Usage

- Register as a tutor, parent, or student
- View tutor profiles, book sessions, send messages, and leave reviews
- Tutors can edit their profiles and manage sessions
- All users can use the messaging system

## 📝 Notes

- For full functionality, use a local server (not just file://)
- CORS is configured for `http://127.0.0.1:5500` and `localhost`
- All features are modular and easy to extend


