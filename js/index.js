const themeButtons = document.querySelectorAll("[data-theme-choice]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const accountSection = document.querySelector("#conta");
const breadcrumbDivider = document.querySelector("#breadcrumb-divider");
const breadcrumbCurrent = document.querySelector("#breadcrumb-current");
const breadcrumbHome = document.querySelector("#breadcrumb-home");
const createPartyLabel = document.querySelector("#create-party-label");
const topbarAccountLabel = document.querySelector("#topbar-account-label");
const authPlatformNote = document.querySelector("#auth-platform-note");
const authViews = document.querySelectorAll("[data-auth-view]");
const sidebar = document.querySelector("#sidebar");
const sidebarBrand = sidebar.querySelector(".brand");
const menuToggle = document.querySelector("#menu-toggle");
const menuBackdrop = document.querySelector("[data-menu-close]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const profileMenuButton = document.querySelector("#profile-menu-button");
const profileDropdown = document.querySelector("#profile-dropdown");
const profileMenuFeedback = document.querySelector(".profile-menu-feedback");
const signupForm = document.querySelector('[data-auth-form="signup"]');
const usernameForm = document.querySelector('[data-auth-form="username"]');

function setLoggedIn(isLoggedIn) {
  document.body.dataset.authenticated = String(isLoggedIn);
  topbarAccountLabel.textContent = isLoggedIn ? "Minha conta" : "Log In/Sign up";
}

setLoggedIn(document.body.dataset.authenticated === "true");

function setMenuOpen(isOpen) {
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  sidebar.setAttribute("aria-hidden", String(!isOpen));
  sidebar.toggleAttribute("inert", !isOpen);
  menuBackdrop.hidden = !isOpen;

  if (!isOpen) {
    profileDropdown.hidden = true;
    profileMenuButton.setAttribute("aria-expanded", "false");
  }
}

function setAuthView(viewName, focusFirstInput) {
  authViews.forEach((view) => {
    view.hidden = view.dataset.authView !== viewName;
  });

  const activeView = document.querySelector(`[data-auth-view="${viewName}"]`);
  const firstInput = activeView ? activeView.querySelector("input") : null;
  if (focusFirstInput && firstInput) {
    firstInput.focus({ preventScroll: true });
  }
}

function resetHome() {
  document.body.dataset.theme = "home";
  themeButtons.forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
  authPlatformNote.textContent = "";
  createPartyLabel.textContent = "Começar uma watch party";
  breadcrumbDivider.hidden = true;
  breadcrumbCurrent.textContent = "";
  breadcrumbCurrent.hidden = true;
  themeColor.setAttribute("content", "#f4f0ea");
}

function validateField(input) {
  let message = "";

  if (input.required && input.value.length === 0) {
    message = "Este campo é obrigatório.";
  } else if (input.type === "email" && input.validity.typeMismatch) {
    message = "Informe um e-mail válido.";
  } else if (input.minLength > 0 && input.value.length > 0 && input.value.length < input.minLength) {
    message = `Informe pelo menos ${input.minLength} caracteres.`;
  } else if (input.validity.patternMismatch) {
    message = input.title || "O formato informado não é válido.";
  } else if (
    input.name === "password-confirm"
    && input.value !== signupForm.elements.namedItem("password").value
  ) {
    message = "As senhas precisam ser iguais.";
  }

  const error = input.closest(".form-field").querySelector("[data-field-error]");
  error.textContent = message;
  error.hidden = !message;
  input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

function validateForm(form) {
  const inputs = Array.from(form.querySelectorAll("input[required]"));
  const isValid = inputs.map(validateField).every(Boolean);
  if (!isValid) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid.focus();
  }
  return isValid;
}

document.querySelectorAll(".auth-form input").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") {
      validateField(input);
    }

    if (
      input.form === signupForm
      && input.name === "password"
      && signupForm.elements.namedItem("password-confirm").getAttribute("aria-invalid") === "true"
    ) {
      validateField(signupForm.elements.namedItem("password-confirm"));
    }
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenuOpen(isOpen);
  if (isOpen) {
    sidebar.querySelector("[data-theme-choice]").focus();
  }
});

