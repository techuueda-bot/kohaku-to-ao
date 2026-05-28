if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const forceScrollTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

forceScrollTop();

const openingOverlay = document.querySelector(".opening-overlay");
const titleStage = document.querySelector(".title-stage");
const heroTitle = document.querySelector(".hero-title");
const horizontalSection = document.querySelector(".horizontal-section");
const horizontalSticky = document.querySelector(".horizontal-sticky");
const horizontalTrack = document.querySelector(".horizontal-track");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const resetScrollPosition = () => {
  forceScrollTop();
  requestAnimationFrame(() => {
    forceScrollTop();
    updateHorizontalScroll();
  });
};

let maxTranslate = 0;
let ticking = false;
const isCompactViewport = window.matchMedia("(max-width: 768px)").matches;
const openingHideDelay = isCompactViewport ? 820 : 1000;
const titleRevealDelay = isCompactViewport ? 1020 : 1220;

resetScrollPosition();

document.addEventListener("DOMContentLoaded", () => {
  forceScrollTop();
  requestAnimationFrame(forceScrollTop);
});

window.setTimeout(() => {
  forceScrollTop();
  openingOverlay?.classList.add("hide");
}, openingHideDelay);

window.setTimeout(() => {
  forceScrollTop();
  titleStage?.classList.add("is-visible");
  heroTitle?.classList.add("is-visible");
}, titleRevealDelay);

const measureHorizontalScroll = () => {
  if (!horizontalSection || !horizontalSticky || !horizontalTrack) return;

  maxTranslate = Math.max(0, horizontalTrack.scrollWidth - horizontalSticky.clientWidth);
  updateHorizontalScroll();
};

const updateHorizontalScroll = () => {
  if (!horizontalSection || !horizontalTrack) return;

  const sectionTop = horizontalSection.offsetTop;
  const viewportHeight = horizontalSticky?.clientHeight || window.innerHeight;
  const scrollRange = horizontalSection.offsetHeight - viewportHeight;
  const sectionScroll = window.scrollY - sectionTop;
  const progress = scrollRange > 0 ? clamp(sectionScroll / scrollRange, 0, 1) : 0;

  horizontalTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;
};

const requestHorizontalUpdate = () => {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(() => {
    updateHorizontalScroll();
    ticking = false;
  });
};

window.addEventListener("scroll", requestHorizontalUpdate, { passive: true });
window.addEventListener("resize", measureHorizontalScroll);
window.addEventListener("beforeunload", () => {
  forceScrollTop();
});
window.addEventListener("load", () => {
  forceScrollTop();
  requestAnimationFrame(forceScrollTop);
  setTimeout(forceScrollTop, 50);
  setTimeout(forceScrollTop, 150);
  setTimeout(forceScrollTop, 300);
  measureHorizontalScroll();
});
window.addEventListener("pageshow", () => {
  forceScrollTop();
  requestAnimationFrame(forceScrollTop);
  setTimeout(forceScrollTop, 0);
  setTimeout(forceScrollTop, 50);
  setTimeout(forceScrollTop, 150);
  measureHorizontalScroll();
});
window.visualViewport?.addEventListener("resize", measureHorizontalScroll);
document.fonts?.ready.then(measureHorizontalScroll);
measureHorizontalScroll();
