const state = {
  tasks: {},
  progress: {}
};
const dataVersion = "20251243"; // Incremented to force update
const storeKey = "orquestador_progress_v1";

const elTabs = document.getElementById("businessTabs");
const elContent = document.getElementById("content");
const elTotalPoints = document.getElementById("totalPoints");
const elTotalCompleted = document.getElementById("totalCompleted");
const elTotalTasks = document.getElementById("totalTasks");

// Detail View Elements
const elDetailView = document.getElementById("detailView");
const elDetailTitle = document.getElementById("detailTitle");
const elDetailBody = document.getElementById("detailBody");
const elDetailBadge = document.getElementById("detailBadge");
const elDetailTime = document.getElementById("detailTime");
const elDetailDiff = document.getElementById("detailDiff");
const btnCloseDetail = document.getElementById("closeDetail");

document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("¿Estás seguro de reiniciar todo el progreso?")) {
      localStorage.removeItem(storeKey);
      location.reload();
  }
});

btnCloseDetail.addEventListener("click", hideDetail);

function loadProgress() {
  try {
      const raw = localStorage.getItem(storeKey);
      return raw ? JSON.parse(raw) : {};
  } catch (e) {
      return {};
  }
}

function saveProgress() {
  localStorage.setItem(storeKey, JSON.stringify(state.progress));
  saveProgressToDB(state.progress);
}

function computeStats(all) {
  let total = 0, completed = 0, points = 0;
  for (const b of all) {
      for (const t of b.tasks) {
          const subt = t.subtasks || [];
          if (subt.length === 0) {
              total++;
              if (state.progress[t.id] === true) {
                  completed++;
                  points += t.points || 0;
              }
          } else {
              for (const s of subt) {
                  const steps = s.steps || [];
                  if (steps.length > 0) {
                      total += steps.length;
                      let c = 0;
                      for (const st of steps) {
                          if (state.progress[st.id] === true) {
                              c++;
                          }
                      }
                      completed += c;
                      const allDone = steps.every(st => state.progress[st.id] === true);
                      if (allDone) {
                          points += s.points || 0;
                      }
                  } else {
                      total++;
                      if (state.progress[s.id] === true) {
                          completed++;
                          points += s.points || 0;
                      }
                  }
              }
          }
      }
  }
  return { total, completed, points };
}

function renderTabs(all) {
  elTabs.innerHTML = "";
  all.forEach((b, i) => {
      const tab = document.createElement("div");
      tab.className = "tab" + (i === 0 ? " active" : "");
      tab.textContent = b.name;
      tab.dataset.key = b.key;
      tab.addEventListener("click", () => {
          document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
          tab.classList.add("active");
          renderBusiness(b);
      });
      elTabs.appendChild(tab);
  });
  renderBusiness(all[0]);
}

