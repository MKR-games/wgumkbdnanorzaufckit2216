(() => {
  const openButton = document.getElementById("gameManualOpen");
  const viewer = document.getElementById("gameManualViewer");
  const closeButton = document.getElementById("gameManualClose");
  const frame = document.getElementById("gameManualFrame");
  const loading = document.getElementById("gameManualLoading");

  if (!openButton || !viewer || !closeButton || !frame) return;

  let savedScrollY = 0;
  let lastFocused = null;
  let loadedOnce = false;

  const lockBackground = () => {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add("game-manual-open");
  };

  const unlockBackground = () => {
    document.body.classList.remove("game-manual-open");
    document.body.style.top = "";
    window.scrollTo({ top: savedScrollY, left: 0, behavior: "auto" });
  };

  const openViewer = () => {
    lastFocused = document.activeElement;

    if (!loadedOnce) {
      frame.src = frame.dataset.src;
      loadedOnce = true;
    }

    lockBackground();
    viewer.hidden = false;
    viewer.setAttribute("aria-hidden", "false");
    closeButton.focus({ preventScroll: true });
  };

  const closeViewer = () => {
    viewer.hidden = true;
    viewer.setAttribute("aria-hidden", "true");
    unlockBackground();

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  };

  openButton.addEventListener("click", openViewer);
  closeButton.addEventListener("click", closeViewer);

  frame.addEventListener("load", () => {
    if (loading) loading.classList.add("is-hidden");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer.getAttribute("aria-hidden") === "false") {
      closeViewer();
    }
  });

  viewer.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const focusable = [...viewer.querySelectorAll(
      'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
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
})();
