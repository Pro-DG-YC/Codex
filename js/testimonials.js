import { loadJSON } from "./utils.js";

const carouselContainer = document.querySelector("[data-testimonial-carousel]");
const testimonialsGrid = document.querySelector("[data-testimonials-grid]");

const state = {
  testimonials: [],
  index: 0
};

const renderCarousel = () => {
  if (!carouselContainer) return;
  const testimonial = state.testimonials[state.index];
  if (!testimonial) return;
  carouselContainer.innerHTML = `
    <article class="testimonial-card">
      <p class="rating-stars" aria-label="${testimonial.rating} out of 5 stars">${"★".repeat(testimonial.rating)}${"☆".repeat(5 - testimonial.rating)}</p>
      <p>"${testimonial.quote}"</p>
      <p><strong>${testimonial.name}</strong> · ${testimonial.source}</p>
    </article>
    <div class="carousel-controls">
      <button type="button" data-carousel="prev" aria-label="Previous testimonial">Prev</button>
      <span>${state.index + 1} / ${state.testimonials.length}</span>
      <button type="button" data-carousel="next" aria-label="Next testimonial">Next</button>
    </div>
  `;
};

const renderGrid = () => {
  if (!testimonialsGrid) return;
  testimonialsGrid.innerHTML = state.testimonials
    .map(
      (testimonial) => `
        <article class="testimonial-card">
          <p class="rating-stars" aria-label="${testimonial.rating} out of 5 stars">${"★".repeat(testimonial.rating)}${"☆".repeat(5 - testimonial.rating)}</p>
          <p>"${testimonial.quote}"</p>
          <p><strong>${testimonial.name}</strong> · ${testimonial.source}</p>
        </article>`
    )
    .join("");
};

const initCarouselControls = () => {
  if (!carouselContainer) return;
  carouselContainer.addEventListener("click", (event) => {
    const control = event.target.closest("[data-carousel]");
    if (!control) return;
    const direction = control.dataset.carousel;
    if (direction === "prev") {
      state.index = (state.index - 1 + state.testimonials.length) % state.testimonials.length;
    } else {
      state.index = (state.index + 1) % state.testimonials.length;
    }
    renderCarousel();
  });
};

const init = async () => {
  try {
    const data = await loadJSON("./data/testimonials.json");
    state.testimonials = data.testimonials;
    renderCarousel();
    initCarouselControls();
    renderGrid();
  } catch (error) {
    console.error(error);
  }
};

init();