function renderBusiness(b) {
  elContent.innerHTML = "";
  const card = document.createElement("div");
  card.className = "card";

  // Calculate stats for this business
  let total = 0, done = 0, points = 0;
  // ... (reusing existing logic simplified)
  for (const t of b.tasks) {
      // Logic simplified for stats: just counting tasks/subtasks/steps
      const subt = t.subtasks || [];
      if (subt.length === 0) {
          total++;
          if (state.progress[t.id] === true) { done++; points += t.points || 0; }
      } else {
          for (const s of subt) {
              const steps = s.steps || [];
              if (steps.length > 0) {
                  total += steps.length;
                  let c = 0;
                  for (const st of steps) { if (state.progress[st.id] === true) c++; }
                  done += c;
                  if (steps.every(st => state.progress[st.id] === true)) points += s.points || 0;
              } else {
                  total++;
                  if (state.progress[s.id] === true) { done++; points += s.points || 0; }
              }
          }
      }
  }

  const pct = Math.round((done / (total || 1)) * 100);

  card.innerHTML = `
      <h2>${b.name}</h2>
      <div class="progress"><div class="bar" style="width:${pct}%"></div></div>
      <div class="stats"><span>${done}/${total} pasos</span><span>${pct}%</span></div>
      <div class="list"></div>
      <div class="controls"><span class="pill">Puntos: ${points}</span></div>
  `;

  const list = card.querySelector(".list");

  b.tasks.forEach(t => {
      const hasSub = (t.subtasks && t.subtasks.length > 0);
      
      // Check status
      let isDone = false;
      if (!hasSub) {
          isDone = state.progress[t.id] === true;
      } else {
          isDone = t.subtasks.every(s => {
              const steps = s.steps || [];
              return steps.length > 0 ? steps.every(st => state.progress[st.id] === true) : state.progress[s.id] === true;
          });
      }

      const row = document.createElement("div");
      row.className = "task" + (isDone ? " done" : "");
      const checked = isDone ? "checked" : "";
      const chev = hasSub ? `<span class="chevron" data-task="${t.id}"></span>` : "";

      row.innerHTML = `
          <div class="task-left">
              ${chev}
              <input type="checkbox" ${checked} data-id="${t.id}" data-hassub="${hasSub}">
              <div>
                  <div class="task-title" data-obj-id="${t.id}" data-type="task">${t.title}</div>
                  <div class="stats">${hasSub ? `${t.subtasks.length} subtareas` : `+${t.points || 0} pts`}</div>
              </div>
          </div>
          <div>${t.badge ? `<span class="badge">${t.badge}</span>` : ""}</div>
      `;
      list.appendChild(row);

      // Add click listener for detail
      row.querySelector(".task-title").addEventListener("click", () => showDetail(t));

      if (hasSub) {
          const wrap = document.createElement("div");
          wrap.className = "subtasks";
          // Default hidden? No, let's keep visible or logic for chevron
          // For now, let's make it visible by default but chevron works
          
          t.subtasks.forEach(s => {
              const sHasSteps = (s.steps && s.steps.length > 0);
              const steps = s.steps || [];
              
              let sDone = false;
              if (sHasSteps) {
                  sDone = steps.every(st => state.progress[st.id] === true);
              } else {
                  sDone = state.progress[s.id] === true;
              }

              const sChecked = sDone ? "checked" : "";
              const completedSteps = sHasSteps ? steps.filter(st => state.progress[st.id] === true).length : 0;
              const chevSub = sHasSteps ? `<span class="chevron-sub" data-sub="${s.id}"></span>` : "";

              const sb = document.createElement("div");
              sb.className = "subtask" + (sDone ? " done" : "");
              sb.innerHTML = `
                  <div class="task-left">
                      ${chevSub}
                      <input type="checkbox" ${sChecked} data-id="${s.id}" data-hassteps="${sHasSteps}">
                      <div>
                          <div class="task-title" data-obj-id="${s.id}" data-type="subtask">${s.title}</div>
                          <div class="stats">${sHasSteps ? `${completedSteps}/${steps.length} pasos` : `+${s.points || 0} pts`}</div>
                      </div>
                  </div>
              `;
              wrap.appendChild(sb);
              sb.querySelector(".task-title").addEventListener("click", () => showDetail(s));

              if (sHasSteps) {
                  const sw = document.createElement("div");
                  sw.className = "steps";
                  steps.forEach(st => {
                      const stDone = state.progress[st.id] === true;
                      const stChecked = stDone ? "checked" : "";
                      const sd = document.createElement("div");
                      sd.className = "step" + (stDone ? " done" : "");
                      sd.innerHTML = `
                          <div class="task-left">
                              <input type="checkbox" ${stChecked} data-id="${st.id}" data-parent="${s.id}">
                              <div>
                                  <div class="task-title" data-obj-id="${st.id}" data-type="step">${st.title}</div>
                              </div>
                          </div>
                      `;
                      sw.appendChild(sd);
                      sd.querySelector(".task-title").addEventListener("click", () => showDetail(st));
                  });
                  wrap.appendChild(sw);
              }
          });
          list.appendChild(wrap);
      }
  });

  // Event Listeners for Checkboxes
  list.querySelectorAll("input[type=checkbox]").forEach(chk => {
      chk.addEventListener("change", e => {
          const id = e.target.dataset.id;
          const hasSub = e.target.dataset.hassub === "true";
          const hasSteps = e.target.dataset.hassteps === "true";
          const parent = e.target.dataset.parent;
          const checked = e.target.checked;

          if (hasSub) {
              const task = b.tasks.find(x => x.id === id);
              // Check all subtasks and steps
              if (task.subtasks) {
                  for (const s of task.subtasks) {
                      state.progress[s.id] = checked;
                      if (s.steps) {
                          for (const st of s.steps) state.progress[st.id] = checked;
                      }
                  }
              }
              state.progress[id] = checked;
          } else if (hasSteps) {
               // Find subtask
               const sub = b.tasks.flatMap(x => x.subtasks || []).find(x => x.id === id);
               if (sub && sub.steps) {
                   for (const st of sub.steps) state.progress[st.id] = checked;
               }
               state.progress[id] = checked;
          } else if (parent) {
              state.progress[id] = checked;
              // Check parent status
              // Finding parent object is tricky without direct ref, but we know ID
              // Let's brute force re-render logic or simple check
              // Actually, we should update parent if all steps are done.
              // For now, simple re-render handles visual update, but we need to update state correctly?
              // The logic in previous app.js was a bit loose, let's keep it simple: 
              // We just save the state of THIS checkbox.
              // Derived states (parent checked if all children checked) are calculated on render.
              // BUT, the previous logic did update parent state in storage. Let's stick to that if possible.
          } else {
              state.progress[id] = checked;
          }

          saveProgress();
          renderBusiness(b);
          updateGlobalStats();
      });
  });

  // Chevron listeners
  list.querySelectorAll(".chevron").forEach(ch => {
      ch.addEventListener("click", e => {
          const el = e.target;
          el.classList.toggle("open");
          const next = el.parentElement.parentElement.nextElementSibling; // div.subtasks
          if (next && next.classList.contains("subtasks")) {
              next.style.display = (next.style.display === "none" ? "block" : "none");
          }
      });
  });
  
  list.querySelectorAll(".chevron-sub").forEach(ch => {
      ch.addEventListener("click", e => {
          const el = e.target;
          el.classList.toggle("open");
          const next = el.parentElement.parentElement.nextElementSibling; // div.steps
          if (next && next.classList.contains("steps")) {
              next.style.display = (next.style.display === "none" ? "block" : "none");
          }
      });
  });

  elContent.appendChild(card);
}

