// ── UI transitions (pages, modals, profile, onboarding) ──

function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
}

// ── Perfil ──

function openProfile() {
  document.getElementById("p-stat-total").textContent =
    document.getElementById("stat-total").textContent;
  document.getElementById("p-stat-week").textContent =
    document.getElementById("stat-week").textContent;
  const streakVal = document.getElementById("stat-streak").textContent;
  const streakEl = document.getElementById("p-stat-streak");
  streakEl.textContent = streakVal;
  streakEl.style.color = parseInt(streakVal) >= 3 ? "#085041" : "";
  initReminderUI();

  const actions = document.getElementById("profile-actions");
  const howItWorksBtn = `
      <button class="profile-action-btn" onclick="closeProfile();openHowItWorks()">
        <div class="profile-action-icon">&#128218;</div>
        <div>
          <div>Como funciona</div>
          <div style="font-size:11px;font-weight:400;opacity:0.7;margin-top:1px">Ver la guia de inicio</div>
        </div>
      </button>`;
  const exportBtn = logs.length
    ? `
      <button class="profile-action-btn" onclick="exportCSV()">
        <div class="profile-action-icon">&#128229;</div>
        <div>
          <div>Descargar historial (CSV)</div>
          <div style="font-size:11px;font-weight:400;opacity:0.7;margin-top:1px">${logs.length} registro${logs.length === 1 ? "" : "s"} — útil para llevarle al médico</div>
        </div>
      </button>`
    : "";
  if (currentUser) {
    actions.innerHTML =
      howItWorksBtn +
      exportBtn +
      `
      <button class="profile-action-btn danger" onclick="doLogout()">
        <div class="profile-action-icon">&#128682;</div>
        <div>
          <div>Cerrar sesion</div>
          <div style="font-size:11px;font-weight:400;opacity:0.7;margin-top:1px">${currentUser.email}</div>
        </div>
      </button>`;
  } else {
    actions.innerHTML =
      howItWorksBtn +
      exportBtn +
      `
      <button class="profile-action-btn" onclick="closeProfile();showPage('auth')">
        <div class="profile-action-icon">&#128273;</div>
        <div>
          <div>Crear cuenta o iniciar sesion</div>
          <div style="font-size:11px;font-weight:400;opacity:0.7;margin-top:1px">Guarda tus datos en la nube</div>
        </div>
      </button>
      <button class="profile-action-btn danger" onclick="confirmClearGuest()">
        <div class="profile-action-icon">&#128465;</div>
        <div>
          <div>Borrar mis datos</div>
          <div style="font-size:11px;font-weight:400;opacity:0.7;margin-top:1px">Elimina el historial local</div>
        </div>
      </button>`;
  }
  document.getElementById("profile-modal").classList.add("open");
}

function closeProfileOutside(e) {
  if (e.target === document.getElementById("profile-modal")) closeProfile();
}

function closeProfile() {
  document.getElementById("profile-modal").classList.remove("open");
}

// ── Onboarding ──

const OB_TOTAL = 6;
let obCurrent = 0;
let obAnimating = false;

function obBuildDots() {
  const dots = document.getElementById("ob-dots");
  if (!dots) return;
  dots.innerHTML = Array.from(
    { length: OB_TOTAL },
    (_, i) =>
      '<div class="ob-dot' + (i === 0 ? " ob-dot-active" : "") + '"></div>',
  ).join("");
}

function obUpdateUI() {
  const back = document.getElementById("ob-back");
  const next = document.getElementById("ob-next");
  const skip = document.getElementById("ob-skip");
  if (!back || !next) return;
  back.style.display = obCurrent > 0 ? "inline-block" : "none";
  next.textContent = obCurrent === OB_TOTAL - 1 ? "¡Empezar!" : "Siguiente";
  if (skip)
    skip.style.display = obCurrent < OB_TOTAL - 1 ? "inline-block" : "none";
  document
    .querySelectorAll(".ob-dot")
    .forEach((d, i) => d.classList.toggle("ob-dot-active", i === obCurrent));
}

function obSkip() {
  localStorage.setItem("ob_done", "1");
  showPage("app");
}

