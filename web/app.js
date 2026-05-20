const state = {
  tasks: {},
  progress: {}
};
const dataVersion = "20260109-fixed2";
const storeKey = "orquestador_progress_v2";
const missionStoreKey = "orquestador_mission_state_v1";
const activeTrackKey = "influencer_agency";
const firstRevenueSprint = {
  trackKey: activeTrackKey,
  trackName: "Influencer IA (Fanvue)",
  missionTitle: "Primer Sprint de Facturacion",
  missionSummary: "Lanzar una primera version operativa del negocio y provocar el primer evento de monetizacion.",
  revenueGoal: "1 suscriptor de pago o 1 unlock de pago",
  restartPrompt: "Lee system.md, memory.md, agets.md, skills.md, checkpoints/current.md y checkpoints/first_revenue_sprint.md. Luego ayudame a continuar desde la mision activa y el siguiente paso pendiente.",
  blockers: [
    "No hay claridad sobre la oferta",
    "No hay CTA visible",
    "No hay suficientes activos para publicar",
    "El perfil no transmite valor",
    "Hay trafico pero no clics",
    "Hay clics pero no pagos"
  ],
  milestones: [
    "Hito 1: primera facturacion",
    "Hito 2: 100 EUR",
    "Hito 3: sistema repetible durante 2 semanas"
  ],
  days: [
    {
      id: "day1",
      label: "Dia 1",
      title: "Definir Producto",
      objective: "Dejar cerrada la identidad y la propuesta base.",
      proof: "Documento con nombre, arquetipo, bio y promesa.",
      doneText: "Ya no hay dudas sobre quien es el personaje ni que vende.",
      steps: [
        "Elegir un solo arquetipo",
        "Definir nombre, bio, tono y promesa",
        "Escribir la propuesta de valor publica",
        "Definir el tipo de contenido de arranque"
      ]
    },
    {
      id: "day2",
      label: "Dia 2",
      title: "Crear Activos Base",
      objective: "Tener el pack minimo para abrir perfiles.",
      proof: "Carpeta con imagenes finales y prompts guardados.",
      doneText: "Existen suficientes activos para publicar sin improvisar.",
      steps: [
        "Generar cara maestra",
        "Crear 9-12 imagenes iniciales consistentes",
        "Seleccionar foto de perfil",
        "Guardar los mejores prompts usados"
      ]
    },
    {
      id: "day3",
      label: "Dia 3",
      title: "Abrir Canales",
      objective: "Dejar operativo el embudo minimo.",
      proof: "Capturas de perfiles configurados.",
      doneText: "Un usuario ya puede descubrir el perfil y llegar al punto de pago.",
      steps: [
        "Crear o preparar perfil principal de trafico",
        "Crear o preparar Fanvue",
        "Cargar bio, imagenes y texto base",
        "Configurar link principal y mensaje de bienvenida"
      ]
    },
    {
      id: "day4",
      label: "Dia 4",
      title: "Oferta y Conversion",
      objective: "Dejar clara la primera oferta de cobro.",
      proof: "Documento con pricing, oferta, CTA y textos.",
      doneText: "Existe un mecanismo claro para pasar de visita a pago.",
      steps: [
        "Fijar precio de entrada",
        "Definir oferta de bienvenida",
        "Definir primer contenido de pago o unlock",
        "Escribir 3 mensajes base de conversion"
      ]
    },
    {
      id: "day5",
      label: "Dia 5",
      title: "Publicacion Inicial",
      objective: "Lanzar el primer bloque de trafico.",
      proof: "Enlaces o capturas de publicaciones.",
      doneText: "El embudo ya esta expuesto al mercado.",
      steps: [
        "Publicar 3-5 piezas iniciales",
        "Publicar al menos 1 pieza con CTA directo",
        "Registrar formato, hora y copy",
        "Medir primeras señales"
      ]
    },
    {
      id: "day6",
      label: "Dia 6",
      title: "Ajuste Rapido",
      objective: "Corregir friccion antes de escalar.",
      proof: "Lista corta de cambios aplicados.",
      doneText: "El sistema es mas claro y mas facil de convertir.",
      steps: [
        "Revisar que perfil, CTA y oferta sean coherentes",
        "Mejorar el copy que peor convierte",
        "Detectar si falta mas prueba social o mas contenido",
        "Preparar una segunda tanda de publicaciones"
      ]
    },
    {
      id: "day7",
      label: "Dia 7",
      title: "Push a Primera Facturacion",
      objective: "Provocar el primer pago.",
      proof: "Evidencia de primer pago o diagnostico del bloqueo principal.",
      doneText: "Hay ingreso o hay un bloqueo muy concreto identificado.",
      steps: [
        "Publicar contenido con CTA directo",
        "Responder rapido a interacciones",
        "Empujar mensaje de bienvenida o unlock",
        "Registrar resultados",
        "Si no hay pago, diagnosticar el cuello de botella principal"
      ]
    }
  ]
};
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
state.mission = loadMissionState();
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

