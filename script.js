(() => {
  "use strict";

  const reducedMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  let motionStopped = false;

  try {
    motionStopped = sessionStorage.getItem("kohaku-motion") === "off";
  } catch (error) {
    motionStopped = false;
  }

  if (!(reducedMedia.matches && motionStopped)) {
    document.documentElement.classList.add("force-motion");
  }

  if (reducedMedia.matches) {
    const motionButton = document.createElement("button");
    motionButton.className = "motion-toggle";
    motionButton.type = "button";
    motionButton.textContent = motionStopped ? "アニメーションを再開" : "アニメーションを停止";
    motionButton.setAttribute("aria-label", motionButton.textContent);
    motionButton.addEventListener("click", () => {
      try {
        sessionStorage.setItem("kohaku-motion", motionStopped ? "on" : "off");
      } catch (error) {
        // Storageが使えない環境では、その場の表示だけ切り替える。
      }
      window.location.reload();
    });
    document.body.appendChild(motionButton);
  }

  const opening = document.querySelector("[data-mobile-opening]");
  const openingSkip = document.querySelector("[data-opening-skip]");
  const mobileOpeningMedia = window.matchMedia("(max-width: 767px)");
  let openingTimer;

  const finishOpening = () => {
    if (!(opening instanceof HTMLElement) || !opening.classList.contains("is-active")) return;

    window.clearTimeout(openingTimer);
    opening.classList.add("is-leaving");
    document.body.classList.remove("is-opening");

    window.setTimeout(() => {
      opening.classList.remove("is-active", "is-leaving");
      opening.setAttribute("aria-hidden", "true");
    }, 480);
  };

  if (opening instanceof HTMLElement && mobileOpeningMedia.matches) {
    const shouldSkipMotion = reducedMedia.matches || motionStopped;

    if (!shouldSkipMotion) {
      document.body.classList.add("is-opening");
      opening.setAttribute("aria-hidden", "false");
      opening.classList.add("is-active");
      openingTimer = window.setTimeout(finishOpening, 1700);
      openingSkip?.addEventListener("click", finishOpening);
    }
  }

  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector(".site-header__menu-button");
  const navigation = document.querySelector(".site-header__nav");

  const closeNavigation = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".site-header__menu-label").textContent = "メニュー";
    navigation.classList.remove("is-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.querySelector(".site-header__menu-label").textContent = isOpen ? "メニュー" : "閉じる";
    navigation?.classList.toggle("is-open", !isOpen);
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation?.classList.contains("is-open")) {
      closeNavigation();
      menuButton?.focus();
    }
  });

  const menuDialog = document.querySelector("[data-menu-dialog]");
  const menuDialogClose = document.querySelector("[data-menu-dialog-close]");
  const menuDialogImage = document.querySelector("[data-menu-dialog-image]");
  const menuDialogNumber = document.querySelector("[data-menu-dialog-number]");
  const menuDialogTitle = document.querySelector("[data-menu-dialog-title]");
  const menuDialogDescription = document.querySelector("[data-menu-dialog-description]");
  const menuDialogNote = document.querySelector("[data-menu-dialog-note]");
  const menuDialogPrice = document.querySelector("[data-menu-dialog-price]");
  let lastMenuTrigger = null;

  const menuDetails = {
    kohaku: {
      number: "01",
      title: "中華そば 琥珀",
      description: "澄んだ醤油の香りと、細麺のやさしい口あたり。鶏と魚介の余韻を静かに重ねます。",
      note: "鶏清湯・魚介・細麺",
      price: "980円",
      image: "assets/images/hero-chuka-soba-960.webp",
      alt: "深い青の器に盛られた中華そば 琥珀",
    },
    ao: {
      number: "02",
      title: "中華そば 青",
      description: "青菜と香味油の清々しさを重ねた、軽やかな一杯。澄んだスープに緑の香りがほどけます。",
      note: "鶏清湯・青菜・香味油",
      price: "1,050円",
      image: "assets/images/menu-ao-1200.webp",
      alt: "青い器に青菜と鶏チャーシューを盛った中華そば 青",
    },
    season: {
      number: "03",
      title: "季節の一杯",
      description: "旬の香りを、その日の空気に合わせて。今季は青柚子をきかせた数量限定の一杯です。",
      note: "青柚子・季節の青菜・細麺",
      price: "1,180円",
      image: "assets/images/menu-season-1200.webp",
      alt: "青い器に青柚子と季節の青菜を添えた限定中華そば",
    },
  };

  const closeMenuDialog = () => {
    if (menuDialog instanceof HTMLDialogElement && menuDialog.open) menuDialog.close();
  };

  document.querySelectorAll("[data-menu-id]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!(menuDialog instanceof HTMLDialogElement)) return;
      const detail = menuDetails[trigger.dataset.menuId];
      if (!detail) return;

      if (menuDialogImage instanceof HTMLImageElement) {
        menuDialogImage.src = detail.image;
        menuDialogImage.alt = detail.alt;
      }
      if (menuDialogNumber) menuDialogNumber.textContent = detail.number;
      if (menuDialogTitle) menuDialogTitle.textContent = detail.title;
      if (menuDialogDescription) menuDialogDescription.textContent = detail.description;
      if (menuDialogNote) menuDialogNote.textContent = detail.note;
      if (menuDialogPrice) menuDialogPrice.textContent = detail.price;

      lastMenuTrigger = trigger;
      menuDialog.showModal();
    });
  });

  menuDialogClose?.addEventListener("click", closeMenuDialog);

  menuDialog?.addEventListener("click", (event) => {
    if (event.target === menuDialog) closeMenuDialog();
  });

  menuDialog?.addEventListener("close", () => {
    lastMenuTrigger?.focus();
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    const delay = element.dataset.revealDelay;
    if (delay) element.style.setProperty("--reveal-delay", `${delay}s`);
    revealObserver.observe(element);
  });

  const storySection = document.querySelector(".story-scroll");
  const storyTrack = document.querySelector("[data-horizontal-track]");
  const storyProgress = document.querySelector(".story-scroll__progress");
  const desktopStoryMedia = window.matchMedia("(min-width: 1024px)");
  let storyMaxShift = 0;
  let frameRequested = false;

  const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

  const storyMotionIsEnabled = () =>
    desktopStoryMedia.matches && !(reducedMedia.matches && motionStopped);

  const measureStoryScroll = () => {
    if (!storySection || !storyTrack) return;

    const isEnabled = storyMotionIsEnabled();
    storySection.classList.toggle("is-horizontal-enabled", isEnabled);

    if (!isEnabled) {
      storyMaxShift = 0;
      storySection.style.removeProperty("--story-scroll-distance");
      storyTrack.style.removeProperty("--story-shift");
      storyProgress?.style.removeProperty("--story-progress");
      return;
    }

    storyMaxShift = Math.max(storyTrack.scrollWidth - window.innerWidth, 0);
    const verticalDistance = Math.max(storyMaxShift, Math.round(window.innerHeight * 1.4));
    storySection.style.setProperty("--story-scroll-distance", `${verticalDistance}px`);
  };

  const updateScrollEffects = () => {
    frameRequested = false;
    header?.classList.toggle("is-scrolled", window.scrollY > 32);

    if (!storySection || !storyTrack || !storyMotionIsEnabled()) return;

    const scrollRange = Math.max(storySection.offsetHeight - window.innerHeight, 1);
    const sectionScroll = window.scrollY - storySection.offsetTop;
    const progress = clamp(sectionScroll / scrollRange, 0, 1);

    storyTrack.style.setProperty("--story-shift", `${-progress * storyMaxShift}px`);
    storyProgress?.style.setProperty("--story-progress", progress.toFixed(4));
  };

  const requestScrollUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  const handleViewportChange = () => {
    measureStoryScroll();
    requestScrollUpdate();
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", handleViewportChange);
  window.addEventListener("load", handleViewportChange);
  desktopStoryMedia.addEventListener("change", handleViewportChange);
  document.fonts?.ready.then(handleViewportChange);
  measureStoryScroll();
  updateScrollEffects();

  const dateInput = document.querySelector("#guest-date");
  if (dateInput instanceof HTMLInputElement) {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
    dateInput.min = new Date(today.getTime() - timezoneOffset).toISOString().split("T")[0];
  }

  const form = document.querySelector("[data-demo-form]");
  const errorMessages = {
    name: "お名前を入力してください。",
    email: "正しいメールアドレスを入力してください。",
    date: "希望日を選択してください。",
    count: "人数を選択してください。",
  };

  const setFieldError = (field, message) => {
    const errorElement = document.querySelector(`#${field.id}-error`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    field.setAttribute("aria-describedby", `${field.id}-error`);
    if (errorElement) errorElement.textContent = message;
  };

  const validateField = (field) => {
    let message = "";

    if (!field.value.trim()) {
      message = errorMessages[field.name] || "入力してください。";
    } else if (field.type === "email" && !field.validity.valid) {
      message = errorMessages.email;
    } else if (field.type === "date" && field.min && field.value < field.min) {
      message = "本日以降の日付を選択してください。";
    }

    setFieldError(field, message);
    return !message;
  };

  if (form instanceof HTMLFormElement) {
    const fields = [...form.querySelectorAll("input[required], select[required]")];
    const submitButton = form.querySelector("button[type='submit']");
    const successMessage = form.querySelector(".reservation-form__success");

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      field.addEventListener("change", () => validateField(field));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const honeypot = form.querySelector("#company-name");
      if (honeypot instanceof HTMLInputElement && honeypot.value) return;

      const validity = fields.map((field) => validateField(field));
      const firstInvalidIndex = validity.findIndex((isValid) => !isValid);

      if (firstInvalidIndex >= 0) {
        fields[firstInvalidIndex].focus();
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
        submitButton.textContent = "確認しています…";
      }

      window.setTimeout(() => {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
          submitButton.textContent = "予約内容を確認する";
        }
        if (successMessage instanceof HTMLElement) {
          successMessage.hidden = false;
          successMessage.focus();
        }
      }, 550);
    });
  }

  document.querySelectorAll(".faq details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".faq details[open]").forEach((openDetail) => {
        if (openDetail !== detail) openDetail.open = false;
      });
    });
  });
})();
