// ── AUTH UI (tabs de login/register) ──

function switchTab(tab) {
  ["login", "register"].forEach((t) => {
    document.getElementById("tab-" + t).classList.toggle("active", t === tab);
  });
  switchPanel(tab);
}

function switchPanel(panel) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("panel-" + panel).classList.add("active");
}

// ── AUTH ACTIONS ──

async function doLogin() {
  clearError("login-error");
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  if (!email || !pass) {
    showError("login-error", "Completa todos los campos.");
    return;
  }
  const btn = document.getElementById("btn-login");
  btn.disabled = true;
  btn.textContent = "Entrando...";
  const { error } = await sb.auth.signInWithPassword({ email, password: pass });
  btn.disabled = false;
  btn.textContent = "Entrar";
  if (error)
    showError(
      "login-error",
      error.message === "Invalid login credentials"
        ? "Correo o contraseña incorrectos."
        : error.message,
    );
}

async function doRegister() {
  clearError("register-error");
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value;
  const pass2 = document.getElementById("reg-pass2").value;
  if (!email || !pass) {
    showError("register-error", "Completa todos los campos.");
    return;
  }
  if (pass.length < 8) {
    showError(
      "register-error",
      "La contraseña debe tener mínimo 8 caracteres.",
    );
    return;
  }
  if (pass !== pass2) {
    showError("register-error", "Las contraseñas no coinciden.");
    return;
  }
  const btn = document.getElementById("btn-register");
  btn.disabled = true;
  btn.textContent = "Creando cuenta...";
  const { error } = await sb.auth.signUp({ email, password: pass });
  btn.disabled = false;
  btn.textContent = "Crear cuenta";
  if (error) {
    showError("register-error", error.message);
    return;
  }
  document.getElementById("verify-email-show").textContent = email;
  switchPanel("verify");
}

async function doGoogle() {
  await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
}

async function doReset() {
  clearError("reset-error");
  const email = document.getElementById("reset-email").value.trim();
  if (!email) {
    showError("reset-error", "Ingresa tu correo.");
    return;
  }
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.href,
  });
  if (error) {
    showError("reset-error", error.message);
    return;
  }
  document.getElementById("verify-email-show").textContent = email;
  switchPanel("verify");
}

async function doLogout() {
  closeProfile();
  if (!confirm("¿Cerrar sesión?")) return;
  localStorage.removeItem("pooplog_guest_mode");
  await sb.auth.signOut();
  showPage("auth");
}

// ── MODO INVITADO ──

function enterAsGuest() {
  currentUser = null;
  // Persistir la marca para que al recargar la app se restaure el modo invitado
  // en vez de mandar al usuario al login.
  localStorage.setItem("pooplog_guest_mode", "1");
  setupGuestUI();
  initTimeToggle();
  logs = JSON.parse(localStorage.getItem("pooplog_guest") || "[]").map((l) => ({
    ...l,
    time: new Date(l.time),
  }));
  updateWeeklyBar();
  updateUI();
  if (!localStorage.getItem("ob_done")) {
    obBuildDots();
    obUpdateUI();
    showPage("onboarding");
  } else {
    showPage("app");
  }
}

function setupGuestUI() {
  document.getElementById("user-avatar").textContent = "👤";
  document.getElementById("user-email-display").textContent = "Invitado";
  document.getElementById("profile-avatar-lg").textContent = "👤";
  document.getElementById("profile-name-display").textContent = "Invitado";
  document.getElementById("profile-email-display").textContent = "Sin cuenta";
  document.getElementById("profile-since").textContent =
    "Los datos se guardan solo en este dispositivo";
  document.getElementById("guest-banner").style.display = "flex";
}

function confirmClearGuest() {
  closeProfile();
  if (
    confirm("¿Borrar todo el historial de invitado? Esto no se puede deshacer.")
  ) {
    localStorage.removeItem("pooplog_guest");
    localStorage.removeItem("pooplog_guest_mode");
    logs = [];
    updateUI();
    showPage("auth");
    showToast("Historial borrado");
  }
}
