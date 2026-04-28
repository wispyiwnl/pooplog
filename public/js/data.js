// ── Operaciones de datos ──
// Todo lo que persiste/lee registros: Supabase para usuarios autenticados,
// localStorage para modo invitado. También migración y exportación.

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
    const { error } = await sb.from("poops").insert({
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
  closeRegister();
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
  closeRegister();
  showToast("Registrado: hoy no pudiste");
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

// Si el usuario tenía datos en modo invitado y ahora creó/entró a una cuenta,
// subimos esos registros a Supabase con su nuevo user_id para que no los pierda.
// Se ejecuta solo una vez por migración — si falla, se conserva el localStorage
// para reintentar en la próxima sesión.
async function migrateGuestDataIfAny(user) {
  const raw = localStorage.getItem("pooplog_guest");
  if (!raw) return;
  let guestLogs;
  try {
    guestLogs = JSON.parse(raw);
  } catch {
    localStorage.removeItem("pooplog_guest");
    return;
  }
  if (!Array.isArray(guestLogs) || !guestLogs.length) {
    localStorage.removeItem("pooplog_guest");
    return;
  }

  const rows = guestLogs.map((l) => ({
    type: String(l.type),
    effort: l.effort || "none",
    notes: l.notes || "",
    user_id: user.id,
    created_at: new Date(l.time).toISOString(),
  }));

  const { error } = await sb.from("poops").insert(rows);
  if (error) {
    showToast("No pudimos migrar tus datos de invitado. Lo intentaremos luego.");
    return;
  }
  localStorage.removeItem("pooplog_guest");
  showToast(`Migramos ${rows.length} registros a tu cuenta`);
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
