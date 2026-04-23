// ── Calendario mensual ──
// Vista modal que muestra un mes completo con los popos de cada día.

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
          (l.notes ? " · " + escapeHtml(l.notes) : "") +
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