function updateGlobalStats() {
  const s = computeStats(state.tasks.businesses);
  elTotalPoints.textContent = s.points;
  elTotalCompleted.textContent = s.completed;
  elTotalTasks.textContent = s.total;
}

// --- Markdown Parser Simple ---
function parseMarkdown(text) {
  if (!text) return "";
  // Normalize common mojibake
  text = normalizeText(text);
  let html = text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  return html;
}

function normalizeText(s) {
  if (!s) return s;
  return s
    .replace(/ðŸ’¡/g, "💡")
    .replace(/TÃ³mate/g, "Tómate")
    .replace(/documentaciÃ³n/g, "documentación")
    .replace(/GuÃ­a/g, "Guía")
    .replace(/Ã¡/g, "á").replace(/Ã©/g, "é").replace(/Ã­/g, "í").replace(/Ã³/g, "ó").replace(/Ãº/g, "ú").replace(/Ã±/g, "ñ");
}

// --- Prompt/Tips Helpers ---
function getBusinessKeyForItemId(id) {
  for (const b of state.tasks.businesses) {
    for (const t of b.tasks) {
      if (t.id === id) return b.key;
      const subs = t.subtasks || [];
      for (const s of subs) {
        if (s.id === id) return b.key;
        const steps = s.steps || [];
        for (const st of steps) {
          if (st.id === id) return b.key;
        }
      }
    }
  }
  return null;
}