function obGoTo(step, dir) {
  if (obAnimating) return;
  obAnimating = true;
  const slides = document.querySelectorAll(".ob-slide");
  const from = slides[obCurrent];
  const to = slides[step];
  const exitCls = dir === "next" ? "ob-exit-left" : "ob-exit-right";

  from.classList.remove("ob-active");
  from.classList.add(exitCls);

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      to.classList.add("ob-active");
    }),
  );

  setTimeout(() => {
    from.classList.remove(exitCls);
    obAnimating = false;
  }, 370);

  obCurrent = step;
  obUpdateUI();
}

function obNext() {
  if (obCurrent < OB_TOTAL - 1) {
    obGoTo(obCurrent + 1, "next");
  } else {
    localStorage.setItem("ob_done", "1");
    showPage("app");
  }
}

function obBack() {
  if (obCurrent > 0) obGoTo(obCurrent - 1, "back");
}

function openHowItWorks() {
  obCurrent = 0;
  document.querySelectorAll(".ob-slide").forEach((s, i) => {
    s.classList.remove("ob-active", "ob-exit-left", "ob-exit-right");
    if (i === 0) s.classList.add("ob-active");
  });
  obUpdateUI();
  document.getElementById("ob-next").textContent = "Siguiente";
  document.getElementById("ob-back").style.display = "none";
  showPage("onboarding");
}

// ── Formulario de registro (selector de tipo, esfuerzo, fecha/hora) ──

function selectType(el) {
  document
    .querySelectorAll(".type-item")
    .forEach((i) => i.classList.remove("selected"));
  el.classList.add("selected");
  selectedType = el.dataset.type;
}

function selectEffort(el) {
  document
    .querySelectorAll(".effort-btn")
    .forEach((b) => (b.className = "effort-btn"));
  el.classList.add("sel-" + el.dataset.effort);
  selectedEffort = el.dataset.effort;
}

function initTimeToggle() {
  const now = new Date();
  const h1 = new Date(now - 3600000);
  const ayer = new Date(now);
  ayer.setDate(ayer.getDate() - 1);
  ayer.setHours(8, 0, 0, 0);
  const d2 = new Date(now);
  d2.setDate(d2.getDate() - 2);
  d2.setHours(8, 0, 0, 0);
  document.getElementById("q-label-1").textContent = h1.toLocaleTimeString(
    "es-CO",
    { hour: "2-digit", minute: "2-digit" },
  );
  document.getElementById("q-label-24").textContent = ayer.toLocaleDateString(
    "es-CO",
    { weekday: "short", day: "numeric" },
  );
  document.getElementById("q-label-48").textContent = d2.toLocaleDateString(
    "es-CO",
    { weekday: "short", day: "numeric" },
  );
  const dateVal =
    now.getFullYear() +
    "-" +
    pad2(now.getMonth() + 1) +
    "-" +
    pad2(now.getDate());
  document.getElementById("custom-date").value = dateVal;
  document.getElementById("custom-time").value = "08:00";
  selectedDateTime = ayer;
  document.getElementById("time-pill").textContent = "Ayer a las 08:00";
}

function toggleTime() {
  isNow = !isNow;
  document.getElementById("now-toggle").classList.toggle("on", isNow);
  document.getElementById("datetime-panel").classList.toggle("open", !isNow);
  document.getElementById("toggle-sub").textContent = isNow
    ? "Registrando para ahora mismo"
    : "Elige cuando fue";
  document.getElementById("btn-submit").textContent = isNow
    ? "Registrar popo"
    : "Registrar popo pasado";
}

function selectQuick(el) {
  document
    .querySelectorAll(".quick-btn")
    .forEach((b) => b.classList.remove("sel"));
  el.classList.add("sel");
  const offset = parseInt(el.dataset.offset);
  const now = new Date();
  const d = new Date(now - offset * 3600000);
  if (offset >= 24) d.setHours(8, 0, 0, 0);
  selectedDateTime = d;
  document.getElementById("custom-date").value =
    d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  document.getElementById("custom-time").value =
    pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  document.getElementById("time-pill").textContent = formatDateTime(d);
}

function updateCustomDt() {
  document
    .querySelectorAll(".quick-btn")
    .forEach((b) => b.classList.remove("sel"));
  const ds = document.getElementById("custom-date").value;
  const ts = document.getElementById("custom-time").value;
  if (!ds || !ts) return;
  selectedDateTime = new Date(ds + "T" + ts);
  document.getElementById("time-pill").textContent =
    formatDateTime(selectedDateTime);
}