sidebarBrand.addEventListener("click", () => {
  resetHome();
  setMenuOpen(false);
  menuToggle.focus({ preventScroll: true });
});

breadcrumbHome.addEventListener("click", resetHome);

menuCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMenuOpen(false);
    menuToggle.focus({ preventScroll: true });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (profileDropdown.hidden === false) {
    profileDropdown.hidden = true;
    profileMenuButton.setAttribute("aria-expanded", "false");
    profileMenuButton.focus({ preventScroll: true });
  } else if (document.body.classList.contains("menu-open")) {
    setMenuOpen(false);
    menuToggle.focus({ preventScroll: true });
  }
});

profileMenuButton.addEventListener("click", () => {
  const isOpen = profileMenuButton.getAttribute("aria-expanded") !== "true";
  profileDropdown.hidden = !isOpen;
  profileMenuButton.setAttribute("aria-expanded", String(isOpen));
  profileMenuFeedback.textContent = "";
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.themeChoice;
    const platform = theme === "spotify" ? "Spotify" : "YouTube";

    document.body.dataset.theme = theme;
    themeButtons.forEach((option) => {
      const isSelected = option === button;
      option.classList.toggle("active", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
    });

    authPlatformNote.textContent = `Pronto para criar sua sala no ${platform}.`;
    createPartyLabel.textContent = `Começar uma watch party no ${platform}`;
    breadcrumbDivider.hidden = false;
    breadcrumbCurrent.textContent = platform;
    breadcrumbCurrent.hidden = false;
    themeColor.setAttribute(
      "content",
      theme === "spotify" ? "#edf5ef" : "#f1f3f5",
    );

    setMenuOpen(false);
    menuToggle.focus({ preventScroll: true });
  });
});

document.querySelectorAll("[data-auth-open]").forEach((button) => {
  button.addEventListener("click", () => {
    setAuthView(button.dataset.authOpen, true);
  });
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm(signupForm)) {
    return;
  }

  signupForm.reset();
  setAuthView("username", true);
});

usernameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm(usernameForm)) {
    return;
  }

  const username = usernameForm.elements.namedItem("username").value.trim();
  const feedback = usernameForm.querySelector("[data-form-feedback]");
  const profileName = document.querySelector("[data-profile-name]");
  const profileStatus = document.querySelector("[data-profile-status]");
  const profileAvatar = document.querySelector("[data-profile-avatar]");

  profileName.textContent = username;
  profileStatus.textContent = "Prévia local — não conectado";
  profileAvatar.textContent = username.charAt(0).toUpperCase();
  feedback.textContent =
    "Nome escolhido nesta prévia. Nenhum dado foi enviado ou salvo: a conta depende da integração com o servidor.";
});

document.querySelectorAll('[data-auth-form="login"], [data-auth-form="reset"]').forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm(form)) {
      return;
    }

    const feedback = form.querySelector("[data-form-feedback]");

    feedback.textContent =
      form.dataset.authForm === "reset"
        ? "A recuperação de senha ainda não está conectada ao servidor. Nenhum e-mail foi enviado."
        : "A autenticação ainda não está conectada ao servidor. Nenhum dado foi enviado.";
  });
});

document.querySelectorAll("[data-account-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.accountAction;
    const messages = {
      settings: "As configurações da conta estarão disponíveis após a integração com o servidor.",
      privacy: "As opções de privacidade estarão disponíveis após a integração com o servidor.",
      notifications: "As preferências de notificação estarão disponíveis em breve.",
    };

    if (action !== "signout") {
      profileMenuFeedback.textContent = messages[action];
      return;
    }

    document.querySelector("[data-profile-name]").textContent = "Visitante";
    document.querySelector("[data-profile-status]").textContent = "Que bom ter você aqui";
    document.querySelector("[data-profile-avatar]").textContent = "V";
    setLoggedIn(false);
    profileMenuFeedback.textContent = "";
    setMenuOpen(false);
    menuToggle.focus({ preventScroll: true });
    setAuthView("login", false);

    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    accountSection.scrollIntoView({ behavior, block: "start" });
  });
});
