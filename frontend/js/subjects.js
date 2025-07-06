// subjects.js
export function showListOfSubjects() {
  fetch(
    "http://localhost/tutors-connection-platform/backend/fetch_subjects.php"
  )
    .then((res) => res.json())
    .then((data) => {
      const subjectsList = document.getElementById("subjectsList");
      if (subjectsList) {
        subjectsList.innerHTML = ""; // Clear existing items
        data.forEach((subject) => {
          const li = document.createElement("li");
          li.innerHTML = `<a href='#'>${subject.name}</a>`;
          subjectsList.appendChild(li);
        });
      }
    })
    .catch((err) => {
      console.error("Error fetching subjects:", err);
    });
}
