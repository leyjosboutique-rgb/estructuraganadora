const CHECKOUT_URL = "https://pay.hotmart.com/L107141993A?checkoutMode=10";

document.querySelectorAll("[data-checkout]").forEach((link) => {
  link.href = CHECKOUT_URL;
  link.addEventListener("click", () => {
    if (typeof window.fbq !== "function") return;
    window.fbq("track", "InitiateCheckout", {
      content_name: "Bolsos de Autor",
      content_category: "Patrones premium de crochet",
      content_type: "product",
      value: 13.00,
      currency: "USD",
    });
  });
});

const countdownBoxes = document.querySelectorAll("[data-countdown-box]");
const todayFields = document.querySelectorAll("[data-today-date]");
const dateFormatter = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" });
const TIMER_DURATION = 10 * 60 * 1_000;
const formattedDate = dateFormatter.format(new Date());
todayFields.forEach((field) => { field.textContent = formattedDate; });
const sessionDeadline = Date.now() + TIMER_DURATION;

const updateCountdown = () => {
  const now = new Date();
  const remaining = Math.max(0, sessionDeadline - now.getTime());
  const values = {
    minutes: Math.floor(remaining / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
  };

  countdownBoxes.forEach((box) => {
    Object.entries(values).forEach(([unit, value]) => {
      const field = box.querySelector(`[data-${unit}]`);
      if (field) field.textContent = String(value).padStart(2, "0");
    });

    if (remaining === 0) {
      box.classList.add("is-expired");
      const message = box.querySelector("[data-countdown-message]");
      if (message) message.textContent = "La reserva temporal de esta sesi\u00f3n finaliz\u00f3.";
    }
  });
};

updateCountdown();
setInterval(updateCountdown, 1_000);

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const name = carousel.dataset.carousel;
  const previous = document.querySelector(`[data-prev="${name}"]`);
  const next = document.querySelector(`[data-next="${name}"]`);

  const move = (direction) => {
    const card = carousel.firstElementChild;
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap || "0");
    carousel.scrollBy({ left: (card.getBoundingClientRect().width + gap) * direction, behavior: "smooth" });
  };

  previous?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
});

const modelsCarousel = document.querySelector('[data-carousel="models"]');
if (modelsCarousel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let modelsAutoplay;

  const advanceModels = () => {
    const card = modelsCarousel.firstElementChild;
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(modelsCarousel).columnGap || "0");
    const step = card.getBoundingClientRect().width + gap;
    const limit = modelsCarousel.scrollWidth - modelsCarousel.clientWidth;
    const nextPosition = modelsCarousel.scrollLeft + step >= limit - 4 ? 0 : modelsCarousel.scrollLeft + step;
    modelsCarousel.scrollTo({ left: nextPosition, behavior: "smooth" });
  };

  const stopModelsAutoplay = () => window.clearInterval(modelsAutoplay);
  const startModelsAutoplay = () => {
    stopModelsAutoplay();
    modelsAutoplay = window.setInterval(advanceModels, 2_800);
  };

  modelsCarousel.addEventListener("pointerdown", stopModelsAutoplay, { passive: true });
  modelsCarousel.addEventListener("pointerup", startModelsAutoplay, { passive: true });
  modelsCarousel.addEventListener("pointercancel", startModelsAutoplay, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopModelsAutoplay();
    else startModelsAutoplay();
  });

  startModelsAutoplay();
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
