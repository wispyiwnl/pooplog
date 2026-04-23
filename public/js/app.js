// ── INIT / BOOTSTRAP ──
// Este archivo es el punto de entrada. Se carga al final, después de todos los
// demás (constants, data, auth, score, calendar, ui). Su único trabajo es
// orquestar el arranque: fallback de seguridad, suscripción a auth, PWA.

// Red de seguridad permanente: si por lo que sea seguimos en page-loading
// después de 5 segundos, escapamos. Se deja corriendo sin cancelar — si la UI
// ya avanzó, el if falla y no hace nada. Más robusto que clearTimeout porque
// también rescata de hangs mid-flow (ej. loadLogs colgado).
setTimeout(() => {
  if (document.querySelector(".page.active")?.id === "page-loading") {
    if (localStorage.getItem("pooplog_guest_mode") === "1") {
      enterAsGuest();
    } else {
      showPage("auth");
    }
  }
}, 5000);

sb.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    currentUser = session.user;
    // Si venía de modo invitado, lo desactivamos: ahora tiene cuenta real.
    localStorage.removeItem("pooplog_guest_mode");

    const email = currentUser.email || "";
    const initials = email.slice(0, 2).toUpperCase();
    const sinceDate = new Date(currentUser.created_at).toLocaleDateString(
      "es-CO",
      { year: "numeric", month: "long", day: "numeric" },
    );

    // chip
    document.getElementById("user-email-display").textContent = email;
    document.getElementById("user-avatar").textContent = initials;

    // profile modal
    document.getElementById("profile-avatar-lg").textContent = initials;
    document.getElementById("profile-name-display").textContent =
      email.split("@")[0];
    document.getElementById("profile-email-display").textContent = email;
    document.getElementById("profile-since").textContent =
      "Miembro desde " + sinceDate;
    document.getElementById("logout-email-hint") &&
      (document.getElementById("logout-email-hint").textContent = email);
    document.getElementById("guest-banner").style.display = "none";

    // Transicionar la UI YA — antes de cualquier await — para no quedar
    // atrapados si loadLogs() no responde.
    if (!localStorage.getItem("ob_done")) {
      obBuildDots();
      obUpdateUI();
      showPage("onboarding");
    } else {
      showPage("app");
    }

    // Cargar datos en background. Si falla, la UI ya está visible con datos
    // vacíos; el usuario puede reintentar manualmente.
    initTimeToggle();
    updateWeeklyBar();
    // Primero migrar datos de invitado (si hay), después cargar logs
    // para que el usuario vea todo junto.
    migrateGuestDataIfAny(currentUser)
      .then(() => loadLogs())
      .catch(() => {});
  } else {
    currentUser = null;
    // Si venía en modo invitado, restaurarlo en vez de mandarlo al login.
    if (localStorage.getItem("pooplog_guest_mode") === "1") {
      enterAsGuest();
    } else {
      showPage("auth");
    }
  }
});

// ── PWA: registrar service worker + recordatorio periódico ──
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      // Intentar Periodic Background Sync — solo funciona en PWAs instaladas
      // en Chrome Android con suficiente engagement. Best effort, sin bloquear.
      if ("periodicSync" in reg) {
        try {
          const status = await navigator.permissions.query({
            name: "periodic-background-sync",
          });
          if (status.state === "granted") {
            await reg.periodicSync.register("daily-reminder", {
              minInterval: 24 * 60 * 60 * 1000,
            });
          }
        } catch (e) {}
      }
    } catch (e) {}
  });
}

// Al cargar la app, programar el recordatorio para hoy y avisar si ya se pasó
// la hora sin registrar.
window.addEventListener("load", () => {
  // Esperar un tick para que logs esté cargado.
  setTimeout(() => {
    scheduleReminder();
    checkMissedReminder();
  }, 1500);
});
