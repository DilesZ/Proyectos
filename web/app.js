const state = {
  tasks: {},
  progress: {}
};
const dataVersion = "20260109-fixed2";
const storeKey = "orquestador_progress_v2";
// Simple userId generation/retrieval for demo purposes
function getUserId() {
    let uid = localStorage.getItem("orquestador_uid");
    if (!uid) {
        uid = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("orquestador_uid", uid);
    }
    return uid;
}
const userId = getUserId();

// Elements
const elTabs = document.getElementById("businessTabs");
const elContent = document.getElementById("content");
const elTotalPoints = document.getElementById("totalPoints");
const elTotalCompleted = document.getElementById("totalCompleted");
const elTotalTasks = document.getElementById("totalTasks");
const elCurrentViewTitle = document.getElementById("currentViewTitle");

// Detail View Elements
const elDetailView = document.getElementById("detailView");
const elDetailOverlay = document.getElementById("detailOverlay");
const elDetailTitle = document.getElementById("detailTitle");
const elDetailBody = document.getElementById("detailBody");
const elDetailBadge = document.getElementById("detailBadge");
const elDetailTime = document.getElementById("detailTime");
const elDetailDiff = document.getElementById("detailDiff");
const btnCloseDetail = document.getElementById("closeDetail");
const detailDraftKey = "orquestador_detail_drafts_v1";
let lastFocusedElement = null;
let activeDetailItem = null;
document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("¿Estás seguro de reiniciar todo el progreso?")) {
      localStorage.removeItem(storeKey);
      location.reload();
  }
});

btnCloseDetail.addEventListener("click", hideDetail);
elDetailOverlay.addEventListener("click", hideDetail);
state.detailDrafts = loadDetailDrafts();
async function loadProgress() {
  // First try local storage for immediate render
  let localData = {};
  try {
      const raw = localStorage.getItem(storeKey);
      if (raw) localData = JSON.parse(raw);
  } catch (e) { console.warn("Local load error", e); }

  // Then try to fetch from API
  try {
      const res = await fetch(`/api/progress?userId=${userId}`);
      if (res.ok) {
          const cloudData = await res.json();
          if (cloudData) {
              console.log("Cloud data loaded", cloudData);
              // Merge or prefer cloud? For now, prefer cloud if exists
              return cloudData;
          }
      }
  } catch (e) {
      console.warn("API load error", e);
  }
  
  return localData;
}

