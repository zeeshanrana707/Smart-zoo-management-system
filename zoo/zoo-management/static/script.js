// ── Helpers ──────────────────────────────────────────────────

function showTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById("tab-" + name).classList.remove("hidden");
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  loadTab(name);
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

async function api(url, method = "GET", body = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  return res.json();
}

function buildTable(tableId, rows) {
  const tbl = document.getElementById(tableId);
  if (!rows.length) { tbl.innerHTML = "<tr><td>No records found.</td></tr>"; return; }
  const cols = Object.keys(rows[0]);
  let html = "<thead><tr>" + cols.map(c => `<th>${c}</th>`).join("") + "</tr></thead><tbody>";
  rows.forEach(r => {
    html += "<tr>" + cols.map(c => `<td>${r[c] ?? ""}</td>`).join("") + "</tr>";
  });
  html += "</tbody>";
  tbl.innerHTML = html;
}

function buildTableWithDelete(tableId, rows, idKey, deleteUrl) {
  const tbl = document.getElementById(tableId);
  if (!rows.length) { tbl.innerHTML = "<tr><td>No records found.</td></tr>"; return; }
  const cols = Object.keys(rows[0]);
  let html = "<thead><tr>" + cols.map(c => `<th>${c}</th>`).join("") + "<th></th></tr></thead><tbody>";
  rows.forEach(r => {
    html += "<tr>" + cols.map(c => `<td>${r[c] ?? ""}</td>`).join("");
    html += `<td><button class="btn-del" onclick="deleteRow('${deleteUrl}/${r[idKey]}', '${tableId}')">Delete</button></td></tr>`;
  });
  html += "</tbody>";
  tbl.innerHTML = html;
}

async function deleteRow(url, tableId) {
  if (!confirm("Delete this record?")) return;
  await api(url, "DELETE");
  toast("Record deleted");
  loadTab(currentTab());
}

function currentTab() {
  const visible = document.querySelector(".tab:not(.hidden)");
  return visible ? visible.id.replace("tab-", "") : "animals";
}

async function fillSelect(selectId, url, valueKey, labelKey) {
  const data = await api(url);
  const sel = document.getElementById(selectId);
  sel.innerHTML = data.map(d => `<option value="${d[valueKey]}">${d[labelKey]}</option>`).join("");
}

// ── Load Tab Data ─────────────────────────────────────────────

async function loadTab(name) {
  switch (name) {
    case "animals":  await loadAnimals();  break;
    case "species":  await loadSpecies();  break;
    case "staff":    await loadStaff();    break;
    case "feeding":  await loadFeeding();  break;
    case "medical":  await loadMedical();  break;
    case "alerts":   await loadAlerts();   break;
    case "reports":  await loadReports();  break;
  }
}

// ── Animals ───────────────────────────────────────────────────

async function loadAnimals() {
  const rows = await api("/api/animals");
  buildTableWithDelete("tbl-animals", rows, "Animal_ID", "/api/animals");
  await fillSelect("a-species",   "/api/species",   "Species_ID",   "Species_Name");
  await fillSelect("a-enclosure", "/api/enclosures","Enclosure_ID", "Type");
}

document.getElementById("form-animal").addEventListener("submit", async e => {
  e.preventDefault();
  await api("/api/animals", "POST", {
    name:        document.getElementById("a-name").value,
    age:         document.getElementById("a-age").value,
    species_id:  document.getElementById("a-species").value,
    enclosure_id:document.getElementById("a-enclosure").value
  });
  toast("Animal added ✓");
  e.target.reset();
  loadAnimals();
});

// ── Species ───────────────────────────────────────────────────

async function loadSpecies() {
  const rows = await api("/api/species");
  buildTable("tbl-species", rows);
}

document.getElementById("form-species").addEventListener("submit", async e => {
  e.preventDefault();
  await api("/api/species", "POST", {
    species_name: document.getElementById("s-name").value,
    diet_type:    document.getElementById("s-diet").value
  });
  toast("Species added ✓");
  e.target.reset();
  loadSpecies();
});

// ── Staff ─────────────────────────────────────────────────────

async function loadStaff() {
  const rows = await api("/api/staff");
  buildTable("tbl-staff", rows);
  const enc = await api("/api/staff-enclosures");
  buildTable("tbl-staff-enc", enc);
}

document.getElementById("form-staff").addEventListener("submit", async e => {
  e.preventDefault();
  await api("/api/staff", "POST", {
    name:   document.getElementById("st-name").value,
    role:   document.getElementById("st-role").value,
    salary: document.getElementById("st-salary").value
  });
  toast("Staff added ✓");
  e.target.reset();
  loadStaff();
});

// ── Feeding ───────────────────────────────────────────────────

async function loadFeeding() {
  await fillSelect("f-animal", "/api/animals", "Animal_ID", "Name");
  const rows = await api("/api/feeding");
  buildTable("tbl-feeding", rows);
}

document.getElementById("form-feeding").addEventListener("submit", async e => {
  e.preventDefault();
  await api("/api/feeding", "POST", {
    animal_id: document.getElementById("f-animal").value,
    food_type: document.getElementById("f-food").value,
    time:      document.getElementById("f-time").value
  });
  toast("Feeding record added ✓");
  e.target.reset();
  loadFeeding();
});

// ── Medical ───────────────────────────────────────────────────

async function loadMedical() {
  await fillSelect("m-animal", "/api/animals", "Animal_ID", "Name");
  const rows = await api("/api/medical");
  buildTable("tbl-medical", rows);
}

document.getElementById("form-medical").addEventListener("submit", async e => {
  e.preventDefault();
  await api("/api/medical", "POST", {
    animal_id: document.getElementById("m-animal").value,
    diagnosis: document.getElementById("m-diag").value,
    treatment: document.getElementById("m-treat").value
  });
  toast("Medical record added ✓");
  e.target.reset();
  loadMedical();
});

// ── Alerts ────────────────────────────────────────────────────

async function loadAlerts() {
  await fillSelect("al-animal", "/api/animals", "Animal_ID", "Name");
  const rows = await api("/api/alerts");
  buildTable("tbl-alerts", rows);
}

document.getElementById("form-alert").addEventListener("submit", async e => {
  e.preventDefault();
  await api("/api/alerts", "POST", {
    animal_id:  document.getElementById("al-animal").value,
    alert_type: document.getElementById("al-type").value,
    alert_date: document.getElementById("al-date").value
  });
  toast("Alert added ✓");
  e.target.reset();
  loadAlerts();
});

// ── Reports ───────────────────────────────────────────────────

async function loadReports() {
  const bySpecies = await api("/api/animals-per-species");
  buildTable("tbl-report-species", bySpecies);

  const byAge = await api("/api/animals");
  buildTable("tbl-report-age", byAge);
}

// ── Init ──────────────────────────────────────────────────────
loadAnimals();
document.querySelector("nav button").classList.add("active");
