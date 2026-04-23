// Inicialización segura — keys vienen de config.js (no está en GitHub)
const { SUPABASE_URL, SUPABASE_KEY } = window.POOPLOG_CONFIG;
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const typeNames = {
  0: "Día sin popo",
  1: "Tipo 1 — Bolitas",
  2: "Tipo 2 — Grumoso",
  3: "Tipo 3 — Con grietas",
  4: "Tipo 4 — Ideal",
  5: "Tipo 5 — Trozos",
  6: "Tipo 6 — Esponjoso",
  7: "Tipo 7 — Líquido",
};
const effortLabels = {
  none: "Sin actividad",
  smooth: "Solo",
  bit: "Poco esfuerzo",
  hard: "Con esfuerzo",
  brutal: "Una lucha",
};
const effortBadge = {
  none: "badge-none",
  smooth: "badge-smooth",
  bit: "badge-bit",
  hard: "badge-hard",
  brutal: "badge-brutal",
};
const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const scoreFaces = {
  good: `<svg viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="24" fill="#7B4A2D"/><circle cx="26" cy="26" r="20" fill="#8B5A3A"/><ellipse cx="19" cy="22" rx="2.5" ry="3" fill="#5C3018"/><ellipse cx="33" cy="22" rx="2.5" ry="3" fill="#5C3018"/><circle cx="19" cy="21" r="1" fill="#F5E6D3"/><circle cx="33" cy="21" r="1" fill="#F5E6D3"/><path d="M17 32 Q26 38 35 32" stroke="#5C3018" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M13 13 Q17 9 19 13" stroke="#5C3018" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M33 13 Q35 9 39 13" stroke="#5C3018" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  mid: `<svg viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="24" fill="#7B4A2D"/><circle cx="26" cy="26" r="20" fill="#8B5A3A"/><ellipse cx="19" cy="22" rx="2.5" ry="2.5" fill="#5C3018"/><ellipse cx="33" cy="22" rx="2.5" ry="2.5" fill="#5C3018"/><circle cx="19" cy="21" r="1" fill="#F5E6D3"/><circle cx="33" cy="21" r="1" fill="#F5E6D3"/><path d="M18 33 Q26 33 34 33" stroke="#5C3018" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  bad: `<svg viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="24" fill="#7B4A2D"/><circle cx="26" cy="26" r="20" fill="#8B5A3A"/><ellipse cx="19" cy="23" rx="3" ry="2.5" fill="#5C3018"/><ellipse cx="33" cy="23" rx="3" ry="2.5" fill="#5C3018"/><circle cx="19" cy="22" r="1" fill="#F5E6D3"/><circle cx="33" cy="22" r="1" fill="#F5E6D3"/><path d="M18 35 Q26 31 34 35" stroke="#5C3018" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M14 15 L17 18M21 13 L20 17" stroke="#5C3018" stroke-width="2" stroke-linecap="round"/><path d="M38 15 L35 18M31 13 L32 17" stroke="#5C3018" stroke-width="2" stroke-linecap="round"/></svg>`,
  neutral: `<svg viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="24" fill="#D3D1C7"/><circle cx="26" cy="26" r="20" fill="#B4B2A9"/><ellipse cx="19" cy="22" rx="2.5" ry="3" fill="#888780"/><ellipse cx="33" cy="22" rx="2.5" ry="3" fill="#888780"/><circle cx="19" cy="21" r="1" fill="#F1EFE8"/><circle cx="33" cy="21" r="1" fill="#F1EFE8"/><path d="M19 33 Q26 37 33 33" stroke="#888780" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
};
const svgs = {
  0: `<svg viewBox="0 0 52 40" fill="none"><circle cx="26" cy="20" r="14" fill="#D3D1C7"/><line x1="16" y1="20" x2="36" y2="20" stroke="#888780" stroke-width="3" stroke-linecap="round"/></svg>`,
  1: `<svg viewBox="0 0 52 40" fill="none"><circle cx="10" cy="12" r="6" fill="#7B4A2D"/><circle cx="22" cy="8" r="5" fill="#6B3D22"/><circle cx="33" cy="13" r="6" fill="#7B4A2D"/><circle cx="16" cy="26" r="5" fill="#6B3D22"/><circle cx="28" cy="29" r="4" fill="#7B4A2D"/><circle cx="41" cy="22" r="5" fill="#6B3D22"/></svg>`,
  2: `<svg viewBox="0 0 52 40" fill="none"><ellipse cx="26" cy="22" rx="20" ry="11" fill="#6B3D22"/><circle cx="14" cy="18" r="7" fill="#7B4A2D"/><circle cx="24" cy="14" r="7" fill="#6B3D22"/><circle cx="34" cy="18" r="7" fill="#7B4A2D"/><circle cx="19" cy="26" r="6" fill="#6B3D22"/><circle cx="31" cy="26" r="6" fill="#7B4A2D"/></svg>`,
  3: `<svg viewBox="0 0 52 40" fill="none"><rect x="8" y="12" width="36" height="18" rx="9" fill="#7B4A2D"/><path d="M14 15 Q18 13 22 16 Q26 13 30 16 Q34 13 38 16" stroke="#5C3018" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M12 20 Q16 18 20 21 Q24 18 28 21 Q32 18 36 21 Q40 18 42 21" stroke="#5C3018" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  4: `<svg viewBox="0 0 52 40" fill="none"><ellipse cx="26" cy="20" rx="10" ry="16" fill="#7B4A2D"/><ellipse cx="26" cy="20" rx="6" ry="13" fill="#8B5A3A"/></svg>`,
  5: `<svg viewBox="0 0 52 40" fill="none"><ellipse cx="12" cy="16" rx="8" ry="6" fill="#7B4A2D"/><ellipse cx="27" cy="12" rx="9" ry="6" fill="#6B3D22"/><ellipse cx="40" cy="17" rx="7" ry="5" fill="#7B4A2D"/><ellipse cx="20" cy="28" rx="8" ry="5" fill="#6B3D22"/><ellipse cx="35" cy="29" rx="7" ry="5" fill="#7B4A2D"/></svg>`,
  6: `<svg viewBox="0 0 52 40" fill="none"><path d="M6 22 Q10 14 18 18 Q22 10 30 16 Q36 8 44 18 Q48 24 42 28 Q34 34 24 30 Q14 34 8 28 Z" fill="#8B5A3A"/><path d="M10 20 Q14 15 20 18 Q25 12 32 17 Q38 12 44 20" stroke="#6B3D22" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  7: `<svg viewBox="0 0 52 40" fill="none"><ellipse cx="26" cy="28" rx="22" ry="7" fill="#C4863A" opacity="0.5"/><ellipse cx="26" cy="26" rx="20" ry="5" fill="#C4863A" opacity="0.7"/><ellipse cx="22" cy="22" rx="14" ry="4" fill="#B87A30" opacity="0.8"/><ellipse cx="30" cy="20" rx="10" ry="3" fill="#A06828"/></svg>`,
};

let selectedType = "4";
let selectedEffort = null;
let logs = [];
let currentUser = null;
let isNow = true;
let selectedDateTime = new Date();
let calViewYear = new Date().getFullYear();
let calViewMonth = new Date().getMonth();

const CAL_MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const CAL_DAYS = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];

function pad2(n) {
  return String(n).padStart(2, "0");
}
function formatDateTime(d) {
  return (
    d.toLocaleDateString("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) +
    " a las " +
    d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
  );
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

function openCal() {
  calViewYear = new Date().getFullYear();
  calViewMonth = new Date().getMonth();
  renderCal();
  document.getElementById("cal-detail").innerHTML =
    '<div class="cal-detail-empty">Toca un dia con registros para ver el detalle</div>';
  document.getElementById("cal-backdrop").classList.add("open");
}
function closeCal() {
  document.getElementById("cal-backdrop").classList.remove("open");
}
function closeCalOutside(e) {
  if (e.target === document.getElementById("cal-backdrop")) closeCal();
}
function changeCalMonth(dir) {
  calViewMonth += dir;
  if (calViewMonth > 11) {
    calViewMonth = 0;
    calViewYear++;
  }
  if (calViewMonth < 0) {
    calViewMonth = 11;
    calViewYear--;
  }
  renderCal();
  document.getElementById("cal-detail").innerHTML =
    '<div class="cal-detail-empty">Toca un dia con registros para ver el detalle</div>';
}

function renderCal() {
  document.getElementById("cal-month-title").textContent =
    CAL_MONTHS[calViewMonth] + " " + calViewYear;
  const grid = document.getElementById("cal-grid");
  const firstDay = new Date(calViewYear, calViewMonth, 1);
  const lastDay = new Date(calViewYear, calViewMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const todayStr = new Date().toDateString();
  let cells = [];
  for (let i = 0; i < startDow; i++) {
    cells.push({
      date: new Date(calViewYear, calViewMonth, 1 - startDow + i),
      current: false,
    });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    cells.push({ date: new Date(calViewYear, calViewMonth, i), current: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      current: false,
    });
  }
  grid.innerHTML = cells
    .map(({ date, current }) => {
      const y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
      const dayLogs = current
        ? logs.filter(
            (l) =>
              l.time.getFullYear() === y &&
              l.time.getMonth() === m &&
              l.time.getDate() === d,
          )
        : [];
      const isToday = date.toDateString() === todayStr;
      const hasData = dayLogs.length > 0;
      const show = dayLogs.slice(0, 2);
      const extra = dayLogs.length - show.length;
      return (
        '<div class="cal-day' +
        (!current ? " other-month" : "") +
        (isToday ? " today" : "") +
        (hasData ? " has-data" : "") +
        '"' +
        (hasData
          ? ' onclick="showCalDetail(' + y + "," + m + "," + d + ')"'
          : "") +
        ">" +
        '<div class="cal-day-num">' +
        d +
        "</div>" +
        '<div class="cal-day-svgs">' +
        show
          .map((l) => '<div class="poop-mini">' + svgs[l.type] + "</div>")
          .join("") +
        (extra > 0 ? '<div class="dot-more"></div>' : "") +
        "</div></div>"
      );
    })
    .join("");
}

function showCalDetail(y, m, d) {
  const dayLogs = logs.filter(
    (l) =>
      l.time.getFullYear() === y &&
      l.time.getMonth() === m &&
      l.time.getDate() === d,
  );
  const dateStr = new Date(y, m, d).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const detail = document.getElementById("cal-detail");
  detail.innerHTML =
    '<div class="cal-detail-title">' +
    dateStr +
    " — " +
    dayLogs.length +
    " registro" +
    (dayLogs.length !== 1 ? "s" : "") +
    "</div>" +
    '<div class="cal-detail-list">' +
    dayLogs
      .map(
        (l) =>
          '<div class="cal-detail-item"><div class="cal-detail-icon">' +
          svgs[l.type] +
          "</div>" +
          '<div class="cal-detail-info"><div class="cal-detail-type">' +
          typeNames[l.type] +
          "</div>" +
          '<div class="cal-detail-time">' +
          l.time.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          }) +
          (l.notes ? " · " + l.notes : "") +
          "</div></div>" +
          '<span class="log-badge ' +
          effortBadge[l.effort] +
          '">' +
          effortLabels[l.effort] +
          "</span></div>",
      )
      .join("") +
    "</div>";
}

// ── PAGES ──
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

function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
}

// ── AUTH UI ──
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
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add("show");
}
function clearError(id) {
  const el = document.getElementById(id);
  el.textContent = "";
  el.classList.remove("show");
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

function exportCSV() {
  if (!logs.length) {
    showToast("No hay datos para exportar");
    return;
  }

  // Escapar comillas dobles y envolver campos con comas o saltos de línea.
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const header = [
    "fecha",
    "hora",
    "tipo",
    "tipo_descripcion",
    "esfuerzo",
    "esfuerzo_descripcion",
    "notas",
  ];

  // Ordenar cronológicamente ascendente para que el médico lea de arriba abajo.
  const sorted = [...logs].sort((a, b) => a.time - b.time);
  const rows = sorted.map((l) => {
    const d = l.time;
    const fecha = d.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const hora = d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return [
      fecha,
      hora,
      l.type,
      typeNames[l.type] || "",
      l.effort,
      effortLabels[l.effort] || "",
      l.notes || "",
    ]
      .map(esc)
      .join(",");
  });

  // BOM UTF-8 para que Excel abra correctamente acentos y ñ.
  const csv = "﻿" + header.join(",") + "\n" + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pooplog-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  showToast(`${sorted.length} registros descargados`);
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

function closeProfileOutside(e) {
  if (e.target === document.getElementById("profile-modal")) closeProfile();
}
function closeProfile() {
  document.getElementById("profile-modal").classList.remove("open");
}

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

async function doLogout() {
  closeProfile();
  if (!confirm("¿Cerrar sesión?")) return;
  localStorage.removeItem("pooplog_guest_mode");
  await sb.auth.signOut();
  showPage("auth");
}

// ── APP LOGIC ──
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
function checkInactivity() {
  const banner = document.getElementById("inactivity-banner");
  if (!banner) return;
  const dismissed = localStorage.getItem("inactivity_dismissed");
  const today = new Date().toDateString();
  if (dismissed === today) return;
  if (!logs.length) return;
  const lastLog = logs.reduce((a, b) => (a.time > b.time ? a : b));
  const daysSince = Math.floor((new Date() - lastLog.time) / 86400000);
  if (daysSince >= 2) {
    banner.classList.add("show");
  } else {
    banner.classList.remove("show");
  }
}

function dismissInactivityBanner() {
  document.getElementById("inactivity-banner").classList.remove("show");
  localStorage.setItem("inactivity_dismissed", new Date().toDateString());
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

async function logPoop() {
  if (!selectedEffort) {
    showToast("Facil o dificil fue el popo?");
    return;
  }
  const btn = document.getElementById("btn-submit");
  btn.disabled = true;
  btn.textContent = "Guardando...";
  const notes = document.getElementById("notes-input").value.trim();
  const poopTime = isNow ? new Date() : selectedDateTime;

  if (currentUser) {
    const { error } = await sb
      .from("poops")
      .insert({
        type: selectedType,
        effort: selectedEffort,
        notes,
        user_id: currentUser.id,
        created_at: poopTime.toISOString(),
      });
    btn.disabled = false;
    btn.textContent = "Registrar popo";
    if (error) {
      showToast("Error al guardar. Intenta de nuevo.");
      return;
    }
    await loadLogs();
  } else {
    const entry = {
      id: Date.now(),
      type: selectedType,
      effort: selectedEffort,
      notes,
      time: poopTime,
    };
    logs.push(entry);
    logs.sort((a, b) => b.time - a.time);
    const toSave = logs.map((l) => ({ ...l, time: l.time.toISOString() }));
    localStorage.setItem("pooplog_guest", JSON.stringify(toSave));
    btn.disabled = false;
    btn.textContent = "Registrar popo";
    updateUI();
  }

  document.getElementById("notes-input").value = "";
  if (!isNow) {
    isNow = true;
    document.getElementById("now-toggle").classList.add("on");
    document.getElementById("datetime-panel").classList.remove("open");
    document.getElementById("toggle-sub").textContent =
      "Registrando para ahora mismo";
    btn.textContent = "Registrar popo";
  }
  showToast("Popo registrado!");
}

async function logNoPoop() {
  // Evitar duplicados: si ya reportó "sin popo" hoy, no crear otro.
  const today = new Date().toDateString();
  const already = logs.some(
    (l) => String(l.type) === "0" && l.time.toDateString() === today,
  );
  if (already) {
    showToast("Ya reportaste que hoy no pudiste");
    return;
  }

  const poopTime = new Date();
  if (currentUser) {
    const { error } = await sb.from("poops").insert({
      type: "0",
      effort: "none",
      notes: "",
      user_id: currentUser.id,
      created_at: poopTime.toISOString(),
    });
    if (error) {
      showToast("Error al guardar. Intenta de nuevo.");
      return;
    }
    await loadLogs();
  } else {
    const entry = {
      id: Date.now(),
      type: "0",
      effort: "none",
      notes: "",
      time: poopTime,
    };
    logs.push(entry);
    logs.sort((a, b) => b.time - a.time);
    localStorage.setItem(
      "pooplog_guest",
      JSON.stringify(logs.map((l) => ({ ...l, time: l.time.toISOString() }))),
    );
    updateUI();
  }
  showToast("Registrado: hoy no pudiste");
}

async function loadLogs() {
  const { data, error } = await sb
    .from("poops")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return;
  logs = (data || []).map((l) => ({ ...l, time: new Date(l.created_at) }));
  updateUI();
}

function calcStreak() {
  if (!logs.length) return 0;
  const sorted = [...new Set(logs.map((l) => l.time.toDateString()))]
    .map((s) => new Date(s))
    .sort((a, b) => b - a);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (sorted[0] < yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    prev.setHours(0, 0, 0, 0);
    const curr = new Date(sorted[i]);
    curr.setHours(0, 0, 0, 0);
    const diff = Math.round((prev - curr) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function updateUI() {
  const now = new Date();
  const streak = calcStreak();
  const prevStreak =
    parseInt(document.getElementById("stat-streak").textContent) || 0;

  // Stats cuentan solo popos reales (tipo 1-7), no días reportados como "sin popo".
  const realLogs = logs.filter((l) => String(l.type) !== "0");
  document.getElementById("stat-total").textContent = realLogs.length;
  document.getElementById("stat-week").textContent = realLogs.filter(
    (l) => l.time >= new Date(now - 7 * 86400000),
  ).length;
  document.getElementById("stat-streak").textContent = streak;

  const streakCard = document.getElementById("streak-card");
  const streakLbl = document.getElementById("streak-lbl");
  if (streak >= 3) {
    streakCard.classList.add("streak-active");
    const fire = streak >= 7 ? "&#128293;&#128293;" : "&#128293;";
    streakLbl.innerHTML =
      fire + " " + (streak === 1 ? "1 día" : streak + " días");
  } else {
    streakCard.classList.remove("streak-active");
    streakLbl.textContent = streak === 1 ? "Racha: 1 día" : "Racha";
  }

  if (streak > prevStreak && streak >= 3 && streak % 1 === 0) {
    const msgs = {
      3: "&#128293; ¡3 días seguidos! Vas bien.",
      7: "&#128293;&#128293; ¡Una semana completa! Imparable.",
      14: "&#128293;&#128293;&#128293; 2 semanas de racha. Eres un maestro del popo.",
      30: "&#129351; ¡30 días! Tu intestino te lo agradece.",
    };
    if (msgs[streak]) showToast(msgs[streak]);
  }

  updateScore();
  updateWeeklyBar();
  renderList();
  checkInactivity();
}

function toggleScoreExpand() {
  const expand = document.getElementById("score-expand");
  const chevron = document.getElementById("score-chevron");
  const isOpen = expand.classList.contains("open");
  expand.classList.toggle("open", !isOpen);
  chevron.classList.toggle("open", !isOpen);
}

function logsInRange(daysAgo, daysBack) {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - daysAgo);
  from.setHours(0, 0, 0, 0);
  const to = new Date(now);
  to.setDate(to.getDate() - daysBack);
  to.setHours(23, 59, 59, 999);
  return logs.filter((l) => l.time >= from && l.time <= to);
}

function updateScore() {
  if (!logs.length) {
    document.getElementById("score-face-wrap").innerHTML =
      scoreFaces["neutral"];
    document.getElementById("score-text").textContent = "Sin datos aún";
    document.getElementById("score-sub").textContent =
      "Registra tu primer popo";
    document.getElementById("insight-list").innerHTML =
      '<div class="insight-item info"><span class="insight-icon">&#128161;</span><span>Registra algunos popos para ver tus insights.</span></div>';
    document.getElementById("score-compare").style.display = "none";
    return;
  }

  const thisWeek = logsInRange(7, 0);
  const lastWeek = logsInRange(14, 8);
  const recent = thisWeek.length
    ? thisWeek
    : logs.slice(0, Math.min(7, logs.length));

  // Separar popos reales de reportes de "sin popo" para no contaminar las
  // métricas de la escala de Bristol.
  const realRecent = recent.filter((l) => String(l.type) !== "0");
  const noPoopRecent = recent.filter((l) => String(l.type) === "0");

  const total = realRecent.length;
  const types = realRecent.map((l) => parseInt(l.type));
  const efforts = realRecent.map((l) => l.effort);

  const constipated = types.filter((t) => t <= 2).length;
  const healthy = types.filter((t) => t >= 3 && t <= 4).length;
  const loose = types.filter((t) => t >= 5 && t <= 6).length;
  const liquid = types.filter((t) => t === 7).length;
  const hardEffort = efforts.filter(
    (e) => e === "hard" || e === "brutal",
  ).length;
  const easyEffort = efforts.filter(
    (e) => e === "smooth" || e === "bit",
  ).length;
  const activeDays = new Set(realRecent.map((l) => l.time.toDateString())).size;
  const noPoopDays = new Set(noPoopRecent.map((l) => l.time.toDateString())).size;

  const healthyRatio = healthy / total;
  const constipatedRatio = constipated / total;
  const looseRatio = (loose + liquid) / total;
  const effortRatio = easyEffort / total;

  let face, text, sub;
  if (total === 0 && noPoopDays > 0) {
    face = "bad";
    text = "Sin popo esta semana";
    sub = "Agua, fibra y movimiento — y paciencia";
  } else if (total === 0) {
    face = "neutral";
    text = "Sin datos aún";
    sub = "Registra tu primer popo";
  } else if (healthyRatio >= 0.7 && effortRatio >= 0.7) {
    face = "good";
    text = "Excelente";
    sub = "Tu intestino está feliz esta semana";
  } else if (constipatedRatio >= 0.5 || hardEffort >= 2) {
    face = "bad";
    text = "Señales de estreñimiento";
    sub = "Considera más agua y fibra";
  } else if (looseRatio >= 0.5 || liquid >= 2) {
    face = "bad";
    text = "Digestión acelerada";
    sub = "Revisa tu alimentación reciente";
  } else if (healthyRatio >= 0.4) {
    face = "mid";
    text = "Regular";
    sub = "Hay margen para mejorar";
  } else {
    face = "mid";
    text = "Semana mixta";
    sub = "Tus patrones fueron variados";
  }

  document.getElementById("score-face-wrap").innerHTML =
    scoreFaces[face] || scoreFaces["neutral"];
  document.getElementById("score-text").textContent = text;
  document.getElementById("score-sub").textContent = sub;

  const insights = [];

  if (total === 0 && noPoopDays === 0) {
    insights.push({
      type: "info",
      icon: "&#128161;",
      text: "Registra algunos popos para ver tus insights.",
    });
  } else {
    // Insight de días sin popo — prioridad alta si son varios.
    if (noPoopDays >= 3) {
      insights.push({
        type: "bad",
        icon: "&#128683;",
        text: `Llevas ${noPoopDays} días sin popo esta semana. Signo claro de estreñimiento — toma más agua, come fibra (frutas, verduras, avena) y muévete. Si persiste, consulta a un médico.`,
      });
    } else if (noPoopDays >= 2) {
      insights.push({
        type: "warn",
        icon: "&#9888;",
        text: `${noPoopDays} días sin popo esta semana. Si continúa, revisa tu hidratación y alimentación.`,
      });
    } else if (noPoopDays === 1) {
      insights.push({
        type: "info",
        icon: "&#128203;",
        text: "Un día sin popo esta semana. Normal si pasa ocasionalmente.",
      });
    }
    if (activeDays < 3 && total < 4) {
      insights.push({
        type: "warn",
        icon: "&#128203;",
        text: "Pocos registros esta semana. Intenta registrar cada vez para tener datos más precisos.",
      });
    }
    if (constipatedRatio >= 0.5) {
      insights.push({
        type: "bad",
        icon: "&#128683;",
        text: "La mayoría de tus popos fueron tipo 1 o 2. Señal de estreñimiento — prueba tomar más agua, comer frutas y caminar más.",
      });
    } else if (constipated >= 1) {
      insights.push({
        type: "warn",
        icon: "&#9888;",
        text:
          "Tuviste " +
          constipated +
          " episodio" +
          (constipated > 1 ? "s" : "") +
          " de popo duro. Mantén una buena hidratación.",
      });
    }
    if (liquid >= 2) {
      insights.push({
        type: "bad",
        icon: "&#128683;",
        text:
          "Tuviste " +
          liquid +
          " episodio" +
          (liquid > 1 ? "s" : "") +
          " completamente líquido" +
          (liquid > 1 ? "s" : "") +
          ". Si persiste más de 2 días, consulta a un médico.",
      });
    } else if (looseRatio >= 0.5) {
      insights.push({
        type: "warn",
        icon: "&#9888;",
        text: "Tu digestión estuvo acelerada esta semana. Revisa si comiste algo picante, tomaste antibióticos o hubo mucho estrés.",
      });
    }
    if (hardEffort >= 3) {
      insights.push({
        type: "bad",
        icon: "&#128683;",
        text:
          "Hacer del baño te costó mucho esfuerzo " +
          hardEffort +
          " veces. Considera más fibra en tu dieta y no te fuerces.",
      });
    } else if (hardEffort >= 1) {
      insights.push({
        type: "warn",
        icon: "&#9888;",
        text: "Algunos días requirieron bastante esfuerzo. Una buena señal sería que salga fácil — prueba más líquidos.",
      });
    }
    if (healthyRatio >= 0.7 && effortRatio >= 0.7) {
      insights.push({
        type: "good",
        icon: "&#10003;",
        text: "Tus popos fueron mayormente tipo 3 y 4 — la zona ideal según la escala de Bristol. Sigue con tu rutina actual.",
      });
    }
    if (healthy >= 1 && constipated === 0 && liquid === 0) {
      insights.push({
        type: "good",
        icon: "&#10003;",
        text: "Sin episodios extremos esta semana. Tu intestino estuvo estable.",
      });
    }
    if (total >= 5 && activeDays >= 5) {
      insights.push({
        type: "good",
        icon: "&#128200;",
        text:
          "Registraste " +
          total +
          " popos en " +
          activeDays +
          " días. Excelente constancia — los datos son más útiles cuando son completos.",
      });
    }
    if (insights.length === 0) {
      insights.push({
        type: "info",
        icon: "&#128161;",
        text: "Semana variada sin patrones claros. Sigue registrando para detectar tendencias.",
      });
    }
  }

  document.getElementById("insight-list").innerHTML = insights
    .map(
      (i) =>
        '<div class="insight-item ' +
        i.type +
        '"><span class="insight-icon">' +
        i.icon +
        "</span><span>" +
        i.text +
        "</span></div>",
    )
    .join("");

  const compareEl = document.getElementById("score-compare");
  if (thisWeek.length > 0 && lastWeek.length > 0) {
    const thisHealthy =
      thisWeek.filter((l) => parseInt(l.type) >= 3 && parseInt(l.type) <= 4)
        .length / thisWeek.length;
    const lastHealthy =
      lastWeek.filter((l) => parseInt(l.type) >= 3 && parseInt(l.type) <= 4)
        .length / lastWeek.length;
    const diff = Math.round((thisHealthy - lastHealthy) * 100);
    let arrow, cls, msg;
    if (diff > 10) {
      arrow = "&#8593;";
      cls = "up";
      msg = "Mejor que la semana pasada (+" + diff + "% popos saludables)";
    } else if (diff < -10) {
      arrow = "&#8595;";
      cls = "down";
      msg = "Peor que la semana pasada (" + diff + "% popos saludables)";
    } else {
      arrow = "&#8594;";
      cls = "same";
      msg = "Similar a la semana pasada";
    }
    compareEl.style.display = "flex";
    compareEl.innerHTML =
      '<span class="compare-arrow ' +
      cls +
      '">' +
      arrow +
      "</span><span>" +
      msg +
      "</span>";
  } else {
    compareEl.style.display = "none";
  }
}

// ── RECORDATORIO DIARIO ──
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

function loggedToday() {
  const today = new Date().toDateString();
  return logs.some((l) => l.time.toDateString() === today);
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
  // Cancelar cualquier timer previo
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
  // Si ya pasó la hora de hoy y el usuario no registró, avisar inmediatamente.
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

function updateWeeklyBar() {
  const now = new Date();
  let max = 1;
  const counts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const c = logs.filter(
      (l) =>
        String(l.type) !== "0" && l.time.toDateString() === d.toDateString(),
    ).length;
    counts.push({ day: days[d.getDay()], count: c });
    if (c > max) max = c;
  }
  document.getElementById("weekly-bar").innerHTML = counts
    .map((c) => {
      const h = Math.max(4, Math.round((c.count / max) * 52));
      return `<div class="bar-col"><div class="bar-fill" style="height:${h}px;opacity:${c.count ? 1 : 0.25}"></div><div class="bar-day">${c.day}</div></div>`;
    })
    .join("");
}

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

function renderList() {
  const list = document.getElementById("log-list");
  const emptyHtml = list.querySelector(".edit-modal-backdrop")
    ? list.querySelector(".edit-modal-backdrop").outerHTML
    : "";
  if (!logs.length) {
    list.innerHTML =
      emptyHtml +
      `<div class="empty-state"><svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="#D3D1C7"/><circle cx="32" cy="32" r="23" fill="#B4B2A9"/><ellipse cx="24" cy="27" rx="3.5" ry="4" fill="#888780"/><ellipse cx="40" cy="27" rx="3.5" ry="4" fill="#888780"/><circle cx="24" cy="26" r="1.5" fill="#444441"/><circle cx="40" cy="26" r="1.5" fill="#444441"/><path d="M24 42 Q32 46 40 42" stroke="#888780" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M20 18 Q24 13 27 18" stroke="#888780" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M37 18 Q40 13 44 18" stroke="#888780" stroke-width="2" fill="none" stroke-linecap="round"/></svg><div class="empty-title">Esperando al primer popo</div><div>Registralo arriba cuando llegue el momento</div></div>`;
    return;
  }
  const items = logs
    .slice(0, 20)
    .map((l) => {
      const lid = l.id || l.created_at || l.time.toISOString();
      const ts =
        l.time.toLocaleDateString("es-CO", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }) +
        " · " +
        l.time.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        });
      const isNoPoop = String(l.type) === "0";
      return `<div class="log-item">
      <div class="log-icon">${svgs[l.type]}</div>
      <div class="log-info"><div class="log-time">${ts}</div><div class="log-type">${typeNames[l.type]}${l.notes ? " · " + l.notes : ""}</div></div>
      <span class="log-badge ${effortBadge[l.effort]}">${effortLabels[l.effort]}</span>
      <button class="log-menu-btn" onclick="toggleMenu('${lid}', event)">&#8943;</button>
      <div class="log-menu-popup" id="menu-${lid}">
        ${isNoPoop ? "" : `<div class="log-menu-item" onclick="openEdit('${lid}')">&#9998; Editar</div>`}
        <div class="log-menu-item danger" onclick="deleteLog('${lid}')">&#128465; Eliminar</div>
      </div>
    </div>`;
    })
    .join("");
  list.innerHTML = emptyHtml + items;
}

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

async function saveEdit() {
  if (!editEffort) {
    showToast("Selecciona el esfuerzo");
    return;
  }
  const dateVal = document.getElementById("edit-date").value;
  const timeVal = document.getElementById("edit-time").value;
  const notes = document.getElementById("edit-notes").value.trim();
  const newTime = new Date(dateVal + "T" + timeVal);
  const btn = document.querySelector(".btn-save");
  btn.disabled = true;
  btn.textContent = "Guardando...";

  if (currentUser) {
    const log = logs.find(
      (l) => (l.id || l.created_at || l.time.toISOString()) == editingId,
    );
    const { error } = await sb
      .from("poops")
      .update({
        type: editType,
        effort: editEffort,
        notes,
        created_at: newTime.toISOString(),
      })
      .eq("id", log.id);
    btn.disabled = false;
    btn.textContent = "Guardar cambios";
    if (error) {
      showToast("Error al guardar");
      return;
    }
    await loadLogs();
  } else {
    const idx = logs.findIndex(
      (l) => (l.id || l.time.toISOString()) == editingId,
    );
    if (idx !== -1) {
      logs[idx] = {
        ...logs[idx],
        type: editType,
        effort: editEffort,
        notes,
        time: newTime,
      };
      logs.sort((a, b) => b.time - a.time);
      localStorage.setItem(
        "pooplog_guest",
        JSON.stringify(logs.map((l) => ({ ...l, time: l.time.toISOString() }))),
      );
      updateUI();
    }
    btn.disabled = false;
    btn.textContent = "Guardar cambios";
  }
  closeEdit();
  showToast("Registro actualizado");
}

async function deleteLog(id) {
  closeAllMenus();
  if (!confirm("Eliminar este registro?")) return;
  if (currentUser) {
    const log = logs.find(
      (l) => (l.id || l.created_at || l.time.toISOString()) == id,
    );
    const { error } = await sb.from("poops").delete().eq("id", log.id);
    if (error) {
      showToast("Error al eliminar");
      return;
    }
    await loadLogs();
  } else {
    logs = logs.filter((l) => (l.id || l.time.toISOString()) != id);
    localStorage.setItem(
      "pooplog_guest",
      JSON.stringify(logs.map((l) => ({ ...l, time: l.time.toISOString() }))),
    );
    updateUI();
  }
  showToast("Registro eliminado");
}

// ── INIT ──
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
    loadLogs().catch(() => {});
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

// ── PWA: registrar service worker + recordatorio ──
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
