document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const backToTop = document.querySelector(".back-to-top");

  const setMenu = (open) => {
    if (!menuButton || !navLinks) return;
    navLinks.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", open);
  };
  menuButton?.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });

  const updatePage = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
    backToTop?.classList.toggle("visible", window.scrollY > 500);
  };
  updatePage();
  window.addEventListener("scroll", updatePage, { passive: true });
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = "true";
      image.classList.add("image-fallback");
      image.removeAttribute("src");
      image.setAttribute("alt", `${image.alt || "Image"} placeholder`);
    });

    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
      const fields = ["name", "email", "subject", "message"];
      const validateField = (field) => {
        const input = contactForm.elements[field];
        const error = contactForm.querySelector(`[data-error-for="${field}"]`);
        let message = "";
        if (!input.value.trim()) message = `Please enter ${field === "message" ? "a message" : `your ${field}`}.`;
        else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) message = "Please enter a valid email address.";
        if (error) error.textContent = message;
        input.setAttribute("aria-invalid", String(Boolean(message)));
        return !message;
      };
      fields.forEach((field) => {
        const input = contactForm.elements[field];
        input.addEventListener("blur", () => validateField(field));
        input.addEventListener("input", () => {
          if (input.getAttribute("aria-invalid") === "true") validateField(field);
        });
      });
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const valid = fields.map(validateField).every(Boolean);
        const status = contactForm.querySelector(".form-status");
        if (valid) {
          status.textContent = "Validation passed. This form is not connected to a delivery service.";
          contactForm.querySelector("#name").focus();
        } else {
          status.textContent = "Please correct the highlighted fields.";
          const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
          firstInvalid?.focus();
        }
      });
    }
  });
});