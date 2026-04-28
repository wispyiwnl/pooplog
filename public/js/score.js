// ── Score digestivo, stats, insights, historial visible ──
// Todas las métricas que se muestran en la pantalla principal: total, semana,
// racha, barra semanal, cara del score, historial renderizado.

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
  if (streak >= 7) {
    streakCard.classList.add("streak-active");
    streakLbl.innerHTML = "&#128293;&#128293; días seguidos";
  } else if (streak >= 3) {
    streakCard.classList.add("streak-active");
    streakLbl.innerHTML = "&#128293; días seguidos";
  } else {
    streakCard.classList.remove("streak-active");
    streakLbl.textContent = streak === 1 ? "día" : streak === 0 ? "racha" : "días";
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
  const filtered = applyFilters(logs);
  if (!filtered.length) {
    list.innerHTML =
      emptyHtml +
      `<div class="empty-state"><div class="empty-title">Sin resultados</div><div>Prueba ajustando los filtros</div></div>`;
    return;
  }
  const items = filtered
    .slice(0, 50)
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
      <div class="log-info"><div class="log-time">${ts}</div><div class="log-type">${typeNames[l.type]}${l.notes ? " · " + escapeHtml(l.notes) : ""}</div></div>
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

// ── Banner de inactividad ──

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