function loadMissionState() {
  const defaultState = {
      completedDays: {},
      nextAction: firstRevenueSprint.days[0].steps[0],
      blocker: "",
      sessionNote: "",
      day1Profile: {
          archetype: "",
          name: "",
          bio: "",
          tone: "",
          promise: "",
          contentAngle: ""
      },
      day2Assets: {
          masterFaceUrl: "",
          imageCount: 0,
          promptsSaved: false,
          folderPath: ""
      },
      day3Channels: {
          trafficProfile: "",
          fanvueProfile: "",
          linksConfigured: false,
          welcomeMessageSet: false
      },
      day4Offer: {
          price: "",
          welcomeOffer: "",
          firstUnlock: "",
          conversionMessages: ""
      },
      day5Launch: {
          postsPublished: 0,
          ctaIncluded: false,
          firstSignals: ""
      },
      day6Adjust: {
          consistencyCheck: false,
          copyImproved: false,
          bottleneckIdentified: ""
      },
      day7Push: {
          paymentReceived: false,
          revenueAmount: "",
          finalDiagnosis: ""
      }
  };
  try {
      const raw = localStorage.getItem(missionStoreKey);
      return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch (e) {
      console.warn("Mission state load error", e);
      return defaultState;
  }
}

function saveMissionState() {
  localStorage.setItem(missionStoreKey, JSON.stringify(state.mission));
}

function getSprintProgress() {
  const days = firstRevenueSprint.days;
  const completedCount = days.filter(day => state.mission.completedDays[day.id]).length;
  const currentDay = days.find(day => !state.mission.completedDays[day.id]) || days[days.length - 1];
  const pct = Math.round((completedCount / days.length) * 100);
  return { completedCount, currentDay, pct };
}

function getDay1ProfileStatus() {
  const profile = state.mission.day1Profile || {};
  const checks = {
      archetype: !!profile.archetype?.trim(),
      name: (profile.name || "").trim().length >= 2,
      bio: (profile.bio || "").trim().length >= 20,
      tone: (profile.tone || "").trim().length >= 8,
      promise: (profile.promise || "").trim().length >= 15,
      contentAngle: (profile.contentAngle || "").trim().length >= 10
  };
  const completed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  return {
      checks,
      completed,
      total,
      pct: Math.round((completed / total) * 100),
      ready: completed === total
  };
}

function getDay1Summary() {
  const profile = state.mission.day1Profile || {};
  return [
      `Arquetipo: ${profile.archetype || "-"}`,
      `Nombre: ${profile.name || "-"}`,
      `Bio: ${profile.bio || "-"}`,
      `Tono: ${profile.tone || "-"}`,
      `Promesa: ${profile.promise || "-"}`,
      `Contenido de arranque: ${profile.contentAngle || "-"}`
  ].join("\n");
}

function renderDay1Workspace() {
  const profile = state.mission.day1Profile || {};
  const status = getDay1ProfileStatus();
  const archetypes = [
      "Gamer",
      "Fitness",
      "Girl Next Door",
      "Alt / Cosplay"
  ];

  return `
    <div class="mission-card mission-day-workspace">
      <div class="mission-card-header">
        <div>
          <span class="eyebrow">Dia 1 Ejecutable</span>
          <h3>Cierra el perfil base</h3>
        </div>
        <span class="badge points">${status.pct}% listo</span>
      </div>
      <p class="mission-copy">Completa esta ficha para salir de la sesion con un personaje definido y usable en los siguientes dias del sprint.</p>
      <div class="popup-progress-track mission-inline-progress">
        <div class="popup-progress-bar" style="width:${status.pct}%"></div>
      </div>
      <div class="mission-form-grid">
        <div>
          <label class="mission-label" for="day1Archetype">Arquetipo</label>
          <select id="day1Archetype" class="popup-input">
            <option value="">Selecciona un arquetipo</option>
            ${archetypes.map(item => `<option value="${escapeHtml(item)}" ${profile.archetype === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="mission-label" for="day1Name">Nombre</label>
          <input id="day1Name" class="popup-input" type="text" maxlength="60" value="${escapeHtml(profile.name || "")}" placeholder="Ejemplo: Elena">
        </div>
      </div>
      <label class="mission-label" for="day1Bio">Bio base</label>
      <textarea id="day1Bio" class="popup-textarea" rows="3" placeholder="Describe quien es, que transmite y por que alguien querria seguirla">${escapeHtml(profile.bio || "")}</textarea>
      <div class="mission-form-grid">
        <div>
          <label class="mission-label" for="day1Tone">Tono</label>
          <input id="day1Tone" class="popup-input" type="text" maxlength="100" value="${escapeHtml(profile.tone || "")}" placeholder="Ejemplo: cercana, juguetona y natural">
        </div>
        <div>
          <label class="mission-label" for="day1Promise">Promesa</label>
          <input id="day1Promise" class="popup-input" type="text" maxlength="140" value="${escapeHtml(profile.promise || "")}" placeholder="Que va a recibir el usuario si la sigue o paga">
        </div>
      </div>
      <label class="mission-label" for="day1ContentAngle">Contenido de arranque</label>
      <textarea id="day1ContentAngle" class="popup-textarea" rows="3" placeholder="Que tipo de fotos, escenas o publicaciones vas a usar para empezar">${escapeHtml(profile.contentAngle || "")}</textarea>

      <div class="mission-checklist-box">
        <h4>Checklist de cierre</h4>
        <div class="mission-mini-list">
          <span class="${status.checks.archetype ? "ok" : ""}">Arquetipo definido</span>
          <span class="${status.checks.name ? "ok" : ""}">Nombre definido</span>
          <span class="${status.checks.bio ? "ok" : ""}">Bio utilizable</span>
          <span class="${status.checks.tone ? "ok" : ""}">Tono claro</span>
          <span class="${status.checks.promise ? "ok" : ""}">Promesa clara</span>
          <span class="${status.checks.contentAngle ? "ok" : ""}">Contenido de arranque definido</span>
        </div>
      </div>

      <div class="mission-section">
        <h4>Resumen listo para copiar</h4>
        <pre class="mission-summary">${escapeHtml(getDay1Summary())}</pre>
      </div>

      <div class="mission-actions">
        <button class="btn btn-secondary" id="saveDay1Profile" type="button">Guardar perfil base</button>
        <button class="btn btn-secondary" id="copyDay1Summary" type="button">Copiar resumen</button>
        <button class="btn btn-primary" id="completeDay1FromForm" type="button" ${status.ready ? "" : "disabled"}>Cerrar Dia 1</button>
      </div>
    </div>
  `;
}

function renderGenericDayWorkspace(day) {
  const dayId = day.id;
  const stateData = state.mission[dayId + "Data"] || {}; // We'll use a generic key for state
  
  // Specific renderers based on day
  switch(dayId) {
    case "day2": return renderDay2Workspace();
    case "day3": return renderDay3Workspace();
    case "day4": return renderDay4Workspace();
    case "day5": return renderDay5Workspace();
    case "day6": return renderDay6Workspace();
    case "day7": return renderDay7Workspace();
    default: return "";
  }
}

function renderDay2Workspace() {
  const data = state.mission.day2Assets || {};
  return `
    <div class="mission-card mission-day-workspace">
      <div class="mission-card-header">
        <div>
          <span class="eyebrow">Dia 2 Ejecutable</span>
          <h3>Crear Activos Base</h3>
        </div>
      </div>
      <p class="mission-copy">Genera la cara maestra y el set inicial de imágenes consistentes.</p>
      <div class="mission-form-grid">
        <div>
          <label class="mission-label">URL/Nombre Cara Maestra</label>
          <input id="day2MasterFace" class="popup-input" type="text" value="${escapeHtml(data.masterFaceUrl)}" placeholder="Ej: elena_face_v1.png">
        </div>
        <div>
          <label class="mission-label">Nº Imágenes Generadas</label>
          <input id="day2ImageCount" class="popup-input" type="number" value="${data.imageCount || 0}">
        </div>
      </div>
      <div class="mission-checklist-box">
        <div class="check-row">
          <input type="checkbox" id="day2PromptsSaved" ${data.promptsSaved ? "checked" : ""}>
          <label for="day2PromptsSaved">Prompts guardados en el repositorio</label>
        </div>
      </div>
      <label class="mission-label">Ruta de la carpeta de activos</label>
      <input id="day2FolderPath" class="popup-input" type="text" value="${escapeHtml(data.folderPath)}" placeholder="Ej: /assets/elena/day2">
      <div class="mission-actions">
        <button class="btn btn-primary" id="saveDay2Data">Guardar Avance Día 2</button>
      </div>
    </div>
  `;
}

function renderDay3Workspace() {
  const data = state.mission.day3Channels || {};
  return `
    <div class="mission-card mission-day-workspace">
      <div class="mission-card-header">
        <div>
          <span class="eyebrow">Dia 3 Ejecutable</span>
          <h3>Abrir Canales</h3>
        </div>
      </div>
      <div class="mission-form-grid">
        <div>
          <label class="mission-label">User Red Principal (IG/X)</label>
          <input id="day3TrafficProfile" class="popup-input" type="text" value="${escapeHtml(data.trafficProfile)}" placeholder="@elena_fitness">
        </div>
        <div>
          <label class="mission-label">URL Fanvue</label>
          <input id="day3FanvueProfile" class="popup-input" type="text" value="${escapeHtml(data.fanvueProfile)}" placeholder="fanvue.com/elena">
        </div>
      </div>
      <div class="mission-checklist-box">
        <div class="check-row">
          <input type="checkbox" id="day3LinksConfigured" ${data.linksConfigured ? "checked" : ""}>
          <label for="day3LinksConfigured">Links configurados y funcionando</label>
        </div>
        <div class="check-row">
          <input type="checkbox" id="day3WelcomeMessageSet" ${data.welcomeMessageSet ? "checked" : ""}>
          <label for="day3WelcomeMessageSet">Mensaje de bienvenida automático listo</label>
        </div>
      </div>
      <div class="mission-actions">
        <button class="btn btn-primary" id="saveDay3Data">Guardar Canales</button>
      </div>
    </div>
  `;
}

function renderDay4Workspace() {
  const data = state.mission.day4Offer || {};
  return `
    <div class="mission-card mission-day-workspace">
      <div class="mission-card-header">
        <div>
          <span class="eyebrow">Dia 4 Ejecutable</span>
          <h3>Oferta y Conversión</h3>
        </div>
      </div>
      <div class="mission-form-grid">
        <div>
          <label class="mission-label">Precio Suscripción ($)</label>
          <input id="day4Price" class="popup-input" type="text" value="${escapeHtml(data.price)}" placeholder="Ej: 9.99">
        </div>
        <div>
          <label class="mission-label">Oferta de Bienvenida</label>
          <input id="day4WelcomeOffer" class="popup-input" type="text" value="${escapeHtml(data.welcomeOffer)}" placeholder="Ej: 50% off primer mes">
        </div>
      </div>
      <label class="mission-label">Primer Contenido de Pago (Unlock)</label>
      <textarea id="day4FirstUnlock" class="popup-textarea" rows="2" placeholder="Describe el primer set que vas a vender">${escapeHtml(data.firstUnlock)}</textarea>
      <label class="mission-label">Mensajes de Conversión Base</label>
      <textarea id="day4ConversionMessages" class="popup-textarea" rows="3" placeholder="Escribe aquí los textos para cerrar ventas por DM">${escapeHtml(data.conversionMessages)}</textarea>
      <div class="mission-actions">
        <button class="btn btn-primary" id="saveDay4Data">Guardar Oferta</button>
      </div>
    </div>
  `;
}

function renderDay5Workspace() {
  const data = state.mission.day5Launch || {};
  return `
    <div class="mission-card mission-day-workspace">
      <div class="mission-card-header">
        <div>
          <span class="eyebrow">Dia 5 Ejecutable</span>
          <h3>Publicación Inicial</h3>
        </div>
      </div>
      <div class="mission-form-grid">
        <div>
          <label class="mission-label">Nº Posts Publicados</label>
          <input id="day5PostsPublished" class="popup-input" type="number" value="${data.postsPublished || 0}">
        </div>
        <div style="display:flex; align-items:center; padding-top:2rem;">
          <input type="checkbox" id="day5CtaIncluded" ${data.ctaIncluded ? "checked" : ""}>
          <label for="day5CtaIncluded" style="margin-left:0.5rem;">¿Incluye CTA directo?</label>
        </div>
      </div>
      <label class="mission-label">Primeras señales (likes, clics, subs)</label>
      <textarea id="day5FirstSignals" class="popup-textarea" rows="3" placeholder="Anota aquí qué está pasando en las primeras horas">${escapeHtml(data.firstSignals)}</textarea>
      <div class="mission-actions">
        <button class="btn btn-primary" id="saveDay5Data">Guardar Lanzamiento</button>
      </div>
    </div>
  `;
}

function renderDay6Workspace() {
  const data = state.mission.day6Adjust || {};
  return `
    <div class="mission-card mission-day-workspace">
      <div class="mission-card-header">
        <div>
          <span class="eyebrow">Dia 6 Ejecutable</span>
          <h3>Ajuste Rápido</h3>
        </div>
      </div>
      <div class="mission-checklist-box">
        <div class="check-row">
          <input type="checkbox" id="day6ConsistencyCheck" ${data.consistencyCheck ? "checked" : ""}>
          <label for="day6ConsistencyCheck">Revisada coherencia Perfil-CTA-Oferta</label>
        </div>
        <div class="check-row">
          <input type="checkbox" id="day6CopyImproved" ${data.copyImproved ? "checked" : ""}>
          <label for="day6CopyImproved">Copy de peor rendimiento mejorado</label>
        </div>
      </div>
      <label class="mission-label">Cuello de botella identificado</label>
      <textarea id="day6BottleneckIdentified" class="popup-textarea" rows="3" placeholder="¿Dónde se está quedando la gente?">${escapeHtml(data.bottleneckIdentified)}</textarea>
      <div class="mission-actions">
        <button class="btn btn-primary" id="saveDay6Data">Guardar Ajustes</button>
      </div>
    </div>
  `;
}

function renderDay7Workspace() {
  const data = state.mission.day7Push || {};
  return `
    <div class="mission-card mission-day-workspace">
      <div class="mission-card-header">
        <div>
          <span class="eyebrow">Dia 7 Ejecutable</span>
          <h3>Push a Primera Facturación</h3>
        </div>
      </div>
      <div class="mission-form-grid">
        <div style="display:flex; align-items:center;">
          <input type="checkbox" id="day7PaymentReceived" ${data.paymentReceived ? "checked" : ""}>
          <label for="day7PaymentReceived" style="margin-left:0.5rem; font-weight:bold; color:var(--success);">¿PRIMER PAGO RECIBIDO?</label>
        </div>
        <div>
          <label class="mission-label">Monto facturado ($)</label>
          <input id="day7RevenueAmount" class="popup-input" type="text" value="${escapeHtml(data.revenueAmount)}" placeholder="Ej: 14.99">
        </div>
      </div>
      <label class="mission-label">Diagnóstico final / Lecciones aprendidas</label>
      <textarea id="day7FinalDiagnosis" class="popup-textarea" rows="4" placeholder="Si hubo éxito, ¿qué funcionó? Si no, ¿cuál es el plan para mañana?">${escapeHtml(data.finalDiagnosis)}</textarea>
      <div class="mission-actions">
        <button class="btn btn-primary" id="saveDay7Data">Guardar Cierre de Sprint</button>
      </div>
    </div>
  `;
}

function renderMissionPanel(business) {
  if (business.key !== activeTrackKey) {
      return `
        <section class="mission-shell mission-paused">
          <div class="mission-card mission-card-compact">
            <div class="mission-card-header">
              <div>
                <span class="eyebrow">Track Activo</span>
                <h3>${firstRevenueSprint.trackName}</h3>
              </div>
              <span class="badge">En espera</span>
            </div>
            <p class="mission-copy">Este negocio esta fuera del sprint actual. No abras un segundo track hasta llegar a la primera facturacion.</p>
          </div>
        </section>
      `;
  }

  const { completedCount, currentDay, pct } = getSprintProgress();
  const blockerOptions = firstRevenueSprint.blockers.map(blocker => `
      <option value="${escapeHtml(blocker)}" ${state.mission.blocker === blocker ? "selected" : ""}>${escapeHtml(blocker)}</option>
  `).join("");
  const dayCards = firstRevenueSprint.days.map(day => `
      <button class="sprint-day-card ${state.mission.completedDays[day.id] ? "done" : ""} ${currentDay.id === day.id ? "current" : ""}" data-day-id="${day.id}" type="button">
        <span class="sprint-day-label">${day.label}</span>
        <strong>${escapeHtml(day.title)}</strong>
        <span>${state.mission.completedDays[day.id] ? "Completado" : currentDay.id === day.id ? "Actual" : "Pendiente"}</span>
      </button>
  `).join("");
  const dayWorkspace = currentDay.id === "day1" ? renderDay1Workspace() : renderGenericDayWorkspace(currentDay);

  return `
    <section class="mission-shell">
      <div class="mission-card mission-hero">
        <div class="mission-card-header">
          <div>
            <span class="eyebrow">Mision Activa</span>
            <h3>${firstRevenueSprint.missionTitle}</h3>
          </div>
          <span class="badge points">${pct}% sprint</span>
        </div>
        <p class="mission-copy">${firstRevenueSprint.missionSummary}</p>
        <div class="mission-meta-grid">
          <div class="mission-stat">
            <span>Track</span>
            <strong>${firstRevenueSprint.trackName}</strong>
          </div>
          <div class="mission-stat">
            <span>Objetivo</span>
            <strong>${firstRevenueSprint.revenueGoal}</strong>
          </div>
          <div class="mission-stat">
            <span>Progreso</span>
            <strong>${completedCount}/${firstRevenueSprint.days.length} dias</strong>
          </div>
        </div>
        <div class="progress-container mission-progress">
          <div class="progress-bar" style="width: ${pct}%"></div>
        </div>
      </div>

      <div class="mission-grid">
        <div class="mission-card">
          <div class="mission-card-header">
            <div>
              <span class="eyebrow">Ahora</span>
              <h3>${currentDay.label}: ${escapeHtml(currentDay.title)}</h3>
            </div>
            <button class="btn btn-secondary" id="copyRestartPrompt" type="button">Copiar reinicio</button>
          </div>
          <p class="mission-copy"><strong>Objetivo:</strong> ${escapeHtml(currentDay.objective)}</p>
          <div class="mission-section">
            <h4>Pasos de hoy</h4>
            <ol class="mission-list">
              ${currentDay.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}
            </ol>
          </div>
          <div class="mission-section">
            <h4>Prueba requerida</h4>
            <p>${escapeHtml(currentDay.proof)}</p>
          </div>
          <div class="mission-section">
            <h4>Condicion de completado</h4>
            <p>${escapeHtml(currentDay.doneText)}</p>
          </div>
          <div class="mission-actions">
            <button class="btn btn-primary" id="markCurrentDayDone" type="button">${state.mission.completedDays[currentDay.id] ? "Marcar pendiente" : "Marcar dia completado"}</button>
          </div>
        </div>

        <div class="mission-card">
          <div class="mission-card-header">
            <div>
              <span class="eyebrow">Checkpoint Rapido</span>
              <h3>Guardar continuidad</h3>
            </div>
            <span class="badge">${escapeHtml(currentDay.label)}</span>
          </div>
          <label class="mission-label" for="missionNextAction">Siguiente accion concreta</label>
          <input id="missionNextAction" class="popup-input" type="text" maxlength="160" value="${escapeHtml(state.mission.nextAction || "")}" placeholder="Ejemplo: Elegir arquetipo fitness y cerrar bio hoy">
          <label class="mission-label" for="missionBlocker">Bloqueo principal</label>
          <select id="missionBlocker" class="popup-input">
            <option value="">Sin bloqueo activo</option>
            ${blockerOptions}
          </select>
          <label class="mission-label" for="missionSessionNote">Nota de sesion</label>
          <textarea id="missionSessionNote" class="popup-textarea" rows="5" placeholder="Que avanzaste, que falta, que probaras despues">${escapeHtml(state.mission.sessionNote || "")}</textarea>
          <div class="mission-actions">
            <button class="btn btn-secondary" id="saveMissionCheckpoint" type="button">Guardar checkpoint</button>
          </div>
        </div>
      </div>

      ${dayWorkspace}

      <div class="mission-card">
        <div class="mission-card-header">
          <div>
            <span class="eyebrow">Sprint</span>
            <h3>Ruta de 7 dias</h3>
          </div>
          <span class="badge">${completedCount} completados</span>
        </div>
        <div class="sprint-days-grid">
          ${dayCards}
        </div>
      </div>

      <div class="mission-card mission-card-compact">
        <div class="mission-card-header">
          <div>
            <span class="eyebrow">Hitos</span>
            <h3>Secuencia de crecimiento</h3>
          </div>
        </div>
        <ul class="mission-list">
          ${firstRevenueSprint.milestones.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}

function bindMissionPanel(container, business) {
  if (business.key !== activeTrackKey) return;

  const { currentDay } = getSprintProgress();
  container.querySelector("#markCurrentDayDone")?.addEventListener("click", () => {
      if (currentDay.id === "day1" && !state.mission.completedDays[currentDay.id] && !getDay1ProfileStatus().ready) {
          alert("Completa el perfil base antes de cerrar el Dia 1.");
          return;
      }
      const isDone = !!state.mission.completedDays[currentDay.id];
      state.mission.completedDays[currentDay.id] = !isDone;
      if (!isDone) {
          const nextPending = firstRevenueSprint.days.find(day => !state.mission.completedDays[day.id]);
          state.mission.nextAction = nextPending ? nextPending.steps[0] : "Revisar el cuello de botella y empujar el siguiente hito.";
      }
      saveMissionState();
      renderBusiness(business);
  });

  container.querySelector("#saveMissionCheckpoint")?.addEventListener("click", () => {
      state.mission.nextAction = container.querySelector("#missionNextAction")?.value.trim() || "";
      state.mission.blocker = container.querySelector("#missionBlocker")?.value || "";
      state.mission.sessionNote = container.querySelector("#missionSessionNote")?.value.trim() || "";
      saveMissionState();
      renderBusiness(business);
  });

  const saveDay1Profile = () => {
      if (currentDay.id !== "day1") return;
      state.mission.day1Profile = {
          archetype: container.querySelector("#day1Archetype")?.value || "",
          name: container.querySelector("#day1Name")?.value.trim() || "",
          bio: container.querySelector("#day1Bio")?.value.trim() || "",
          tone: container.querySelector("#day1Tone")?.value.trim() || "",
          promise: container.querySelector("#day1Promise")?.value.trim() || "",
          contentAngle: container.querySelector("#day1ContentAngle")?.value.trim() || ""
      };
      if (!state.mission.nextAction || state.mission.nextAction === firstRevenueSprint.days[0].steps[0]) {
          state.mission.nextAction = state.mission.day1Profile.promise
              ? "Revisar el resumen del personaje y preparar la prueba requerida del Dia 1."
              : "Completar la ficha del personaje base del Dia 1.";
      }
      saveMissionState();
  };

  container.querySelector("#saveDay1Profile")?.addEventListener("click", () => {
      saveDay1Profile();
      renderBusiness(business);
  });

  container.querySelector("#copyDay1Summary")?.addEventListener("click", async () => {
      saveDay1Profile();
      try {
          await navigator.clipboard.writeText(getDay1Summary());
      } catch (e) {}
      renderBusiness(business);
  });

  container.querySelector("#completeDay1FromForm")?.addEventListener("click", () => {
      saveDay1Profile();
      const status = getDay1ProfileStatus();
      if (!status.ready) {
          alert("Todavia faltan campos clave para cerrar el Dia 1.");
          return;
      }
      state.mission.completedDays.day1 = true;
      const nextPending = firstRevenueSprint.days.find(day => !state.mission.completedDays[day.id]);
      state.mission.nextAction = nextPending ? nextPending.steps[0] : "Revisar el cuello de botella y empujar el siguiente hito.";
      saveMissionState();
      renderBusiness(business);
  });

  // Day 2 bindings
  container.querySelector("#saveDay2Data")?.addEventListener("click", () => {
      state.mission.day2Assets = {
          masterFaceUrl: container.querySelector("#day2MasterFace")?.value.trim() || "",
          imageCount: parseInt(container.querySelector("#day2ImageCount")?.value) || 0,
          promptsSaved: container.querySelector("#day2PromptsSaved")?.checked || false,
          folderPath: container.querySelector("#day2FolderPath")?.value.trim() || ""
      };
      saveMissionState();
      renderBusiness(business);
  });

  // Day 3 bindings
  container.querySelector("#saveDay3Data")?.addEventListener("click", () => {
      state.mission.day3Channels = {
          trafficProfile: container.querySelector("#day3TrafficProfile")?.value.trim() || "",
          fanvueProfile: container.querySelector("#day3FanvueProfile")?.value.trim() || "",
          linksConfigured: container.querySelector("#day3LinksConfigured")?.checked || false,
          welcomeMessageSet: container.querySelector("#day3WelcomeMessageSet")?.checked || false
      };
      saveMissionState();
      renderBusiness(business);
  });

  // Day 4 bindings
  container.querySelector("#saveDay4Data")?.addEventListener("click", () => {
      state.mission.day4Offer = {
          price: container.querySelector("#day4Price")?.value.trim() || "",
          welcomeOffer: container.querySelector("#day4WelcomeOffer")?.value.trim() || "",
          firstUnlock: container.querySelector("#day4FirstUnlock")?.value.trim() || "",
          conversionMessages: container.querySelector("#day4ConversionMessages")?.value.trim() || ""
      };
      saveMissionState();
      renderBusiness(business);
  });

  // Day 5 bindings
  container.querySelector("#saveDay5Data")?.addEventListener("click", () => {
      state.mission.day5Launch = {
          postsPublished: parseInt(container.querySelector("#day5PostsPublished")?.value) || 0,
          ctaIncluded: container.querySelector("#day5CtaIncluded")?.checked || false,
          firstSignals: container.querySelector("#day5FirstSignals")?.value.trim() || ""
      };
      saveMissionState();
      renderBusiness(business);
  });

  // Day 6 bindings
  container.querySelector("#saveDay6Data")?.addEventListener("click", () => {
      state.mission.day6Adjust = {
          consistencyCheck: container.querySelector("#day6ConsistencyCheck")?.checked || false,
          copyImproved: container.querySelector("#day6CopyImproved")?.checked || false,
          bottleneckIdentified: container.querySelector("#day6BottleneckIdentified")?.value.trim() || ""
      };
      saveMissionState();
      renderBusiness(business);
  });

  // Day 7 bindings
  container.querySelector("#saveDay7Data")?.addEventListener("click", () => {
      state.mission.day7Push = {
          paymentReceived: container.querySelector("#day7PaymentReceived")?.checked || false,
          revenueAmount: container.querySelector("#day7RevenueAmount")?.value.trim() || "",
          finalDiagnosis: container.querySelector("#day7FinalDiagnosis")?.value.trim() || ""
      };
      saveMissionState();
      renderBusiness(business);
  });

  container.querySelector("#copyRestartPrompt")?.addEventListener("click", async () => {
      try {
          await navigator.clipboard.writeText(firstRevenueSprint.restartPrompt);
      } catch (e) {}
  });

  container.querySelectorAll(".sprint-day-card").forEach(node => {
      node.addEventListener("click", () => {
          const dayId = node.dataset.dayId;
          const day = firstRevenueSprint.days.find(item => item.id === dayId);
          if (!day) return;
          state.mission.nextAction = day.steps[0];
          saveMissionState();
          renderBusiness(business);
      });
  });
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
      ${renderMissionPanel(b)}
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
  bindMissionPanel(container, b);
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
