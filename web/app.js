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

document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("¿Estás seguro de reiniciar todo el progreso?")) {
      localStorage.removeItem(storeKey);
      location.reload();
  }
});

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

function showDetail(item) {
  // Crear ventana emergente completa
  const modal = document.createElement('div');
  modal.className = 'task-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  const modalContent = document.createElement('div');
  modalContent.className = 'task-modal-content';
  modalContent.style.cssText = `
    background: #1a1a1a;
    border-radius: 12px;
    padding: 30px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid #333;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    transform: translateY(20px);
    transition: transform 0.3s ease;
  `;

  // Header con título y botón de cerrar
  const modalHeader = document.createElement('div');
  modalHeader.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #333;
  `;

  const titleElement = document.createElement('h2');
  titleElement.textContent = item.title;
  titleElement.style.cssText = `
    color: #fff;
    font-size: 1.8em;
    font-weight: 700;
    margin: 0;
  `;

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.5em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  `;
  closeButton.onmouseover = () => closeButton.style.background = '#cc0000';
  closeButton.onmouseout = () => closeButton.style.background = '#ff4444';
  closeButton.onclick = () => document.body.removeChild(modal);

  modalHeader.appendChild(titleElement);
  modalHeader.appendChild(closeButton);

  // Badge si existe
  if (item.badge) {
    const badgeElement = document.createElement('div');
    badgeElement.textContent = item.badge;
    badgeElement.style.cssText = `
      background: linear-gradient(135deg, #0070f3, #0051a2);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: 600;
      margin-top: 10px;
      display: inline-block;
    `;
    modalHeader.appendChild(badgeElement);
  }

  // Contenido principal
  const contentElement = document.createElement('div');
  contentElement.className = 'task-modal-body';
  contentElement.style.cssText = `
    color: #e0e0e0;
    line-height: 1.6;
    font-size: 1.1em;
  `;

  let desc = item.guide || item.description || "Sin descripción detallada.";
  
  // Mejor procesamiento de Markdown
  desc = desc
      .replace(/### 🎯 (.*)/g, '<h3 style="color: #0070f3; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">🎯 $1</h3>')
      .replace(/### ✅ (.*)/g, '<h3 style="color: #00cc66; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">✅ $1</h3>')
      .replace(/### 🛠️ (.*)/g, '<h3 style="color: #ff9900; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">🛠️ $1</h3>')
      .replace(/### 📋 (.*)/g, '<h3 style="color: #9966cc; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">📋 $1</h3>')
      .replace(/### 💡 (.*)/g, '<h3 style="color: #ffcc00; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">💡 $1</h3>')
      .replace(/### ✅ (.*)/g, '<h3 style="color: #00cc66; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">✅ $1</h3>')
      .replace(/### 📦 (.*)/g, '<h3 style="color: #ff6699; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">📦 $1</h3>')
      .replace(/### ⚠️ (.*)/g, '<h3 style="color: #ff4444; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">⚠️ $1</h3>')
      .replace(/### 🚀 (.*)/g, '<h3 style="color: #00ccff; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">🚀 $1</h3>')
      .replace(/### (.*)/g, '<h3 style="color: #fff; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff;">$1</strong>')
      .replace(/```([\s\S]*?)```/g, '<div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0070f3; font-family: monospace; white-space: pre-wrap;">$1</div>')
      .replace(/- (.*)/g, '<li style="margin: 8px 0; padding-left: 5px;">• $1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

  contentElement.innerHTML = desc;

  // Render Tools mejorado
  if (item.tools && Array.isArray(item.tools) && item.tools.length > 0) {
      const toolsHtml = `
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #333;">
              <h3 style="color: #ff9900; margin-bottom: 15px; font-size: 1.2em;">🛠️ Herramientas Directas</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                  ${item.tools.map(tool => `
                      <a href="${tool.url}" target="_blank" style="
                          background: linear-gradient(135deg, #0070f3, #0051a2);
                          color: white; 
                          padding: 12px 20px; 
                          border-radius: 8px; 
                          text-decoration: none;
                          display: flex;
                          align-items: center;
                          gap: 8px;
                          font-size: 1em;
                          font-weight: 500;
                          transition: transform 0.2s, box-shadow 0.2s;
                          text-align: center;
                      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0, 112, 243, 0.3)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                          🚀 ${tool.name}
                      </a>
                  `).join('')}
              </div>
          </div>
      `;
      contentElement.innerHTML += toolsHtml;
  }

  // Botones de acción
  const actionButtons = document.createElement('div');
  actionButtons.style.cssText = `
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #333;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Cerrar';
  closeBtn.style.cssText = `
    background: #666;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: background 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = '#555';
  closeBtn.onmouseout = () => closeBtn.style.background = '#666';
  closeBtn.onclick = () => document.body.removeChild(modal);

  actionButtons.appendChild(closeBtn);

  // Ensamblar modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(contentElement);
  modalContent.appendChild(actionButtons);
  modal.appendChild(modalContent);

  // Añadir al documento
  document.body.appendChild(modal);

  // Animación de entrada
  setTimeout(() => {
    modal.style.opacity = '1';
    modalContent.style.transform = 'translateY(0)';
  }, 10);

  // Cerrar con ESC
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Cerrar al hacer clic fuera
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleEscape);
    }
  };
}

// Init - Carga de datos con soporte para file:// y http://
function loadTasksData() {
    try {
        // Intento 1: Si estamos en servidor HTTP, usar fetch
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            return fetch('data/tasks.json?v=' + dataVersion)
                .then(r => {
                    if (!r.ok) throw new Error("HTTP " + r.status);
                    return r.json();
                });
        }
        
        // Intento 2: Si estamos en file://, usar XMLHttpRequest sincrónico
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/tasks.json?v=' + dataVersion, false); // Sincrónico
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
