const state={tasks:{},progress:{}}
const dataVersion="20251234"
const storeKey="orquestador_progress_v1"
const elTabs=document.getElementById("businessTabs")
const elContent=document.getElementById("content")
const elTotalPoints=document.getElementById("totalPoints")
const elTotalCompleted=document.getElementById("totalCompleted")
const elTotalTasks=document.getElementById("totalTasks")
document.getElementById("resetProgress").addEventListener("click",()=>{localStorage.removeItem(storeKey);location.reload()})
function loadProgress(){try{const raw=localStorage.getItem(storeKey);return raw?JSON.parse(raw):{}}catch(e){return{}}}
function saveProgress(){localStorage.setItem(storeKey,JSON.stringify(state.progress))}
function computeStats(all){let total=0,completed=0,points=0;for(const b of all){for(const t of b.tasks){const subt=t.subtasks||[];if(subt.length===0){total++;if(state.progress[t.id]===true){completed++;points+=t.points||0}}else{for(const s of subt){const steps=s.steps||[];if(steps.length>0){total+=steps.length;let c=0;for(const st of steps){if(state.progress[st.id]===true){c++}}completed+=c;const allDone=steps.every(st=>state.progress[st.id]===true);if(allDone){points+=s.points||0}}else{total++;if(state.progress[s.id]===true){completed++;points+=s.points||0}}}}}}return{total,completed,points}}
function renderTabs(all){elTabs.innerHTML="";all.forEach((b,i)=>{const tab=document.createElement("div");tab.className="tab"+(i===0?" active":"");tab.textContent=b.name;tab.dataset.key=b.key;tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");renderBusiness(b)});elTabs.appendChild(tab)});renderBusiness(all[0])}
function renderBusiness(b){elContent.innerHTML="";const card=document.createElement("div");card.className="card";let total=0,done=0,points=0;for(const t of b.tasks){const subt=t.subtasks||[];if(subt.length===0){total++;if(state.progress[t.id]===true){done++;points+=t.points||0}}else{for(const s of subt){const steps=s.steps||[];if(steps.length>0){total+=steps.length;let c=0;for(const st of steps){if(state.progress[st.id]===true){c++}}done+=c;const allDone=steps.every(st=>state.progress[st.id]===true);if(allDone){points+=s.points||0}}else{total++;if(state.progress[s.id]===true){done++;points+=s.points||0}}}}}const pct=Math.round((done/(total||1))*100)
card.innerHTML=`<h2>${b.name}</h2><div class="progress"><div class="bar" style="width:${pct}%"></div></div><div class="stats"><span>${done}/${total} subtareas</span><span>${pct}%</span></div><div class="list"></div><div class="controls"><span class="pill">Puntos: ${points}</span></div>`
const list=card.querySelector(".list")
b.tasks.forEach(t=>{const hasSub=(t.subtasks&&t.subtasks.length>0);const allSubDone=hasSub?t.subtasks.every(s=>{const steps=s.steps||[];return steps.length>0?steps.every(st=>state.progress[st.id]===true):state.progress[s.id]===true}):false;const row=document.createElement("div");row.className="task"+((!hasSub && state.progress[t.id]===true)|| (hasSub && allSubDone)?" done":"");const checked=(!hasSub && state.progress[t.id]===true)|| (hasSub && allSubDone)?"checked":"";const chev=hasSub?`<span class="chevron ${allSubDone?'open':''}" data-task="${t.id}"></span>`:""
row.innerHTML=`<div class="task-left">${chev}<input type="checkbox" ${checked} data-id="${t.id}" data-hassub="${hasSub}"><div><div>${t.title}</div><div class="stats">${hasSub?`${t.subtasks.length} subtareas`: `+${t.points||0} pts`}</div></div></div><div>${t.badge?`<span class="badge">${t.badge}</span>`:""}</div>`;list.appendChild(row)
if(hasSub){const wrap=document.createElement("div");wrap.className="subtasks";wrap.style.display="block";t.subtasks.forEach(s=>{const sHasSteps=(s.steps&&s.steps.length>0);const steps=s.steps||[];const sDone=sHasSteps?steps.every(st=>state.progress[st.id]===true):state.progress[s.id]===true;const sChecked=sDone?"checked":"";const completedSteps=sHasSteps?steps.filter(st=>state.progress[st.id]===true).length:0;const chevSub=sHasSteps?`<span class="chevron-sub ${sDone?'open':''}" data-sub="${s.id}"></span>`:"";const sb=document.createElement("div");sb.className="subtask"+(sDone?" done":"");sb.innerHTML=`<div class="task-left">${chevSub}<input type="checkbox" ${sChecked} data-id="${s.id}" data-hassteps="${sHasSteps}"><div><div>${s.title}</div><div class="stats">${sHasSteps?`${completedSteps}/${steps.length} pasos`: `+${s.points||0} pts`}</div></div></div>`;wrap.appendChild(sb);if(sHasSteps){const sw=document.createElement("div");sw.className="steps";sw.style.display="block";steps.forEach(st=>{const stDone=state.progress[st.id]===true;const stChecked=stDone?"checked":"";const sd=document.createElement("div");sd.className="step"+(stDone?" done":"");sd.innerHTML=`<div class="task-left"><input type="checkbox" ${stChecked} data-id="${st.id}" data-parent="${s.id}"><div><div>${st.title}</div></div></div>`;sw.appendChild(sd)});wrap.appendChild(sw)}});list.appendChild(wrap)}
})
list.querySelectorAll(".chevron").forEach(ch=>{ch.addEventListener("click",e=>{const el=e.target;el.classList.toggle("open");const next=el.parentElement.parentElement.parentElement.nextElementSibling;if(next && next.classList.contains("subtasks")){next.style.display=(next.style.display==="none"?"block":"none")}})})
list.querySelectorAll(".chevron-sub").forEach(ch=>{ch.addEventListener("click",e=>{const el=e.target;el.classList.toggle("open");const next=el.parentElement.parentElement.parentElement.nextElementSibling;if(next && next.classList.contains("steps")){next.style.display=(next.style.display==="none"?"block":"none")}})})
list.querySelectorAll("input[type=checkbox]").forEach(chk=>{chk.addEventListener("change",e=>{const id=e.target.dataset.id;const hasSub=e.target.dataset.hassub==="true";const hasSteps=e.target.dataset.hassteps==="true";const parent=e.target.dataset.parent;const checked=e.target.checked;if(hasSub){const task=b.tasks.find(x=>x.id===id);for(const s of task.subtasks){const steps=s.steps||[];if(steps.length>0){for(const st of steps){state.progress[st.id]=checked}state.progress[s.id]=checked}else{state.progress[s.id]=checked}}}else if(hasSteps){const sub=b.tasks.flatMap(x=>x.subtasks||[]).find(x=>x.id===id);const steps=sub.steps||[];for(const st of steps){state.progress[st.id]=checked}state.progress[id]=checked}else if(parent){state.progress[id]=checked;const sub=b.tasks.flatMap(x=>x.subtasks||[]).find(x=>x.id===parent);const steps=sub.steps||[];const allDone=steps.every(st=>state.progress[st.id]===true);state.progress[parent]=allDone}else{state.progress[id]=checked}saveProgress();renderBusiness(b);const sAll=computeStats(state.tasks.businesses);elTotalPoints.textContent=sAll.points;elTotalCompleted.textContent=sAll.completed;elTotalTasks.textContent=sAll.total})})
elContent.appendChild(card)}
const fallbackTasks={"businesses":[]}
function hasSteps(json){try{const bs=json.businesses||[];for(const b of bs){for(const t of (b.tasks||[])){for(const s of (t.subtasks||[])){if(Array.isArray(s.steps)&&s.steps.length>0){return true}}}}}catch(e){}return false}
async function getTasks(){
  try{
    const r=await fetch(`./data/tasks.json?v=${dataVersion}`,{cache:"no-store"});
    if(r.ok){
      const j=await r.json();
      if(hasSteps(j)){return j}
    }
  }catch(e){}
  try{
    const r=await fetch(`https://raw.githubusercontent.com/DilesZ/Proyectos/main/web/data/tasks.json?ts=${dataVersion}`,{cache:"no-store"});
    if(r.ok){
      const j=await r.json();
      return j
    }
  }catch(e){}
  return fallbackTasks
}
async function init(){state.tasks=await getTasks();state.progress=loadProgress();document.getElementById("appVersion").textContent=`v${dataVersion}`;console.log("[Orquestador] app version", dataVersion, {hasSteps: hasSteps(state.tasks)});renderTabs(state.tasks.businesses);const s=computeStats(state.tasks.businesses);elTotalPoints.textContent=s.points;elTotalCompleted.textContent=s.completed;elTotalTasks.textContent=s.total}
init()
