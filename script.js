(() => {
  const root = document.documentElement;
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const fontUp = document.getElementById("fontUp");
  const fontDown = document.getElementById("fontDown");
  const menuToggle = document.getElementById("menuToggle");
  const quickNav = document.getElementById("quickNav");

  const MIN_FONT = 15;
  const MAX_FONT = 22;
  const DEFAULT_FONT = 17;
  const FONT_KEY = "black-corridor-moon-font-size";
  const SCROLL_KEY = "black-corridor-moon-scroll-position";

  const storedFont = Number(localStorage.getItem(FONT_KEY));
  let currentFont = Number.isFinite(storedFont) && storedFont >= MIN_FONT && storedFont <= MAX_FONT
    ? storedFont
    : DEFAULT_FONT;

  const applyFont = () => {
    root.style.setProperty("--body-size", `${currentFont}px`);
    localStorage.setItem(FONT_KEY, String(currentFont));
  };

  fontUp.addEventListener("click", () => {
    currentFont = Math.min(MAX_FONT, currentFont + 1);
    applyFont();
  });

  fontDown.addEventListener("click", () => {
    currentFont = Math.max(MIN_FONT, currentFont - 1);
    applyFont();
  });

  menuToggle.addEventListener("click", () => {
    const willOpen = !quickNav.classList.contains("is-open");
    quickNav.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });

  quickNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      quickNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (event) => {
    if (!quickNav.contains(event.target) && !menuToggle.contains(event.target)) {
      quickNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;

    progress.style.width = `${ratio * 100}%`;
    backToTop.classList.toggle("is-visible", scrollTop > 700);
    sessionStorage.setItem(SCROLL_KEY, String(scrollTop));
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  applyFont();
  updateScrollUI();

  const savedPosition = Number(sessionStorage.getItem(SCROLL_KEY));
  if (Number.isFinite(savedPosition) && savedPosition > 0 && !location.hash) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedPosition, behavior: "auto" });
    });
  }
})();
