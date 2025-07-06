// swiperInit.js
export function setupSwiper() {
  if (typeof Swiper !== "undefined") {
    const swiper = new Swiper(".swiper", {
      loop: true,
      speed: 800,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    // Add parallax effect
    const slides = document.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      slide.addEventListener("mousemove", (e) => {
        const img = slide.querySelector("img");
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        img.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
      });
      slide.addEventListener("mouseleave", () => {
        const img = slide.querySelector("img");
        img.style.transform = "scale(1.03)";
      });
    });
  }
}
