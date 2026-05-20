const state = {
  tasks: {},
  progress: {}
};
const dataVersion = "20260109-fixed2";
const storeKey = "orquestador_progress_v2";
const missionStoreKey = "orquestador_mission_state_v1";
const activeTrackKey = "influencer_agency";
const voiceAgentsSprint = {
  trackKey: "viral_clips_service",
  trackName: "Agencia de Clips Virales (B2B)",
  missionTitle: "Sprint 48h: Clips por Cash",
  missionSummary: "Cerrar un creador de pago enviando muestras de alto valor hechas gratis a partir de su contenido.",
  revenueGoal: "$100 - $300 por Pack Mensual",
  restartPrompt: "Lee businesses/viral_clips/viral_clips_service.md y ayúdame a elegir YouTubers para prospectar.",
  blockers: [
    "No hay YouTubers seleccionados",
    "La edición no es lo bastante pro",
    "No sé cómo contactar al creador",
    "Miedo al rechazo",
    "No tengo link de Drive listo"
  ],
  milestones: [
    "Hito 1: 3 clips editados y listos en Drive",
    "Hito 2: 5 propuestas enviadas con éxito",
    "Hito 3: Primer pago de $200 recibido"
  ],
  days: [
    {
      id: "clips_day1",
      label: "Día 1",
      title: "El Gancho de Valor",
      objective: "Tener 3 clips editados y listos para enviar como regalo.",
      proof: "Enlace a carpeta de Google Drive con los 3 clips.",
      doneText: "Los clips están editados con subtítulos dinámicos y listos.",
      steps: [
        "Identificar 5 YouTubers de 50k-500k subs",
        "Descargar su vídeo más popular de la semana",
        "Extraer y editar 3 momentos virales en CapCut",
        "Subir clips a Google Drive"
      ]
    },
    {
      id: "clips_day2",
      label: "Día 2",
      title: "Asalto Comercial",
      objective: "Contactar a los creadores y cerrar el primer pack de pago.",
      proof: "Link de pago enviado o captura de respuesta positiva.",
      doneText: "He enviado las 5 propuestas y estoy negociando.",
      steps: [
        "Redactar emails/DMs personalizados",
        "Enviar los clips como regalo directo",
        "Hacer seguimiento a las 4 horas",
        "Enviar oferta de pack mensual ($200)"
      ]
    }
  ]
};
const firstRevenueSprint = {
  trackKey: "influencer_agency",
  trackName: "Influencer IA (Fanvue)",
  missionTitle: "Sprint 7 Días: Primera Factura",
  missionSummary: "Convertir a Elena en una máquina de facturación híbrida (Fitness + GFE) para maximizar el gasto por suscriptor.",
  revenueGoal: "1 Suscriptor o 1 Unlock ($10-$15)",
  restartPrompt: "Lee businesses/influencer_agency/persona_elena_fitness.md y ayúdame con el set de fotos del Día 2.",
  blockers: [
    "Identidad visual inconsistente",
    "Falta de tráfico desde IG/TikTok",
    "Mensaje de bienvenida aburrido",
    "No hay oferta PPV activa",
    "Miedo a chatear con fans"
  ],
  milestones: [
    "Hito 1: Perfil de Elena optimizado para GFE",
    "Hito 2: Primeras 30 fotos con consistencia LoRA",
    "Hito 3: Primera venta de $10 realizada"
  ],
  days: [
    {
      id: "day1",
      label: "Día 1",
      title: "Identidad Z",
      objective: "Configurar la personalidad de Elena (GFE + Fitness) para que el fan sienta conexión inmediata.",
      proof: "Ficha de personaje completada en el panel de Nexus IA.",
      doneText: "Identidad lista: Elena ya no es solo una imagen, tiene alma y voz.",
      steps: [
        "Copiar Nombre: 'Elena' y Arquetipo: 'Fitness GFE'",
        "Pegar Bio: 'Tu compañera de gym que te espera en casa con un café y una sonrisa ☕💪 | Exclusivo aquí 👇'",
        "Fijar Tono: 'Cercano, vulnerable, notas de voz dulces (ElevenLabs)'",
        "Establecer Promesa: 'Acceso a mi vida real, entrenos sin filtros y charlas íntimas cada noche'"
      ]
    },
    {
      id: "day2",
      label: "Día 2",
      title: "Activos Maestros",
      objective: "Generar la cara maestra y 30 fotos (15 SFW y 15 Paywall) con consistencia absoluta.",
      proof: "Carpeta local /assets/elena/day2 con 30 imágenes consistentes.",
      doneText: "Elena es visualmente real y consistente en todos los escenarios.",
      steps: [
        "Abrir Flux.1 y generar la 'Cara Maestra' (usar prompt de persona_elena_fitness.md)",
        "Generar 15 fotos SFW (Ropa deportiva, cocina, calle) manteniendo la cara",
        "Generar 15 fotos Paywall (Luz tenue, ropa de casa, post-gym) manteniendo la cara",
        "Verificar que en las 30 fotos parezca la misma persona (ojos, nariz, sonrisa)"
      ]
    },
    {
      id: "day3",
      label: "Día 3",
      title: "Embudo de Ventas",
      objective: "Configurar la infraestructura de captación y el mensaje de bienvenida automático.",
      proof: "IG/TikTok activo y Mensaje de Bienvenida configurado en Fanvue.",
      doneText: "La red de pesca está echada: el tráfico ya tiene a dónde ir y dónde pagar.",
      steps: [
        "Crear cuenta IG/TikTok: @elena_gfe_fit (o similar) con link a Fanvue",
        "En Fanvue, activar 'Welcome Message' con el texto del script GFE",
        "Adjuntar al Welcome Message un 'Unlockable' de $9.99 (Set Post-Gym)",
        "Subir los primeros 3 videos virales (usar Luma/Kling con fotos del Día 2)"
      ]
    },
    {
      id: "day4",
      label: "Día 4",
      title: "Oferta de Bienvenida",
      objective: "Lanzar el primer set de pago (Unlockable) y configurar el gancho de suscripción.",
      proof: "Post bloqueado (PPV) activo en el muro de Fanvue.",
      doneText: "El primer producto digital de Elena está a la venta.",
      steps: [
        "Publicar en el muro: 'Set Post-Gym (10 fotos)' bloqueado por $9.99",
        "Escribir copy: 'Todavía estoy sudada... estas fotos son solo para ti. ¿Vienes?'",
        "Configurar descuento del 50% en suscripción base por tiempo limitado",
        "Verificar que el link de pago funciona correctamente"
      ]
    },
    {
      id: "day5",
      label: "Día 5",
      title: "Inyección de Tráfico",
      objective: "Atraer a los primeros 100 visitantes desde redes sociales usando clips virales.",
      proof: "3 Reels publicados con CTA visible hacia el link de la bio.",
      doneText: "El sistema está recibiendo visitas reales.",
      steps: [
        "Publicar Reel 1: Motivación fitness (Elena entrenando)",
        "Publicar Reel 2: Momento GFE (Elena tomando café/sonriendo)",
        "Publicar Reel 3: Curiosidad (Elena probándose ropa con CTA)",
        "Responder los primeros 10 comentarios para forzar el algoritmo"
      ]
    },
    {
      id: "day6",
      label: "Día 6",
      title: "Optimización GFE",
      objective: "Convertir visitantes en fans leales mediante el chat privado.",
      proof: "Mínimo 3 conversaciones iniciadas en el chat de Fanvue.",
      doneText: "Elena está construyendo el vínculo emocional que genera 'Whales'.",
      steps: [
        "Revisar nuevos seguidores y enviar: 'Hola! ¿Entrenas hoy?'",
        "Enviar nota de voz (ElevenLabs): 'Gracias por seguirme, me haces el día!'",
        "Si preguntan por más fotos, enviar el link al Unlockable del Día 4",
        "Corregir la bio si nadie hace clic en el link"
      ]
    },
    {
      id: "day7",
      label: "Día 7",
      title: "Cierre de Facturación",
      objective: "Lograr el primer pago real de $10-$15 mediante una oferta flash.",
      proof: "Captura de pantalla de la primera venta en el dashboard de Fanvue.",
      doneText: "¡DIAMANTES! El sistema ha generado su primer ingreso real.",
      steps: [
        "Publicar Story en IG: 'Solo 24h: Acceso a mi set privado al 50%'",
        "Enviar mensaje masivo en Fanvue: '¿Te vas a perder lo de anoche?'",
        "Lanzar un 'Flash Unlockable' de $5 para los que no han comprado nada",
        "Registrar la primera venta y celebrar el éxito del sprint"
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

function getSprintProgress(sprint) {
  const currentSprint = sprint || (state.mission.activeTrack === "voice_agents" ? voiceAgentsSprint : firstRevenueSprint);
  const days = currentSprint.days;
  const completedCount = days.filter(day => state.mission.completedDays[day.id]).length;
  // Use a temporary viewingDay if set, otherwise fallback to the first uncompleted day
  const currentDay = state.mission.viewingDayId 
    ? (days.find(day => day.id === state.mission.viewingDayId) || days[0])
    : (days.find(day => !state.mission.completedDays[day.id]) || days[days.length - 1]);
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
  const sprint = business.key === "viral_clips_service" ? voiceAgentsSprint : firstRevenueSprint;
  
  if (business.key !== activeTrackKey && business.key !== "viral_clips_service") {
      return `
        <section class="mission-shell mission-paused">
          <div class="mission-card mission-card-compact">
            <div class="mission-card-header">
              <div>
                <span class="eyebrow">Track Activo</span>
                <h3>${sprint.trackName}</h3>
              </div>
              <span class="badge">En espera</span>
            </div>
            <p class="mission-copy">Este negocio esta fuera del sprint actual. No abras un segundo track hasta llegar a la primera facturacion.</p>
          </div>
        </section>
      `;
  }

  const { completedCount, currentDay, pct } = getSprintProgress(sprint);
  const blockerOptions = sprint.blockers.map(blocker => `
      <option value="${escapeHtml(blocker)}" ${state.mission.blocker === blocker ? "selected" : ""}>${escapeHtml(blocker)}</option>
  `).join("");
  const dayCards = sprint.days.map(day => {
      const isCurrent = currentDay.id === day.id;
      const isDone = !!state.mission.completedDays[day.id];
      return `
      <button class="sprint-day-card ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}" data-day-id="${day.id}" type="button">
        <span class="sprint-day-label">${day.label}</span>
        <strong>${escapeHtml(day.title)}</strong>
        <span>${isDone ? "Completado" : isCurrent ? "Viendo" : "Pendiente"}</span>
      </button>
  `}).join("");
  const dayWorkspace = currentDay.id === "day1" ? renderDay1Workspace() : renderGenericDayWorkspace(currentDay);

  return `
    <section class="mission-shell">
      <div class="mission-card mission-hero">
        <div class="mission-card-header">
          <div>
            <span class="eyebrow">Mision Activa</span>
            <h3>${sprint.missionTitle}</h3>
          </div>
          <span class="badge points">${pct}% sprint</span>
        </div>
        <p class="mission-copy">${sprint.missionSummary}</p>
        <div class="mission-meta-grid">
          <div class="mission-stat">
            <span>Track</span>
            <strong>${sprint.trackName}</strong>
          </div>
          <div class="mission-stat">
            <span>Objetivo</span>
            <strong>${sprint.revenueGoal}</strong>
          </div>
          <div class="mission-stat">
            <span>Progreso</span>
            <strong>${completedCount}/${sprint.days.length} dias</strong>
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
            <button class="btn btn-primary" id="markCurrentDayDone" type="button" data-track="${sprint.trackKey}">${state.mission.completedDays[currentDay.id] ? "Marcar pendiente" : "Marcar dia completado"}</button>
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
            <h3>Ruta del Track</h3>
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
          ${sprint.milestones.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}

function bindMissionPanel(container, business) {
  const sprint = business.key === "voice_agents" ? voiceAgentsSprint : firstRevenueSprint;
  
  const { currentDay } = getSprintProgress(sprint);
  container.querySelector("#markCurrentDayDone")?.addEventListener("click", () => {
      if (currentDay.id === "day1" && !state.mission.completedDays[currentDay.id] && !getDay1ProfileStatus().ready) {
          alert("Completa el perfil base antes de cerrar el Dia 1.");
          return;
      }
      const isDone = !!state.mission.completedDays[currentDay.id];
      state.mission.completedDays[currentDay.id] = !isDone;
      if (!isDone) {
          const nextPending = sprint.days.find(day => !state.mission.completedDays[day.id]);
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
          const day = sprint.days.find(item => item.id === dayId);
          if (!day) return;
          state.mission.viewingDayId = dayId; // Set the day we want to view
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
  
  // Update Power Level based on points
  const elPowerLevel = document.getElementById("powerLevel");
  if (elPowerLevel) {
    const basePower = 9000;
    const currentPower = basePower + (stats.points * 10);
    const formattedPower = new Intl.NumberFormat().format(currentPower);
    
    if (elPowerLevel.textContent !== formattedPower) {
        elPowerLevel.textContent = formattedPower;
        elPowerLevel.style.animation = "power-up 0.5s ease-out";
        setTimeout(() => elPowerLevel.style.animation = "", 500);
    }
  }
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
