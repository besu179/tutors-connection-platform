// modal.js
export function createModal({ id = "", title, bodyHTML }) {
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