function generatePrompt(title, businessKey) {
  if (!title) return "Describe claramente el objetivo y genera el resultado esperado.";
  const clean = title.replace(/^\s*\d+\s*/, "").trim();
  const t = clean.toLowerCase();
  switch (businessKey) {
    case "influencer_agency":
      if (t.match(/nicho/)) return "Genera 3 nichos para el arquetipo definido. Explica público objetivo y monetización.";
      if (t.match(/arquetipo|persona/)) return "Redacta una ficha de personaje con rasgos físicos, estilo, tono y valores.";
      if (t.match(/caption|copy/)) return "Escribe 10 captions cortos en tono atractivo, con CTA y hashtags relevantes.";
      if (t.match(/calendario|contenido/)) return "Genera un calendario de contenidos semanal con ideas y formatos.";
      return "Propón contenido y hooks alineados al arquetipo seleccionado.";
    case "amazon_affiliates":
      if (t.match(/nicho|producto/)) return "Lista 10 productos con BSR < 50k y margen alto. Incluye razones y links.";
      if (t.match(/bsr|ranking/)) return "Analiza BSR y estacionalidad de los 10 mejores productos del nicho.";
      if (t.match(/articul|post|reseña/)) return "Genera un esquema SEO para una reseña comparativa con sección de pros/cons.";
      if (t.match(/keywords|palabras/)) return "Obtén 30 keywords long-tail con intención de compra y volumen estimado.";
      return "Sugiere contenido afiliado con enfoque en conversión y SEO.";
    case "kdp_publishing":
      if (t.match(/keywords|palabras/)) return "Crea 40 keywords KDP (inglés/español) para baja competencia y alto volumen.";
      if (t.match(/título|subtítulo/)) return "Propón 10 títulos y subtítulos con beneficios claros y keywords.";
      if (t.match(/portada|cover/)) return "Genera prompt para portada en estilo minimalista, tipografía legible y colores.";
      if (t.match(/índice|outline/)) return "Esquematiza capítulos con objetivos y bullets por cada sección.";
      return "Sugiere posicionamiento y categoría óptima para el libro.";
    case "seoprogrammatic":
      if (t.match(/plantilla|template/)) return "Define plantilla de artículo con placeholders: {ciudad}, {servicio}, {precio}.";
      if (t.match(/entidad|schema|estructura/)) return "Extrae entidades clave y crea JSON-LD para Schema.org apropiado.";
      if (t.match(/keyword/)) return "Genera 100 keywords locales combinando {servicio}+{ciudad}+intención de compra.";
      return "Diseña prompts para generar páginas a escala con calidad mínima viable.";
    case "ia_music":
      if (t.match(/género|estilo/)) return "Elige 3 géneros y describe su estética sonora y referencias.";
      if (t.match(/letra/)) return "Escribe letra en español con métrica clara, rima asonante y estribillo.";
      if (t.match(/arreglo|mezcla/)) return "Define estructura (Intro, Verso, Pre, Estribillo, Puente) y capas de instrumentos.";
      return "Genera conceptos musicales y visuales coherentes con el proyecto.";
    default:
      if (t.match(/listar|elegir|definir|crear|escribir|generar|configurar|analizar/)) return clean + "...";
      return "Genera un resultado para: " + clean;
  }
}

function getTips(businessKey) {
  switch (businessKey) {
    case "influencer_agency":
      return "### 💡 Tips\n* Mantén consistencia del personaje en todas las piezas.\n* Usa hooks fuertes y CTA claros.";
    case "amazon_affiliates":
      return "### 💡 Tips\n* Prioriza intención de compra y BSR estable.\n* Estructura reseñas con pros/cons y comparativas.";
    case "kdp_publishing":
      return "### 💡 Tips\n* Título claro, portada legible y categoría precisa.\n* Mantén ritmo y valor por capítulo.";
    case "seoprogrammatic":
      return "### 💡 Tips\n* Plantillas limpias y variables bien nombradas.\n* Evita contenido duplicado; cuida interlinking.";
    case "ia_music":
      return "### 💡 Tips\n* Referencias claras antes de producir.\n* Deja espacio para la voz; evita saturar mezcla.";
    default:
      return "### 💡 Tips\n* Tómate tu tiempo para revisar los detalles.\n* Si tienes dudas, consulta la documentación oficial o usa IA para generar ideas.";
  }
}

