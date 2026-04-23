// Inicialización del cliente de Supabase — keys vienen de config.js (fuera del repo).
const { SUPABASE_URL, SUPABASE_KEY } = window.POOPLOG_CONFIG;
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Datos estáticos de la app ──

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

// ── Estado global mutable ──
// Estos `let` se comparten entre archivos (mismo scope global al no usar ES modules).

let selectedType = "4";
let selectedEffort = null;
let logs = [];
let currentUser = null;
let filters = { type: "", from: "", to: "", search: "" };
let isNow = true;
let selectedDateTime = new Date();
let calViewYear = new Date().getFullYear();
let calViewMonth = new Date().getMonth();

// ── Utilidades compartidas ──

function pad2(n) {
  return String(n).padStart(2, "0");
}

// Escapa HTML para usar texto del usuario (notas, etc.) dentro de plantillas
// que se inyectan con innerHTML. Evita XSS si alguien escribe "<script>" en notas.
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
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

function loggedToday() {
  const today = new Date().toDateString();
  return logs.some((l) => l.time.toDateString() === today);
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
