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
    if (event.key === "Escape") {
      closeNavigation();
      menuButton?.focus();
    }
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

  let frameRequested = false;

  const updateScrollEffects = () => {
    frameRequested = false;
    header?.classList.toggle("is-scrolled", window.scrollY > 32);
  };

  const requestScrollUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
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
