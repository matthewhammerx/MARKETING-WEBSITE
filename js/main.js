// Hammer Media — shared site behavior

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initActiveNavLink();
  initRevealOnScroll();
  initFaqAccordion();
  initWorkFilters();
  initContactForm();
  initFooterYear();
  initCountUp();
});

function initCountUp() {
  const items = document.querySelectorAll(".stat-strip-item .num");
  if (!items.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const parsed = Array.from(items).map((el) => {
    const match = el.textContent.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    return match
      ? {
          el,
          prefix: match[1],
          target: parseFloat(match[2]),
          decimals: (match[2].split(".")[1] || "").length,
          suffix: match[3],
        }
      : null;
  });

  function animate(item) {
    if (!item) return;
    if (reduceMotion) return;

    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = item.target * eased;
      item.el.textContent = item.prefix + value.toFixed(item.decimals) + item.suffix;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        item.el.textContent = item.prefix + item.target.toFixed(item.decimals) + item.suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = parsed.find((p) => p && p.el === entry.target);
          animate(item);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  parsed.forEach((item) => {
    if (item) observer.observe(item.el);
  });
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

function initActiveNavLink() {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

function initWorkFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("[data-category]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const requiredFields = form.querySelectorAll("[required]");
    let valid = true;
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = "#ff6b6b";
      } else {
        field.style.borderColor = "";
      }
    });

    if (!valid) return;

    form.style.display = "none";
    const success = document.querySelector("#form-success");
    if (success) success.classList.add("visible");
  });
}

function initFooterYear() {
  const el = document.querySelector("#year");
  if (el) el.textContent = new Date().getFullYear();
}