async function saveProgress() {
  // Save local
  localStorage.setItem(storeKey, JSON.stringify(state.progress));
  
  // Save cloud
  try {
      await fetch(`/api/progress?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.progress)
      });
  } catch (e) {
      console.error("API save error", e);
  }
}

function computeStats(all) {
  let total = 0, completed = 0, points = 0;
  
  const checkStatus = (item) => state.progress[item.id] === true;

  for (const b of all) {
      for (const t of b.tasks) {
          const subt = t.subtasks || [];
          if (subt.length === 0) {
              total++;
              if (checkStatus(t)) {
                  completed++;
                  points += t.points || 0;
              }
          } else {
              for (const s of subt) {
                  const steps = s.steps || [];
                  if (steps.length > 0) {
                      total += steps.length;
                      let stepDone = 0;
                      for (const st of steps) {
                          if (checkStatus(st)) stepDone++;
                      }
                      completed += stepDone;
                      if (stepDone === steps.length) points += s.points || 0;
                  } else {
                      total++;
                      if (checkStatus(s)) {
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

function updateGlobalStats(all) {
  const stats = computeStats(all);
  elTotalPoints.textContent = stats.points;
  elTotalCompleted.textContent = stats.completed;
  elTotalTasks.textContent = stats.total;
}

function renderTabs(all) {
  elTabs.innerHTML = "";
  all.forEach((b, i) => {
      const tab = document.createElement("div");
      tab.className = "nav-item" + (i === 0 ? " active" : "");
      tab.textContent = b.name;
      tab.dataset.key = b.key;
      tab.addEventListener("click", () => {
          document.querySelectorAll(".nav-item").forEach(x => x.classList.remove("active"));
          tab.classList.add("active");
          renderBusiness(b);
      });
      elTabs.appendChild(tab);
  });
  if(all.length > 0) renderBusiness(all[0]);
}

function renderBusiness(b) {
  elCurrentViewTitle.textContent = b.name;
  elContent.innerHTML = "";
  
  const container = document.createElement("div");
  container.className = "project-container";

  // Calculate local stats
  let total = 0, done = 0;
  const traverse = (items) => {
      items.forEach(t => {
          if (t.subtasks && t.subtasks.length > 0) {
              t.subtasks.forEach(s => {
                  if (s.steps && s.steps.length > 0) {
                      total += s.steps.length;
                      s.steps.forEach(st => { if(state.progress[st.id]) done++; });
                  } else {
                      total++;
                      if(state.progress[s.id]) done++;
                  }
              });
          } else {
              total++;
              if(state.progress[t.id]) done++;
          }
      });
  };
  traverse(b.tasks);

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  container.innerHTML = `
      <div class="project-header">
          <div class="progress-container">
              <div class="progress-bar" style="width: ${pct}%"></div>
          </div>
          <div class="stat-row">
              <span>Progreso del Proyecto</span>
              <span class="stat-value">${pct}% (${done}/${total} items)</span>
          </div>
      </div>
      <div class="task-list"></div>
  `;

  elContent.appendChild(container);
  const list = container.querySelector(".task-list");

  b.tasks.forEach(t => {
      const hasSub = (t.subtasks && t.subtasks.length > 0);
      
      // Determine task "checked" state (visual only if it has subtasks)
      let isDone = false;
      if (!hasSub) {
          isDone = state.progress[t.id] === true;
      } else {
          isDone = t.subtasks.every(s => {
              const steps = s.steps || [];
              return steps.length > 0 ? steps.every(st => state.progress[st.id] === true) : state.progress[s.id] === true;
          });
      }

      const card = document.createElement("div");
      card.className = "task-card";
      
      const header = document.createElement("div");
      header.className = "task-header";
      
      // Checkbox: If has subtasks, it acts as "select all" or just visual indicator
      // Let's make it actionable: clicking it toggles all children
      header.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${isDone ? "checked" : ""} data-id="${t.id}">
          <div class="task-info">
              <div class="task-title">${t.title}</div>
              <div class="task-meta">
                  ${hasSub ? `<span>${t.subtasks.length} grupos</span>` : ""}
                  ${t.points ? `<span class="badge points">+${t.points} pts</span>` : ""}
                  ${t.badge ? `<span class="badge">${t.badge}</span>` : ""}
              </div>
          </div>
          <button class="btn-icon info-btn" title="Ver detalles">ℹ</button>
      `;

      // Event: Toggle Details
      header.querySelector(".info-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          showDetail(t);
      });

      // Event: Expand/Collapse Subtasks (Clicking header body)
      if (hasSub) {
          header.addEventListener("click", (e) => {
              if(e.target.type === "checkbox" || e.target.closest(".info-btn")) return;
              const subEl = card.querySelector(".subtasks");
              if(subEl) subEl.classList.toggle("open");
          });
      }

      // Event: Checkbox
      const cb = header.querySelector(".task-checkbox");
      cb.addEventListener("change", (e) => {
          const newVal = e.target.checked;
          updateTaskStatus(t, newVal);
          saveProgress();
          // Update global stats
          // We need to re-read 'allBusinesses' from state.tasks to update global
          // But 'b' is a reference, so it should be fine? 
          // Actually updateGlobalStats needs the full array.
          // For now, re-render current view is enough for feedback
          renderBusiness(b);
      });

      card.appendChild(header);

      // Subtasks Rendering
      if (hasSub) {
          const subList = document.createElement("div");
          subList.className = "subtasks";
          
          t.subtasks.forEach(s => {
              const hasSteps = (s.steps && s.steps.length > 0);
              const sItem = document.createElement("div");
              sItem.className = "subtask-item";
              
              let sDone = false;
              if (hasSteps) {
                  sDone = s.steps.every(st => state.progress[st.id]);
              } else {
                  sDone = state.progress[s.id];
              }

              const sHeader = document.createElement("div");
              sHeader.className = "subtask-header";
              sHeader.innerHTML = `
                  <input type="checkbox" class="task-checkbox" ${sDone ? "checked" : ""} data-id="${s.id}">
                  <div class="subtask-title">${s.title} ${hasSteps ? `<small>(${s.steps.length} pasos)</small>` : ""}</div>
                  ${s.points ? `<span class="badge points">+${s.points}</span>` : ""}
                  <button class="btn-icon info-btn-s" title="Detalles">ℹ</button>
              `;

              // Subtask Info
              sHeader.querySelector(".info-btn-s").addEventListener("click", (e) => {
                  e.stopPropagation();
                  showDetail(s);
              });

              // Subtask Expand Steps
              if (hasSteps) {
                  sHeader.querySelector(".subtask-title").addEventListener("click", () => {
                      const stCont = sItem.querySelector(".steps-container");
                      if(stCont) stCont.classList.toggle("open");
                  });
              }

              // Subtask Checkbox
              const sCb = sHeader.querySelector("input");
              sCb.addEventListener("change", (e) => {
                  const val = e.target.checked;
                  if (hasSteps) {
                      s.steps.forEach(st => state.progress[st.id] = val);
                  } else {
                      state.progress[s.id] = val;
                  }
                  saveProgress();
                  renderBusiness(b);
              });

              sItem.appendChild(sHeader);

              // Steps Rendering (Level 3)
              if (hasSteps) {
                  const stepsCont = document.createElement("div");
                  stepsCont.className = "steps-container";
                  
                  s.steps.forEach(st => {
                      const stItem = document.createElement("div");
                      stItem.className = "step-item";
                      const stDone = state.progress[st.id] === true;
                      
                      stItem.innerHTML = `
                          <input type="checkbox" class="task-checkbox" ${stDone ? "checked" : ""} data-id="${st.id}">
                          <span style="flex:1; cursor:pointer">${st.title}</span>
                          <button class="btn-icon info-btn-st" style="font-size:0.8em">ℹ</button>
                      `;
                      
                      // Step Info
                      stItem.querySelector(".info-btn-st").addEventListener("click", (e) => {
                          e.stopPropagation();
                          showDetail(st);
                      });
                      
                      // Step click text -> open info
                      stItem.querySelector("span").addEventListener("click", () => {
                          showDetail(st);
                      });

                      // Step Checkbox
                      const stCb = stItem.querySelector("input");
                      stCb.addEventListener("change", (e) => {
                          state.progress[st.id] = e.target.checked;
                          saveProgress();
                          renderBusiness(b);
                      });
                      
                      stepsCont.appendChild(stItem);
                  });
                  sItem.appendChild(stepsCont);
              }

              subList.appendChild(sItem);
          });
          card.appendChild(subList);
      }
      list.appendChild(card);
  });
}

