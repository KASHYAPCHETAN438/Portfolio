document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const typingElement = document.querySelector("[data-typing]");
  if (typingElement && !reducedMotion) {
    const phrases = JSON.parse(typingElement.dataset.typing);
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    const text = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.setAttribute("aria-hidden", "true");
    typingElement.replaceChildren(text, cursor);
    const type = () => {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        characterIndex++;
        text.textContent = phrase.slice(0, characterIndex);
        if (characterIndex === phrase.length) {
          deleting = true;
          setTimeout(type, 1400);
          return;
        }
      } else {
        characterIndex--;
        text.textContent = phrase.slice(0, characterIndex);
        if (characterIndex > 0) {
          // Continue deleting the current phrase.
        } else {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    };
    setTimeout(type, 400);
  }
});