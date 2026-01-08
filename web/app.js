const state = {
  tasks: {},
  progress: {}
};
const dataVersion = "20260108"; 
const storeKey = "orquestador_progress_v2";

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

document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("¿Estás seguro de reiniciar todo el progreso?")) {
      localStorage.removeItem(storeKey);
      location.reload();
  }
});

btnCloseDetail.addEventListener("click", hideDetail);
elDetailOverlay.addEventListener("click", hideDetail);

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
  // saveProgressToDB(state.progress); // Optional backend sync
}

function computeStats(all) {
  let total = 0, completed = 0, points = 0;
  
  // Helper to check task/subtask status recursively
  const checkStatus = (item) => {
      // If item is in progress map as true, it counts
      return state.progress[item.id] === true;
  };

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
              // Task has subtasks
              for (const s of subt) {
                  const steps = s.steps || [];
                  if (steps.length > 0) {
                      total += steps.length;
                      let stepCompletedCount = 0;
                      for (const st of steps) {
                          if (checkStatus(st)) stepCompletedCount++;
                      }
                      completed += stepCompletedCount;
                      
                      // Points only if all steps done
                      if (stepCompletedCount === steps.length) {
                          points += s.points || 0;
                      }
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
  // Initial render
  if(all.length > 0) renderBusiness(all[0]);
}

function renderBusiness(b) {
  elCurrentViewTitle.textContent = b.name;
  elContent.innerHTML = "";
  
  const container = document.createElement("div");
  container.className = "project-container";

  // Calculate stats for this business
  let total = 0, done = 0, points = 0;
  // Reuse compute logic locally or simplify
  // For UI progress bar
  // We'll just iterate quickly to get local stats
  // (Simplified for brevity, similar to computeStats but scoped)
  // ... implementation of local stats calculation ...
  
  // Let's implement a quick traversal for local stats
  const traverse = (items) => {
      items.forEach(t => {
          if (t.subtasks && t.subtasks.length > 0) {
              t.subtasks.forEach(s => {
                  if (s.steps && s.steps.length > 0) {
                      total += s.steps.length;
                      s.steps.forEach(st => {
                          if(state.progress[st.id]) done++;
                      });
                      if(s.steps.every(st => state.progress[st.id])) points += s.points || 0;
                  } else {
                      total++;
                      if(state.progress[s.id]) { done++; points += s.points || 0; }
                  }
              });
          } else {
              total++;
              if(state.progress[t.id]) { done++; points += t.points || 0; }
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
              <span class="stat-value">${pct}% (${done}/${total} pasos)</span>
          </div>
      </div>
      <div class="task-list"></div>
  `;

  elContent.appendChild(container);
  const list = container.querySelector(".task-list");

  b.tasks.forEach(t => {
      const hasSub = (t.subtasks && t.subtasks.length > 0);
      
      // Check completion status for styling
      let isDone = false;
      if (!hasSub) {
          isDone = state.progress[t.id] === true;
      } else {
          // Complex check
          isDone = t.subtasks.every(s => {
              const steps = s.steps || [];
              return steps.length > 0 ? steps.every(st => state.progress[st.id] === true) : state.progress[s.id] === true;
          });
      }

      const card = document.createElement("div");
      card.className = "task-card";
      
      const checked = isDone ? "checked" : "";
      
      // Card Header
      const header = document.createElement("div");
      header.className = "task-header";
      
      // Main checkbox logic (only for tasks without subtasks, or visual for parents)
      // For parent tasks, clicking checkbox should arguably toggle all subtasks?
      // For now, let's keep it simple: Parent checkbox reflects state, maybe read-only or toggle all.
      // Let's make it toggle all for convenience.
      
      header.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${checked} data-id="${t.id}" data-has-sub="${hasSub}">
          <div class="task-info">
              <div class="task-title">${t.title}</div>
              <div class="task-meta">
                  ${hasSub ? `<span>${t.subtasks.length} subtareas</span>` : ""}
                  ${t.points ? `<span class="badge points">+${t.points} pts</span>` : ""}
                  ${t.badge ? `<span class="badge">${t.badge}</span>` : ""}
              </div>
          </div>
      `;
      
      // Click on title/info opens details
      header.querySelector(".task-info").addEventListener("click", (e) => {
          e.stopPropagation();
          showDetail(t);
      });

      // Click on header (background) could toggle subtasks visibility if present
      if (hasSub) {
          header.addEventListener("click", (e) => {
             // If clicked on checkbox, don't toggle view
             if(e.target.classList.contains("task-checkbox")) return;
             
             const subEl = card.querySelector(".subtasks");
             if(subEl) subEl.classList.toggle("open");
          });
      }

      // Checkbox handler
      const cb = header.querySelector(".task-checkbox");
      cb.addEventListener("change", (e) => {
          const newVal = e.target.checked;
          updateTaskStatus(t, newVal);
          saveProgress();
          updateGlobalStats([b]); // Inefficient but simple
          renderBusiness(b); // Re-render to update UI state
      });

      card.appendChild(header);

      // Subtasks Render
      if (hasSub) {
          const subList = document.createElement("div");
          subList.className = "subtasks";
          
          t.subtasks.forEach(s => {
              const sHasSteps = (s.steps && s.steps.length > 0);
              const sItem = document.createElement("div");
              sItem.className = "subtask-item";
              
              let sDone = false;
              if (sHasSteps) {
                  sDone = s.steps.every(st => state.progress[st.id]);
              } else {
                  sDone = state.progress[s.id];
              }

              sItem.innerHTML = `
                  <input type="checkbox" class="task-checkbox" ${sDone ? "checked" : ""} data-id="${s.id}">
                  <div class="subtask-title" style="flex:1; cursor:pointer;">${s.title}</div>
                  ${s.points ? `<span class="badge points">+${s.points}</span>` : ""}
              `;

              // Detail click
              sItem.querySelector(".subtask-title").addEventListener("click", () => showDetail(s));

              // Checkbox click
              const sCb = sItem.querySelector("input");
              sCb.addEventListener("change", (e) => {
                  const val = e.target.checked;
                  if(sHasSteps) {
                      s.steps.forEach(st => state.progress[st.id] = val);
                  } else {
                      state.progress[s.id] = val;
                  }
                  saveProgress();
                  renderBusiness(b); // Re-render parent to update progress
              });

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
  elDetailTitle.textContent = item.title;
  
  // Convert markdown-ish to HTML (simple)
  let desc = item.guide || item.description || "Sin descripción detallada.";
  
  // Basic Markdown replacement
  desc = desc
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*)/g, '<li>$1</li>')
      .replace(/\n/g, '<br>');

  elDetailBody.innerHTML = desc;
  
  // Badges
  if(item.badge) {
      elDetailBadge.textContent = item.badge;
      elDetailBadge.classList.remove("hidden");
  } else {
      elDetailBadge.classList.add("hidden");
  }
  
  elDetailOverlay.classList.add("open");
  elDetailView.classList.add("open");
}

function hideDetail() {
  elDetailOverlay.classList.remove("open");
  elDetailView.classList.remove("open");
}

// Init
fetch('data/tasks.json?v=' + dataVersion)
  .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
  })
  .then(data => {
      state.tasks = data;
      state.progress = loadProgress();
      
      // Handle different data structures (Array, Object with businesses key, or Object map)
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
      elContent.innerHTML = "<div style='padding:2rem; color:red'>Error cargando datos. Revisa la consola.<br><small>" + e.message + "</small></div>";
  });