function updateTaskStatus(t, val) {
  if (t.subtasks && t.subtasks.length > 0) {
      t.subtasks.forEach(s => updateTaskStatus(s, val));
  } else if (t.steps && t.steps.length > 0) {
      t.steps.forEach(st => state.progress[st.id] = val);
  } else {
      state.progress[t.id] = val;
  }
}

function loadDetailDrafts() {
  try {
      const raw = localStorage.getItem(detailDraftKey);
      return raw ? JSON.parse(raw) : {};
  } catch (e) {
      return {};
  }
}

function saveDetailDraft(itemId, draft) {
  state.detailDrafts[itemId] = draft;
  localStorage.setItem(detailDraftKey, JSON.stringify(state.detailDrafts));
}

function escapeHtml(str) {
  return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}

function headingKey(str) {
  return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim();
}

function parseGuideSections(guide) {
  const text = String(guide || "").replace(/\r\n/g, "\n");
  const sections = {};
  let current = "general";
  sections[current] = [];
  text.split("\n").forEach(line => {
      const m = line.match(/^###\s+(.*)$/);
      if (m) {
          current = headingKey(m[1]);
          if (!sections[current]) sections[current] = [];
      } else {
          sections[current].push(line);
      }
  });
  Object.keys(sections).forEach(k => sections[k] = sections[k].join("\n").trim());
  return sections;
}

function extractList(text) {
  return String(text || "")
      .split("\n")
      .map(l => l.trim())
      .filter(l => /^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l))
      .map(l => l.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "").trim())
      .filter(Boolean);
}

function extractParagraph(text) {
  return String(text || "")
      .split("\n")
      .map(l => l.trim())
      .filter(l => l && !/^[-*]\s+/.test(l) && !/^\d+\.\s+/.test(l))
      .join(" ");
}

function getAllBusinesses() {
  if (Array.isArray(state.tasks)) return state.tasks;
  if (state.tasks && Array.isArray(state.tasks.businesses)) return state.tasks.businesses;
  if (state.tasks && typeof state.tasks === "object") return Object.values(state.tasks);
  return [];
}

