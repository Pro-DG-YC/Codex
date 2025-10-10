import { validateForm } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[data-simple-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateForm(form)) {
        if (status) {
          status.innerHTML = '<p class="alert-error">Please complete the required fields highlighted above.</p>';
        }
        return;
      }
      const formData = new FormData(form);
      const entries = Object.fromEntries(formData.entries());
      console.table(entries);
      if (status) {
        status.innerHTML = '<p class="alert-success">Thank you! Your information has been received. We will contact you shortly.</p>';
      }
      form.reset();
    });
  });
});