// --- Detail View Logic ---
function showDetail(item) {
  elDetailTitle.textContent = item.title;
  
  // Meta
  if (item.badge) {
      elDetailBadge.textContent = item.badge;
      elDetailBadge.classList.remove("hidden");
  } else {
      elDetailBadge.classList.add("hidden");
  }

  if (item.time) {
      elDetailTime.textContent = "⏱️ " + item.time;
      elDetailTime.classList.remove("hidden");
  } else {
      elDetailTime.classList.add("hidden");
  }

  if (item.difficulty) {
      elDetailDiff.textContent = "⭐ " + item.difficulty;
      elDetailDiff.classList.remove("hidden");
  } else {
      elDetailDiff.classList.add("hidden");
  }

  // Content
  let content = "";
  
  if (item.description) {
      content += `<div class="section">${parseMarkdown(item.description)}</div>`;
  }

  const bizKey = getBusinessKeyForItemId(item.id);
  let promptText = item.prompt;
  const isGeneric = (p) => {
    if (!p) return true;
    const trimmed = p.trim();
    return trimmed.length < 25 || /(\.\.\.|^Genera|^Listar|^Crear)/i.test(trimmed);
  };
  if (isGeneric(promptText)) {
    promptText = generatePrompt(item.title, bizKey);
  }
  if (promptText) {
      content += `<h3>📋 Prompt</h3><pre><code>${promptText}</code></pre>`;
  }

  if (item.guide) {
      let guideText = normalizeText(item.guide);
      const hasTips = /💡 Tips/.test(guideText) || /Tips/.test(guideText);
      if (!hasTips) {
          guideText += "\n\n" + getTips(bizKey);
      }
      content += `<h3>📘 Guía</h3><div>${parseMarkdown(guideText)}</div>`;
  } else {
      const tips = getTips(bizKey);
      content += `<h3>📘 Guía</h3><div>${parseMarkdown(tips)}</div>`;
  }

  // Fallback if empty
  if (!content) {
      content = "<p><em>No hay detalles adicionales para esta tarea.</em></p>";
  }

  elDetailBody.innerHTML = content;
  elDetailView.classList.remove("hidden");
}

function hideDetail() {
  elDetailView.classList.add("hidden");
}

// --- API Helpers ---
function getUserId() {
    let uid = localStorage.getItem("app_user_id");
    if (!uid) {
        uid = "user_" + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("app_user_id", uid);
    }
    return uid;
}

async function loadProgressFromDB() {
    try {
        const userId = getUserId();
        const res = await fetch(`/api/progress?userId=${userId}`);
        if (res.ok) {
            const data = await res.json();
            return data; // Can be null if new user
        }
    } catch (e) {
        console.error("Error loading from DB:", e);
    }
    return null;
}

async function saveProgressToDB(state) {
    try {
        const userId = getUserId();
        await fetch(`/api/progress?userId=${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(state)
        });
    } catch (e) {
        console.error("Error saving to DB:", e);
    }
}

// --- Init ---
async function getTasks() {
  try {
      // Add timestamp to force cache bypass
      const ts = new Date().getTime();
      const r = await fetch(`./data/tasks.json?v=${dataVersion}&t=${ts}`, { cache: "no-store" });
      if (r.ok) return await r.json();
  } catch (e) {
      console.error("Error fetching tasks:", e);
  }
  
  // Try fallback without params if first attempt fails
  try {
      const r = await fetch(`./data/tasks.json`);
      if (r.ok) return await r.json();
  } catch (e) {
      console.error("Error fetching fallback:", e);
  }

  return { businesses: [] }; 
}

async function init() {
  // Load tasks
  const t = await getTasks();
  if (!t || !t.businesses || t.businesses.length === 0) {
      // Emergency fallback if fetch fails locally (shouldn't happen in this env)
      console.warn("Using minimal fallback");
      state.tasks = { businesses: [] };
  } else {
      state.tasks = t;
  }
  
  // Load Progress (DB -> Local -> Sync)
  let saved = await loadProgressFromDB();
  if (!saved) {
      saved = loadProgress();
      if (Object.keys(saved).length > 0) {
          saveProgressToDB(saved);
      }
  }
  state.progress = saved || {};
  
  if (document.getElementById("appVersion")) {
      document.getElementById("appVersion").textContent = `v${dataVersion}`;
  }
  
  renderTabs(state.tasks.businesses);
  updateGlobalStats();
}

init();