function rerenderActiveBusiness() {
  const all = getAllBusinesses();
  if (all.length === 0) return;
  const activeKey = document.querySelector(".nav-item.active")?.dataset.key;
  const business = all.find(x => x.key === activeKey) || all[0];
  updateGlobalStats(all);
  renderBusiness(business);
}

function getPopupChecklist(item, sections) {
  const validation = extractList(sections.validacion || sections.validacionprerrequisitos || "");
  const entregables = extractList(sections.entregables || "");
  const base = [
      "Entiendo claramente el objetivo del paso",
      "He definido una acción concreta para ejecutarlo hoy",
      "He preparado evidencia de avance o resultado"
  ];
  return [...base, ...validation, ...entregables].slice(0, 8);
}

function buildDetailTemplate(item, draft, sections) {
  const objetivo = extractParagraph(sections.objetivo) || item.description || "Completa este paso con calidad verificable y evidencia.";
  const instrucciones = extractList(sections.instrucciones || sections.instruccionesaz || sections.general);
  const tips = extractList(sections.tips || "");
  const errores = extractList(sections.errorescomunes || "");
  const ejemplo = extractParagraph(sections.ejemplo || "");
  const checklist = getPopupChecklist(item, sections);
  const resources = Array.isArray(item.tools) ? item.tools : [];
  const currentProgress = state.progress[item.id] === true;

  return `
    <section class="popup-overview">
      <div class="popup-progress-wrap">
        <div class="popup-progress-labels">
          <span>Preparación del paso</span>
          <span id="popupProgressText">0%</span>
        </div>
        <div class="popup-progress-track"><div id="popupProgressBar" class="popup-progress-bar" style="width:0%"></div></div>
      </div>
      <p class="popup-objective">${escapeHtml(objetivo)}</p>
      ${instrucciones.length ? `
      <div class="popup-card">
        <h3>Plan de ejecución paso a paso</h3>
        <ol>${instrucciones.slice(0, 8).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ol>
      </div>` : ""}
      ${tips.length ? `
      <div class="popup-card">
        <h3>Recomendaciones de éxito</h3>
        <ul>${tips.slice(0, 6).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
      </div>` : ""}
      ${errores.length ? `
      <div class="popup-card warning">
        <h3>Evita estos errores</h3>
        <ul>${errores.slice(0, 6).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
      </div>` : ""}
      <div class="popup-card form-card">
        <h3>Completar este paso</h3>
        <label for="fieldGoal">Resultado esperado del paso</label>
        <input id="fieldGoal" class="popup-input" type="text" maxlength="160" value="${escapeHtml(draft.goal || "")}" placeholder="Ejemplo: Definir el arquetipo final y guardarlo en mi biblia de personaje">
        <small id="fieldGoalHint" class="field-hint">Describe un resultado concreto y medible.</small>

        <label for="fieldPrompt">Prompt de trabajo</label>
        <textarea id="fieldPrompt" class="popup-textarea" rows="4" placeholder="Escribe aquí el prompt final que usarás">${escapeHtml(draft.prompt || item.prompt || "")}</textarea>
        <small id="fieldPromptHint" class="field-hint">Debe ser claro, específico y ejecutable.</small>

        <label for="fieldNotes">Notas de ejecución</label>
        <textarea id="fieldNotes" class="popup-textarea" rows="5" placeholder="Qué harás, cómo lo validarás y qué aprendiste">${escapeHtml(draft.notes || "")}</textarea>
        <small id="fieldNotesHint" class="field-hint">Incluye decisión final, criterio y próximos pasos.</small>

        <label for="fieldEvidence">Enlace de evidencia (opcional)</label>
        <input id="fieldEvidence" class="popup-input" type="url" value="${escapeHtml(draft.evidence || "")}" placeholder="https://...">
        <small id="fieldEvidenceHint" class="field-hint">Si adjuntas evidencia, valida mejor tu progreso.</small>

        ${ejemplo ? `<div class="popup-example"><strong>Ejemplo:</strong> ${escapeHtml(ejemplo)}</div>` : ""}

        <div class="popup-checklist">
          <h4>Checklist de finalización</h4>
          ${checklist.map((x, i) => `
            <label class="check-row">
              <input type="checkbox" class="check-item" data-index="${i}" ${(draft.checks?.[i]) ? "checked" : ""}>
              <span>${escapeHtml(x)}</span>
            </label>
          `).join("")}
        </div>
      </div>
      ${resources.length ? `
      <div class="popup-card">
        <h3>Recursos recomendados</h3>
        <div class="tools-grid">
          ${resources.map(tool => `<a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener noreferrer" class="btn-tool-link">Abrir ${escapeHtml(tool.name)}</a>`).join("")}
        </div>
      </div>` : ""}
      <div id="popupValidationBanner" class="popup-banner"></div>
      <div class="popup-actions">
        <button id="btnCopyPrompt" class="btn btn-secondary" type="button">Copiar prompt</button>
        <button id="btnSaveDraft" class="btn btn-secondary" type="button">Guardar borrador</button>
        <button id="btnCompleteStep" class="btn btn-primary" type="button">${currentProgress ? "Actualizar como completado" : "Marcar como completado"}</button>
      </div>
    </section>
  `;
}

function evaluatePopupState(item) {
  const goal = (elDetailBody.querySelector("#fieldGoal")?.value || "").trim();
  const prompt = (elDetailBody.querySelector("#fieldPrompt")?.value || "").trim();
  const notes = (elDetailBody.querySelector("#fieldNotes")?.value || "").trim();
  const evidence = (elDetailBody.querySelector("#fieldEvidence")?.value || "").trim();
  const checks = [...elDetailBody.querySelectorAll(".check-item")];
  const checkedCount = checks.filter(x => x.checked).length;
  const checksRatio = checks.length ? checkedCount / checks.length : 1;
  const evidenceValid = !evidence || /^https?:\/\/\S+$/i.test(evidence);
  const goalOk = goal.length >= 15;
  const promptOk = prompt.length >= 20;
  const notesOk = notes.length >= 40;
  const score = Math.round((goalOk ? 20 : 0) + (promptOk ? 20 : 0) + (notesOk ? 25 : 0) + (evidenceValid ? 10 : 0) + (checksRatio * 25));
  return { score, goalOk, promptOk, notesOk, evidenceValid, checkedCount, checksTotal: checks.length };
}

function syncPopupValidation() {
  const status = evaluatePopupState(activeDetailItem);
  const progressText = elDetailBody.querySelector("#popupProgressText");
  const progressBar = elDetailBody.querySelector("#popupProgressBar");
  const banner = elDetailBody.querySelector("#popupValidationBanner");
  if (progressText) progressText.textContent = `${status.score}%`;
  if (progressBar) progressBar.style.width = `${status.score}%`;
  const hintGoal = elDetailBody.querySelector("#fieldGoalHint");
  const hintPrompt = elDetailBody.querySelector("#fieldPromptHint");
  const hintNotes = elDetailBody.querySelector("#fieldNotesHint");
  const hintEvidence = elDetailBody.querySelector("#fieldEvidenceHint");
  if (hintGoal) hintGoal.className = `field-hint ${status.goalOk ? "ok" : "error"}`;
  if (hintPrompt) hintPrompt.className = `field-hint ${status.promptOk ? "ok" : "error"}`;
  if (hintNotes) hintNotes.className = `field-hint ${status.notesOk ? "ok" : "error"}`;
  if (hintEvidence) hintEvidence.className = `field-hint ${status.evidenceValid ? "ok" : "error"}`;
  if (banner) {
      if (status.score >= 80) {
          banner.className = "popup-banner success";
          banner.textContent = `Listo para completar. Checklist: ${status.checkedCount}/${status.checksTotal}.`;
      } else {
          banner.className = "popup-banner warning";
          banner.textContent = `Te faltan datos clave para maximizar éxito (${status.score}%). Completa objetivo, prompt, notas y checklist.`;
      }
  }
}

function collectDraftFromPopup(item) {
  const checks = [...elDetailBody.querySelectorAll(".check-item")].map(x => x.checked);
  return {
      goal: elDetailBody.querySelector("#fieldGoal")?.value || "",
      prompt: elDetailBody.querySelector("#fieldPrompt")?.value || "",
      notes: elDetailBody.querySelector("#fieldNotes")?.value || "",
      evidence: elDetailBody.querySelector("#fieldEvidence")?.value || "",
      checks
  };
}

function handleDetailKeydown(e) {
  if (!elDetailView.classList.contains("open")) return;
  if (e.key === "Escape") {
      hideDetail();
      return;
  }
  if (e.key !== "Tab") return;
  const focusables = elDetailView.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
  const items = [...focusables].filter(el => !el.disabled && el.offsetParent !== null);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
  }
}

function showDetail(item) {
  activeDetailItem = item;
  lastFocusedElement = document.activeElement;
  elDetailTitle.textContent = item.title;
  const draft = state.detailDrafts[item.id] || {};
  const sections = parseGuideSections(item.guide || "");
  elDetailBody.innerHTML = buildDetailTemplate(item, draft, sections);
  if (item.badge) {
      elDetailBadge.textContent = item.badge;
      elDetailBadge.classList.remove("hidden");
  } else {
      elDetailBadge.classList.add("hidden");
  }
  if (item.time) {
      elDetailTime.textContent = item.time;
      elDetailTime.classList.remove("hidden");
  } else {
      elDetailTime.classList.add("hidden");
  }
  if (item.difficulty) {
      elDetailDiff.textContent = item.difficulty;
      elDetailDiff.classList.remove("hidden");
  } else {
      elDetailDiff.classList.add("hidden");
  }

  const liveFields = ["#fieldGoal", "#fieldPrompt", "#fieldNotes", "#fieldEvidence"];
  liveFields.forEach(sel => {
      const node = elDetailBody.querySelector(sel);
      if (node) {
          node.addEventListener("input", () => {
              syncPopupValidation();
              saveDetailDraft(item.id, collectDraftFromPopup(item));
          });
      }
  });
  elDetailBody.querySelectorAll(".check-item").forEach(node => {
      node.addEventListener("change", () => {
          syncPopupValidation();
          saveDetailDraft(item.id, collectDraftFromPopup(item));
      });
  });

  elDetailBody.querySelector("#btnCopyPrompt")?.addEventListener("click", async () => {
      const text = elDetailBody.querySelector("#fieldPrompt")?.value || "";
      if (!text.trim()) return;
      try {
          await navigator.clipboard.writeText(text);
      } catch (e) {}
      syncPopupValidation();
  });

  elDetailBody.querySelector("#btnSaveDraft")?.addEventListener("click", () => {
      saveDetailDraft(item.id, collectDraftFromPopup(item));
      syncPopupValidation();
  });

  elDetailBody.querySelector("#btnCompleteStep")?.addEventListener("click", async () => {
      syncPopupValidation();
      const status = evaluatePopupState(item);
      saveDetailDraft(item.id, collectDraftFromPopup(item));
      if (status.score < 70) {
          alert("Completa los campos clave antes de marcar este paso como finalizado.");
          return;
      }
      state.progress[item.id] = true;
      await saveProgress();
      rerenderActiveBusiness();
      hideDetail();
  });

  syncPopupValidation();
  elDetailOverlay.classList.add("open");
  elDetailOverlay.setAttribute("aria-hidden", "false");
  elDetailView.classList.add("open");
  elDetailView.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", handleDetailKeydown);
  btnCloseDetail.focus();
}

function hideDetail() {
  elDetailOverlay.classList.remove("open");
  elDetailOverlay.setAttribute("aria-hidden", "true");
  elDetailView.classList.remove("open");
  elDetailView.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", handleDetailKeydown);
  activeDetailItem = null;
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
  }
}

// Init - Carga de datos con soporte para file:// y http://
function loadTasksData() {
    try {
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            return fetch('data/tasks.json?v=' + dataVersion)
                .then(r => {
                    if (!r.ok) throw new Error("HTTP " + r.status);
                    return r.json();
                });
        }
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/tasks.json?v=' + dataVersion, false);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        reject(new Error('Error parsing JSON: ' + e.message));
                    }
                } else {
                    reject(new Error('HTTP ' + xhr.status));
                }
            };
            xhr.onerror = function() {
                reject(new Error('Network error'));
            };
            xhr.send(null);
        });
    } catch (e) {
        return Promise.reject(e);
    }
}

// Cargar datos y inicializar
loadTasksData()
    .then(async data => {
        state.tasks = data;
        state.progress = await loadProgress();
        
        let allBusinesses = [];
        if (Array.isArray(data)) {
            allBusinesses = data;
        } else if (data.businesses && Array.isArray(data.businesses)) {
            allBusinesses = data.businesses;
        } else {
            allBusinesses = Object.values(data);
        }
        
        updateGlobalStats(allBusinesses);
        renderTabs(allBusinesses);
    })
    .catch(e => {
        console.error("Error loading tasks", e);
        elContent.innerHTML = "<div style='padding:2rem; color:red'>Error cargando datos. Revisa la consola.<br><small>" + e.message + "</small><br><br>Para solucionar:<br>1. Usa el archivo start-server.bat<br>2. O abre Chrome con: --allow-file-access-from-files</div>";
    });
