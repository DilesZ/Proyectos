const state={tasks:{},progress:{}}
const storeKey="orquestador_progress_v1"
const elTabs=document.getElementById("businessTabs")
const elContent=document.getElementById("content")
const elTotalPoints=document.getElementById("totalPoints")
const elTotalCompleted=document.getElementById("totalCompleted")
const elTotalTasks=document.getElementById("totalTasks")
document.getElementById("resetProgress").addEventListener("click",()=>{localStorage.removeItem(storeKey);location.reload()})
function loadProgress(){try{const raw=localStorage.getItem(storeKey);return raw?JSON.parse(raw):{}}catch(e){return{}}}
function saveProgress(){localStorage.setItem(storeKey,JSON.stringify(state.progress))}
function computeStats(all){let total=0,completed=0,points=0;for(const b of all){for(const t of b.tasks){total++;const done=state.progress[t.id]===true;if(done){completed++;points+=t.points||0}}}return{total,completed,points}}
function renderTabs(all){elTabs.innerHTML="";all.forEach((b,i)=>{const tab=document.createElement("div");tab.className="tab"+(i===0?" active":"");tab.textContent=b.name;tab.dataset.key=b.key;tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");renderBusiness(b)});elTabs.appendChild(tab)});renderBusiness(all[0])}
function renderBusiness(b){elContent.innerHTML="";const card=document.createElement("div");card.className="card";const done=b.tasks.filter(t=>state.progress[t.id]===true).length;const pct=Math.round((done/(b.tasks.length||1))*100)
card.innerHTML=`<h2>${b.name}</h2><div class="progress"><div class="bar" style="width:${pct}%"></div></div><div class="stats"><span>${done}/${b.tasks.length} tareas</span><span>${pct}%</span></div><div class="list"></div><div class="controls"><span class="pill">Puntos: ${b.tasks.filter(t=>state.progress[t.id]===true).reduce((a,c)=>a+(c.points||0),0)}</span></div>`
const list=card.querySelector(".list")
b.tasks.forEach(t=>{const row=document.createElement("div");row.className="task"+(state.progress[t.id]===true?" done":"");const checked=state.progress[t.id]===true?"checked":"";row.innerHTML=`<div class="task-left"><input type="checkbox" ${checked} data-id="${t.id}"><div><div>${t.title}</div><div class="stats">+${t.points||0} pts</div></div></div><div>${t.badge?`<span class="badge">${t.badge}</span>`:""}</div>`;list.appendChild(row)})
list.querySelectorAll("input[type=checkbox]").forEach(chk=>{chk.addEventListener("change",e=>{const id=e.target.dataset.id;state.progress[id]=e.target.checked;saveProgress();renderBusiness(b);const s=computeStats(state.tasks.businesses);elTotalPoints.textContent=s.points;elTotalCompleted.textContent=s.completed;elTotalTasks.textContent=s.total})})
elContent.appendChild(card)}
fetch("./data/tasks.json").then(r=>r.json()).then(data=>{state.tasks=data;state.progress=loadProgress();renderTabs(data.businesses);const s=computeStats(data.businesses);elTotalPoints.textContent=s.points;elTotalCompleted.textContent=s.completed;elTotalTasks.textContent=s.total}).catch(()=>{elTabs.innerHTML="Error cargando tareas";})