// ── Menús de acciones en el historial (⋯) ──

let openMenuId = null;

function closeAllMenus() {
  document
    .querySelectorAll(".log-menu-popup.open")
    .forEach((m) => m.classList.remove("open"));
  openMenuId = null;
}

document.addEventListener("click", function (e) {
  if (
    !e.target.closest(".log-menu-btn") &&
    !e.target.closest(".log-menu-popup")
  )
    closeAllMenus();
});

function toggleMenu(id, event) {
  event.stopPropagation();
  const popup = document.getElementById("menu-" + id);
  if (!popup) return;
  const isOpen = popup.classList.contains("open");
  closeAllMenus();
  if (!isOpen) {
    popup.classList.add("open");
    openMenuId = id;
  }
}

// ── Modal de edición de un registro ──

let editingId = null;
let editType = "4";
let editEffort = null;

function openEdit(id) {
  closeAllMenus();
  const log = logs.find(
    (l) => (l.id || l.created_at || l.time.toISOString()) == id,
  );
  if (!log) return;
  editingId = id;
  editType = log.type;
  editEffort = log.effort;
  document.querySelectorAll("#edit-type-list .type-item").forEach((el) => {
    el.classList.toggle("selected", el.dataset.type === log.type);
  });
  document.querySelectorAll(".edit-effort-grid .effort-btn").forEach((el) => {
    el.className = "effort-btn";
    if (el.dataset.effort === log.effort) el.classList.add("sel-" + log.effort);
  });
  document.getElementById("edit-notes").value = log.notes || "";
  const d = log.time;
  document.getElementById("edit-date").value =
    d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  document.getElementById("edit-time").value =
    pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  document.getElementById("edit-backdrop").classList.add("open");
}

function closeEdit() {
  document.getElementById("edit-backdrop").classList.remove("open");
  editingId = null;
}

function closeEditOutside(e) {
  if (e.target === document.getElementById("edit-backdrop")) closeEdit();
}

function editSelectType(el) {
  document
    .querySelectorAll("#edit-type-list .type-item")
    .forEach((i) => i.classList.remove("selected"));
  el.classList.add("selected");
  editType = el.dataset.type;
}

function editSelectEffort(el) {
  document
    .querySelectorAll(".edit-effort-grid .effort-btn")
    .forEach((b) => (b.className = "effort-btn"));
  el.classList.add("sel-" + el.dataset.effort);
  editEffort = el.dataset.effort;
}

// ── Filtros del historial ──

function toggleFilters() {
  const panel = document.getElementById("filter-panel");
  panel.classList.toggle("open");
}

function setFilter(key, value) {
  filters[key] = value;
  updateFilterBadge();
  renderList();
}

function clearFilters() {
  filters = { type: "", from: "", to: "", search: "" };
  document.getElementById("filter-search").value = "";
  document.getElementById("filter-type").value = "";
  document.getElementById("filter-from").value = "";
  document.getElementById("filter-to").value = "";
  updateFilterBadge();
  renderList();
}

function countActiveFilters() {
  return Object.values(filters).filter((v) => v !== "").length;
}

function updateFilterBadge() {
  const count = countActiveFilters();
  const toggle = document.getElementById("filter-toggle");
  const badge = document.getElementById("filter-count");
  toggle.classList.toggle("active", count > 0);
  badge.textContent = count > 0 ? count : "";
  badge.classList.toggle("show", count > 0);
}

