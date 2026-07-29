document.addEventListener("partials:ready", () => {
  initNav();
  highlightActiveLink();
  initMenuTabs();
  initFadeIn();
  initHeaderScroll();
  initParallax();
  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();
});

/* ===== Scroll Reveal ===== */
function initFadeIn() {
  const items = document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ===== Header Scroll State ===== */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 60);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ===== Hero Parallax (GPU-composited, RAF-throttled) ===== */
function initParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const bg = document.createElement("div");
  bg.className = "hero-parallax-bg";
  bg.setAttribute("aria-hidden", "true");
  hero.prepend(bg);

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.28, 260);
        bg.style.transform = `translate3d(0, ${y}px, 0)`;
        ticking = false;
      });
      ticking = true;
    },
    { passive: true }
  );
}

/* ===== Mobile Nav ===== */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.classList.toggle("is-active", isOpen);
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-active");
    });
  });
}

/* ===== Active Nav Link ===== */
function highlightActiveLink() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll(`.primary-nav a[data-nav="${page}"]`).forEach((link) => {
    link.classList.add("is-current");
    link.setAttribute("aria-current", "page");
  });
}

/* ===== Speisekarte Tab Scroll-Spy ===== */
function initMenuTabs() {
  const tabBar = document.querySelector(".menu-tabs");
  if (!tabBar) return;
  const links = tabBar.querySelectorAll("a");
  const sections = document.querySelectorAll(".menu-category");
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          links.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", isActive);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}
