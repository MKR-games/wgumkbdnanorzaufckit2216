
(() => {
  const openButton = document.getElementById("mapOpen");
  const popup = document.getElementById("mapPopup");
  const closeButton = document.getElementById("mapClose");
  const viewport = document.getElementById("mapViewport");
  const image = document.getElementById("mapImage");
  const zoomIn = document.getElementById("mapZoomIn");
  const zoomOut = document.getElementById("mapZoomOut");
  const zoomReset = document.getElementById("mapZoomReset");

  if (!openButton || !popup || !closeButton || !viewport || !image) return;

  const LEVELS = [100, 125, 150, 175, 200];
  let levelIndex = 0;
  let savedScrollY = 0;
  let lastFocused = null;

  const updateZoom = () => {
    const level = LEVELS[levelIndex];
    image.style.width = `${level}%`;
    zoomReset.textContent = `${level}%`;
  };

  const lockBackground = () => {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add("map-popup-open");
  };

  const unlockBackground = () => {
    document.body.classList.remove("map-popup-open");
    document.body.style.top = "";
    window.scrollTo({ top: savedScrollY, left: 0, behavior: "auto" });
  };

  const openPopup = () => {
    lastFocused = document.activeElement;
    lockBackground();

    popup.hidden = false;
    popup.setAttribute("aria-hidden", "false");

    levelIndex = 0;
    updateZoom();
    viewport.scrollTo({ top: 0, left: 0, behavior: "auto" });

    closeButton.focus({ preventScroll: true });
  };

  const closePopup = () => {
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
    unlockBackground();

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  };

  openButton.addEventListener("click", openPopup);
  closeButton.addEventListener("click", closePopup);

  zoomIn?.addEventListener("click", () => {
    levelIndex = Math.min(LEVELS.length - 1, levelIndex + 1);
    updateZoom();
  });

  zoomOut?.addEventListener("click", () => {
    levelIndex = Math.max(0, levelIndex - 1);
    updateZoom();
  });

  zoomReset?.addEventListener("click", () => {
    levelIndex = 0;
    updateZoom();
    viewport.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.getAttribute("aria-hidden") === "false") {
      closePopup();
    }
  });

  popup.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const focusable = [...popup.querySelectorAll(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => !element.hidden);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  updateZoom();
})();