function applyFilters(list) {
  return list.filter((l) => {
    if (filters.type !== "" && String(l.type) !== filters.type) return false;
    if (filters.from) {
      const from = new Date(filters.from + "T00:00:00");
      if (l.time < from) return false;
    }
    if (filters.to) {
      const to = new Date(filters.to + "T23:59:59");
      if (l.time > to) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!(l.notes || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

// ── Recordatorio diario ──
// Limitación: sin backend propio no podemos garantizar notificaciones cuando
// la app está cerrada. Lo que sí hacemos:
//  1. Al abrir la app, si ya pasó la hora y no registraste, notificamos.
//  2. Mientras la app está abierta, programamos timer para la hora exacta.
//  3. En PWAs instaladas, intentamos Periodic Background Sync (best effort).

let reminderTimer = null;

function loadReminderSettings() {
  return {
    enabled: localStorage.getItem("pooplog_reminder_enabled") === "1",
    time: localStorage.getItem("pooplog_reminder_time") || "20:00",
  };
}

function initReminderUI() {
  const { enabled, time } = loadReminderSettings();
  document.getElementById("reminder-toggle").classList.toggle("on", enabled);
  document.getElementById("reminder-time").value = time;
  document
    .getElementById("reminder-time-row")
    .classList.toggle("open", enabled);
  updateReminderNote();
}

function updateReminderNote() {
  const note = document.getElementById("reminder-note");
  if (!("Notification" in window)) {
    note.textContent = "Tu navegador no soporta notificaciones.";
    note.className = "reminder-note show warn";
    return;
  }
  const { enabled } = loadReminderSettings();
  if (!enabled) {
    note.className = "reminder-note";
    return;
  }
  if (Notification.permission === "denied") {
    note.textContent =
      "Bloqueaste las notificaciones. Actívalas en ajustes del navegador.";
    note.className = "reminder-note show warn";
  } else if (Notification.permission === "default") {
    note.textContent = "Necesitamos tu permiso para enviarte el recordatorio.";
    note.className = "reminder-note show warn";
  } else {
    note.textContent =
      "Si la app está cerrada, el recordatorio puede no llegar. Ábrela al menos una vez al día.";
    note.className = "reminder-note show";
  }
}

async function toggleReminder() {
  const { enabled } = loadReminderSettings();
  const newEnabled = !enabled;

  if (newEnabled) {
    if (!("Notification" in window)) {
      showToast("Tu navegador no soporta notificaciones");
      return;
    }
    let perm = Notification.permission;
    if (perm === "default") {
      perm = await Notification.requestPermission();
    }
    if (perm !== "granted") {
      showToast("Sin permiso no podemos avisarte");
      updateReminderNote();
      return;
    }
  }

  localStorage.setItem("pooplog_reminder_enabled", newEnabled ? "1" : "0");
  document.getElementById("reminder-toggle").classList.toggle("on", newEnabled);
  document
    .getElementById("reminder-time-row")
    .classList.toggle("open", newEnabled);
  updateReminderNote();
  scheduleReminder();
  if (newEnabled) showToast("Recordatorio activado");
}

function setReminderTime(time) {
  localStorage.setItem("pooplog_reminder_time", time);
  scheduleReminder();
  showToast("Hora guardada: " + time);
}

function fireReminderNotification() {
  if (Notification.permission !== "granted") return;
  if (loggedToday()) return;
  try {
    new Notification("💩 PoopLog", {
      body: "¿Ya registraste tu popo de hoy?",
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
      tag: "pooplog-daily-reminder",
    });
  } catch (e) {
    // Algunos contextos requieren pasar por el service worker.
    if (navigator.serviceWorker?.ready) {
      navigator.serviceWorker.ready.then((reg) =>
        reg.showNotification("💩 PoopLog", {
          body: "¿Ya registraste tu popo de hoy?",
          icon: "icons/icon-192.png",
          badge: "icons/icon-192.png",
          tag: "pooplog-daily-reminder",
        }),
      );
    }
  }
}

function scheduleReminder() {
  if (reminderTimer) {
    clearTimeout(reminderTimer);
    reminderTimer = null;
  }

  const { enabled, time } = loadReminderSettings();
  if (!enabled || Notification.permission !== "granted") return;

  const [hh, mm] = time.split(":").map(Number);
  const now = new Date();

  // Próxima hora: hoy si aún no pasó; si ya pasó, mañana.
  const next = new Date(now);
  next.setHours(hh, mm, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  const ms = next - now;
  reminderTimer = setTimeout(() => {
    fireReminderNotification();
    scheduleReminder(); // reprograma para mañana
  }, ms);
}

function checkMissedReminder() {
  const { enabled, time } = loadReminderSettings();
  if (!enabled || Notification.permission !== "granted") return;
  if (loggedToday()) return;

  const [hh, mm] = time.split(":").map(Number);
  const now = new Date();
  const todayReminder = new Date(now);
  todayReminder.setHours(hh, mm, 0, 0);
  if (now >= todayReminder) {
    fireReminderNotification();
  }
}
