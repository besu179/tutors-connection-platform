// hamburger.js
export function setupHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const authButtons = document.querySelector(".auth-buttons");
  if (!hamburger || !navLinks || !authButtons) return;
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-active");
    authButtons.classList.toggle("mobile-active");
    hamburger.classList.toggle("active");
  });
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("mobile-active");
        authButtons.classList.remove("mobile-active");
        hamburger.classList.remove("active");
      }
    });
  });
}
