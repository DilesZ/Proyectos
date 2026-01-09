$jsonPath = "c:\Users\d.ramos\Proyectos\Proyectos\web\data\tasks.json"
$jsonContent = Get-Content -Path $jsonPath -Raw -Encoding UTF8
$content = $jsonContent | ConvertFrom-Json

# Helpers
function Fix-Text {
    param([string]$text)
    if (-not $text) { return $text }
    $map = @{
        "ðŸ’¡" = "💡"
        "TÃ³mate" = "Tómate"
        "documentaciÃ³n" = "documentación"
        "GuÃ­a" = "Guía"
        "Ã¡" = "á"; "Ã©" = "é"; "Ã­" = "í"; "Ã³" = "ó"; "Ãº" = "ú"; "Ã±" = "ñ"
    }
    foreach ($k in $map.Keys) {
        $text = $text -replace [Regex]::Escape($k), $map[$k]
    }
    return $text
}

function Generate-Prompt {
    param([string]$title, [string]$businessKey)
    if (-not $title) { return "Describe claramente el objetivo y genera el resultado esperado." }
    $clean = ($title -replace '^\s*\d+\s*', '').Trim()
    $t = $clean.ToLower()
    switch ($businessKey) {
        "influencer_agency" {
            if ($t -match "lluvia|nicho|arquetipo|personalidad") { return "Usa el personaje fijo Elena (24, española, fitness girl-next-door). Devuelve: 1) handle recomendado (1 solo), 2) bio lista para copiar, 3) 10 hooks IG, 4) 10 CTAs, 5) checklist anti-baneo IG/TikTok." }
            if ($t -match "nombre de usuario|handle") { return "Genera 10 handles basados en 'elena' y 'fitdiary'. Reglas: sin caracteres raros, 12-15 caracteres, devuélvelos numerados 1-10." }
            if ($t -match "disponibilidad") { return "Dame un procedimiento exacto (sin opciones) para validar disponibilidad del handle en IG/TikTok/X con Namechk y qué hacer si está ocupado." }
            if ($t -match "bio|biograf") { return "Escribe una bio EXACTA para Elena: 2 líneas + CTA al link. Sin alternativas. Incluye 2 emojis máximo." }
            if ($t -match "prompt") { return "Escribe un prompt semántico para Nano Banana Pro (Higgsfield) para Elena (24, española, fitness girl-next-door). Devuelve también parámetros recomendados: Negative prompt mínimo, CFG scale 3.0-5.0, steps 25-30." }
            if ($t -match "caption|copy|cta") { return "Escribe 10 CTAs para story IG que empujen al link. Reglas: curiosidad + urgencia, 90 caracteres máximo, 0 lenguaje explícito." }
            if ($t -match "calendario|contenido") { return "Crea un calendario semanal fijo para Elena: 7 posts IG, 7 stories IG, 3 tweets al día, 3 mensajes Fanvue. Devuelve en tabla día/acción." }
            if ($t -match "bienvenida|welcome") { return "Escribe el script exacto de bienvenida para Fanvue (mensaje automático) que incluya un upsell de foto." }
            if ($t -match "ppv|paywall") {
                return @"
### 🔧 Instrucciones (modo receta)
1. **Estrategia:** El dinero real está en los mensajes privados (PPV).
2. Copia estos 3 guiones probados y guárdalos en tus notas:

   **GUIÓN 1: El "Descuido" (Precio: $15)**
   - *Mensaje:* "Ups, iba a subir esto a mi historia pero es demasiado... ¿quieres verla tú?"
   - *Contenido:* Foto en espejo, se ve un poco de lencería.
   
   **GUIÓN 2: La Pregunta (Precio: $25)**
   - *Mensaje:* "Me he comprado este conjunto rojo y este negro... ¿cuál me queda mejor? Te paso fotos de los dos."
   - *Contenido:* 2 fotos (una con cada conjunto).
   
   **GUIÓN 3: El Vídeo (Precio: $45)**
   - *Mensaje:* "Me aburría sola en casa y he grabado un vídeo cortito... 🙈 Solo para ti."
   - *Contenido:* Vídeo de 5 segundos tirando un beso o bailando (SFW pero sexy).

3. Configura el Guión 1 como tu primer mensaje masivo del día.
4. **Resultado final:** Los 3 guiones guardados y listos para enviar.
"@
            }
            if ($t -match "video|reels|tiktok") {
                return @"
### 🔧 Instrucciones (modo receta)
1. **Objetivo:** Crear un vídeo viral de 5-10 segundos con movimiento realista.
2. Ve a **Wan AI** (wanx.ai) o usa **ComfyUI con Wan-Move** (GOD TIER).
3. Sube tu mejor foto (generada con Nano Banana Pro).
4. **Motion Brush/Arrows:** Dibuja flechas en el pelo (viento) y en la mano (saludo).
5. Genera el vídeo (1080p si es posible).
6. Descárgalo y pásalo al móvil.
7. Abre TikTok/Reels, ponle una canción que sea Top 1 Viral.
8. Añade texto: "Pov: Tu vecina te saluda así".
9. **Resultado final:** Vídeo publicado con movimiento coherente.
"@
            }
            return "Para Elena (24, española, fitness girl-next-door), genera el entregable exacto para el paso: '" + $clean + "'. Devuelve un único resultado final listo para copiar y una checklist de validación."
        }
        "amazon_affiliates" {
            if ($t -match "nicho|producto") { return "Lista 10 productos con BSR < 50k y margen alto. Incluye razones y links." }
            if ($t -match "bsr|ranking") { return "Analiza BSR y estacionalidad de los 10 mejores productos del nicho." }
            if ($t -match "articul|post|reseña") { return "Genera un esquema SEO para una reseña comparativa con sección de pros/cons." }
            if ($t -match "keywords|palabras") { return "Obtén 30 keywords long-tail con intención de compra y volumen estimado." }
            return "Sugiere contenido afiliado con enfoque en conversión y SEO."
        }
        "kdp_publishing" {
            if ($t -match "keywords|palabras") { return "Crea 40 keywords KDP (inglés/español) para baja competencia y alto volumen." }
            if ($t -match "título|subtítulo") { return "Propón 10 títulos y subtítulos con beneficios claros y keywords." }
            if ($t -match "portada|cover") { return "Genera prompt para portada en estilo minimalista, tipografía legible y colores." }
            if ($t -match "índice|outline") { return "Esquematiza capítulos con objetivos y bullets por cada sección." }
            return "Sugerir posicionamiento y categoría óptima para el libro."
        }
        "seoprogrammatic" {
            if ($t -match "plantilla|template") { return "Define plantilla de artículo con placeholders: {ciudad}, {servicio}, {precio}." }
            if ($t -match "entidad|schema|estructura") { return "Extrae entidades clave y crea JSON-LD para Schema.org apropiado." }
            if ($t -match "keyword") { return "Genera 100 keywords locales combinando {servicio}+{ciudad}+intención de compra." }
            return "Diseña prompts para generar páginas a escala con calidad mínima viable."
        }
        "ia_music" {
            if ($t -match "género|estilo") { return "Elige 3 géneros y describe su estética sonora y referencias." }
            if ($t -match "letra") { return "Escribe letra en español con métrica clara, rima asonante y estribillo." }
            if ($t -match "arreglo|mezcla") { return "Define estructura (Intro, Verso, Pre, Estribillo, Puente) y capas de instrumentos." }
            return "Genera conceptos musicales y visuales coherentes con el proyecto."
        }
        "dieta_personalizada" {
            if ($t -match "perfil|cliente") { return "Crea un perfil de cliente detallado, incluyendo objetivos, restricciones y preferencias." }
            if ($t -match "plan|menú") { return "Genera un plan de comidas semanal equilibrado y variado según el perfil del cliente." }
            if ($t -match "recetas") { return "Desarrolla 5 recetas saludables, fáciles y rápidas, con información nutricional." }
            if ($t -match "seguimiento|progreso") { return "Establece un sistema de seguimiento de progreso con métricas clave y puntos de control." }
            return "Sugiere estrategias de motivación y ajuste del plan basadas en el feedback del cliente."
        }
        default {
            if ($t -match "listar|elegir|definir|crear|escribir|generar|configurar|analizar") { return "$clean..." }
            return "Genera un resultado para: $clean"
        }
    }
}

# Define the long string here to avoid syntax errors
$guideEsquema = @"
### 🏷️ Formato
Define una estructura consistente para tus prompts. Por ejemplo: `[Sujeto], [Acción], [Entorno], [Iluminación], [Estilo], [Cámara]`.

### 📝 Ejemplo
> "Mujer joven de 25 años, pelo rubio, mirando a cámara, sonriendo, en una cafetería moderna, luz natural suave, fotografía realista, 8k, alta definición."

### ⚠️ Importante
Mantén siempre las mismas características físicas (pelo, ojos, cuerpo) para asegurar la consistencia del personaje.
"@

$guideTips = @"

### 💡 Tips
* Tómate tu tiempo para revisar los detalles.
* Si tienes dudas, consulta la documentación oficial o usa IA para generar ideas.
"@

$tipsInfluencer = @"
### 💡 Tips
* Mantén consistencia del personaje en todas las piezas.
* Usa hooks fuertes y CTA claros.
"@
$tipsAmazon = @"
### 💡 Tips
* Prioriza intención de compra y BSR estable.
* Estructura reseñas con pros/cons y comparativas.
"@
$tipsKdp = @"
### 💡 Tips
* Título claro, portada legible y categoría precisa.
* Mantén ritmo y valor por capítulo.
"@
$tipsSeo = @"
### 💡 Tips
* Plantillas limpias y variables bien nombradas.
* Evita contenido duplicado; cuida interlinking.
"@
$tipsMusic = @"
### 💡 Tips
* Referencias claras antes de producir.
* Deja espacio para la voz; evita saturar mezcla.
"@

$tipsDieta = @"
### 💡 Tips
* Basa el plan en datos objetivos y feedback del cliente.
* Fomenta hábitos sostenibles en lugar de restricciones extremas.
"@

function Get-Tips {
    param([string]$businessKey)
    switch ($businessKey) {
        "influencer_agency" { return $tipsInfluencer }
        "amazon_affiliates" { return $tipsAmazon }
        "kdp_publishing"    { return $tipsKdp }
        "seoprogrammatic"   { return $tipsSeo }
        "ia_music"          { return $tipsMusic }
        "dieta_personalizada" { return $tipsDieta }
        default             { return $guideTips }
    }
}

function Build-Guide {
    param([string]$businessKey, [string]$title)
    $commonTop = @'
### 🎯 Objetivo
Completar este paso sin decisiones abiertas ni ambigüedad.

### ✅ Resultado exacto (al terminar)
- Tienes un único output concreto (texto/archivo/enlace) listo para usar.

### 🛠️ Herramientas directas
- Navegador
- ChatGPT: https://chatgpt.com/
- Notas (Bloc de notas o Google Docs)
'@
    $commonBottom = @'
### ✅ Validación (si falla, repite el paso)
- El resultado es específico, usable y copiables en 1 minuto.
- No hay “elige lo que te guste”: hay una sola opción final.

### ⚠️ Errores que NO puedes cometer
- Cambiar el personaje a mitad del proceso.
- Publicar contenido NSFW en Instagram/TikTok.
- No guardar prompts/archivos (pierdes consistencia y dinero).
'@
    switch ($businessKey) {
        "influencer_agency" {
            $t = (($title | ForEach-Object { $_ }) -as [string]).ToLower()
            $spec = switch -Regex ($t) {
                "lluvia de ideas|nichos|elegir personalidad|arquetipo" {
@"
### 🔧 Instrucciones (modo receta)
1. Copia y pega este texto en tus notas (NO lo cambies):
   - Personaje: **Elena**
   - Arquetipo: **Girl Next Door + Fitness**
   - Edad: **24**
   - País: **España**
   - Objetivo: **vender suscripción + PPV en Fanvue**
2. Abre ChatGPT y pega este prompt (cópialo tal cual):
   **PROMPT**
   Genera 10 nombres de usuario para Instagram/TikTok/Twitter para una influencer IA llamada Elena (24, española, fitness girl-next-door). Requisitos: sin caracteres raros, fácil de leer, máximo 12-15 caracteres si es posible. Devuélvelos en lista numerada del 1 al 10.
3. Regla anti-errores: vas a usar este algoritmo (sin “gustos”):
   - Abre https://namechk.com/
   - Prueba del #1 al #10 en orden.
   - Elige el PRIMER nombre que esté libre en Instagram y TikTok.
   - Si ninguno está libre: añade `official` al final y repite.
"@
                }
                "registro y perfil" {
@"
### 🔧 Instrucciones (modo receta)
1. Ve a [Fanvue.com](https://www.fanvue.com) y regístrate como Creador.
2. Sube tu **Foto de Perfil** (Elena sonriendo, plano medio, ropa casual pero ajustada).
3. Sube tu **Banner** (Elena en el gimnasio o playa, formato horizontal 16:9).
4. Rellena el campo **Bio** con esto:
   "24 🇪🇸 | Fitness Lover 🏋️‍♀️
   Aquí comparto lo que Instagram me borra 😈
   Contesta a mis DMs, ¡soy yo de verdad!"
5. Configura tu URL personalizada con el handle que elegiste (ej: fanvue.com/elena.fitdiary).
6. **Resultado final:** Captura de pantalla de tu perfil vacío pero configurado.
"@
                }
                "verificación identidad y fiscalidad" {
@"
### 🔧 Instrucciones (modo receta)
1. **IMPORTANTE:** Fanvue requiere una persona REAL detrás de la cuenta.
2. Usa TU documento de identidad real (DNI/Pasaporte) y TU cara para el selfie de verificación. Tú eres el "manager" legal de Elena.
3. No intentes usar una foto generada por IA para la verificación; te banearán al instante.
4. Rellena los datos fiscales con tu información real.
5. **Resultado final:** Email de confirmación de "Cuenta Verificada".
"@
                }
                "configurar payout" {
@"
### 🔧 Instrucciones (modo receta)
1. Ve a Settings > Payouts.
2. Si tienes cuenta bancaria en zona SEPA/USA compatible, añádela directamente.
3. Si no, regístrate en **CosmoPayment** o **Paxum** (comunes en la industria para adultos/creadores).
4. **Resultado final:** Método de pago en estado "Pending" o "Active".
"@
                }
                "niveles y beneficios|precios y promociones" {
@"
### 🔧 Instrucciones (modo receta)
1. **Precio de Suscripción:** Ponlo a **$9.99** (psicológico, menos de 10).
2. **Promoción de Lanzamiento:** Crea un cupón de "50% OFF first month" (para captar los primeros 10 fans rápido).
3. **Bundles (Paquetes):**
   - 3 meses: 15% descuento.
   - 6 meses: 25% descuento.
4. **Resultado final:** Captura de la pantalla de precios configurada.
"@
                }
                "ppv y paywalls" {
@"
### 🔧 Instrucciones (modo receta)
1. **Estrategia:** El dinero real está en los mensajes privados de pago (PPV).
2. Prepara tu primer contenido PPV:
   - **Foto:** Elena en lencería frente al espejo (sin desnudo explícito todavía).
   - **Precio:** $15.
   - **Texto del mensaje:** "Me acabo de comprar esto... ¿te gusta cómo me queda? 🙈 Solo para tus ojos."
3. Configura este mensaje como una plantilla guardada.
4. **Resultado final:** Plantilla de mensaje PPV creada en Fanvue.
"@
                }
                "bienvenida y upsell" {
@"
### 🔧 Instrucciones (modo receta)
1. Ve a Settings > Auto-Message (Mensaje de Bienvenida).
2. Activa "Send to new subscribers".
3. **Script (Copia y pega):**
   "¡Hola amor! Gracias por unirte a mi mundo privado ❤️
   Soy un poco tímida en redes, pero aquí me suelto más...
   ¿Qué te gustaría ver primero? 👇"
4. **Adjunta:** Una foto "gratis" que sea muy bonita (ej: primer plano de cara guiñando un ojo).
5. **Resultado final:** Auto-mensaje activado.
"@
                }
                "nombre de usuario|handle" {
@"
### 🔧 Instrucciones (modo receta)
1. Usa el nombre base: **elena.fitdiary**
2. Verifica disponibilidad:
   - Instagram: busca el nombre en la app.
   - TikTok: busca el nombre en la app.
   - Twitter/X: busca el nombre en la app.
3. Si está ocupado, aplica esta escalera (en este orden) hasta que funcione:
   1) elena_fitdiary
   2) elena.fit.diary
   3) elena.fitdiary24
   4) elena_fitdiary24
   5) elena.fitdiary_official
4. Resultado final obligatorio: guarda el handle final en tus notas.
"@
                }
                "biograf|bio|bio y keywords" {
@"
### 🔧 Instrucciones (modo receta)
1. Copia y pega esta bio (solo cambia la ciudad si quieres, nada más):
   **BIO**
   24 🇪🇸 | Fitness girl-next-door 🏋️‍♀️
   Diario real (y mi lado privado) 👇
   [Tu enlace de Fanvue aquí]
2. Añade tu link (Linktree o Fanvue directo) como el enlace de la bio.
3. Resultado final obligatorio: captura de pantalla de tu bio ya puesta.
"@
                }
                "prompt base|diseñar el prompt|prompt anchor" {
@"
### 🔧 Instrucciones (modo receta)
1. Copia este prompt base (NO lo cambies todavía):
   **PROMPT (SDXL/Tensor/SeaArt)**
   photo of Elena, 24yo spanish woman, honey brown wavy hair, hazel green eyes, subtle freckles on nose, dimples, athletic feminine body, natural skin texture, wearing gym leggings and sports bra, looking at camera, soft natural daylight, shot on iPhone, realistic, 8k, high detail
2. Genera 12 imágenes y guarda las 3 mejores.
3. Resultado final obligatorio: 3 imágenes + prompt guardado en un .txt.
"@
                }
                "hook bank|hook" {
@"
### 🔧 Instrucciones (modo receta)
1. Abre tus notas y crea una lista llamada "Banco de Ganchos".
2. Copia estos 5 ganchos virales (funcionan siempre):
   - "Lo que nadie te cuenta de ser una chica fitness..."
   - "POV: Tu novia te manda esto después de entrenar..."
   - "3 cosas que odio del gimnasio (la 2 te sorprenderá)..."
   - "Me dijeron que no debería subir esto..."
   - "¿Crees que este conjunto es demasiado para salir?"
3. Úsalos como texto sobre tus videos de TikTok/Reels.
4. **Resultado final:** Lista de hooks guardada.
"@
                }
                "hashtags y pauta" {
@"
### 🔧 Instrucciones (modo receta)
1. Crea 3 grupos de hashtags en tus notas:
   - **Grupo A (Grandes):** #fitnessgirl #gymmotivation #spanishgirl
   - **Grupo B (Medianos):** #chicafitness #entrenamientofemenino #vidanaudable
   - **Grupo C (Específicos):** #elena #ticiudad #miercoles
2. Regla de publicación: Usa 3 del A, 3 del B y 2 del C. Total 8 hashtags.
3. No uses más de 10.
4. **Resultado final:** Los 3 grupos guardados en tus notas.
"@
                }
                default {
@"
### 🔧 Instrucciones (modo receta)
1. Abre ChatGPT y pega este prompt (cópialo tal cual):
   **PROMPT**
   Eres un experto manager de OnlyFans/Fanvue. Nuestro personaje es Elena (24, española, fitness). Necesito completar el paso: "$title".
   Devuélveme EXACTAMENTE:
   1) Una instrucción paso a paso (sin opciones, dime qué hacer).
   2) El texto/script exacto si hace falta.
   3) Una checklist de validación.
2. Ejecuta SOLO esas acciones en orden.
3. Resultado final obligatorio: un texto/asset listo para pegar, guardado en tus notas.
"@
                }
            }
        }
        "amazon_affiliates" {
            $spec = @"
### 🔧 Instrucciones (A–Z)
1. Define objetivo del paso: $title y cómo impacta la conversión.
2. Identifica productos/nichos con BSR estable y margen.
3. Crea esquema de contenido orientado a compra.
4. Añade enlaces de afiliado y disclaimers.
5. Prepara comparativas y pros/cons claros.
6. Valida con una checklist SEO básica y publicación.
"@
        }
        "kdp_publishing" {
            $spec = @"
### 🔧 Instrucciones (A–Z)
1. Define objetivo del paso: $title y público objetivo.
2. Prepara keywords y estructura de capítulos.
3. Redacta/maqueta con formato consistente.
4. Diseña portada (legibilidad, estilo, tamaño).
5. Configura metadata (categorías, pricing).
6. Revisa muestra y checklist de calidad antes de publicar.
"@
        }
        "seoprogrammatic" {
            $spec = @"
### 🔧 Instrucciones (A–Z)
1. Define objetivo del paso: $title y variables necesarias.
2. Diseña plantilla con placeholders claros.
3. Prepara fuente de datos (CSV/DB/API).
4. Genera páginas a escala controlando calidad mínima.
5. Inserta JSON-LD adecuado y enlazado interno básico.
6. Valida indexación y rendimiento.
"@
        }
        "ia_music" {
            $spec = @"
### 🔧 Instrucciones (A–Z)
1. Define objetivo del paso: $title y referencia sonora.
2. Prepara letra/estructura (Intro, Verso, Pre, Estribillo, Puente).
3. Selecciona instrumentos y arreglos principales.
4. Graba/produce y cuida dinámica/mezcla.
5. Haz mastering ligero y exporta formatos necesarios.
6. Documenta decisiones y prepara publicación/distribución.
"
        }
        "dieta_personalizada" {
            $spec = @"
### 🔧 Instrucciones (A–Z)
1. Define objetivo del paso: $title y perfil del cliente.
2. Recopila datos: mediciones, analíticas, cuestionarios.
3. Diseña el plan nutricional con macros y micros.
4. Crea un menú semanal con recetas y lista de la compra.
5. Establece un calendario de seguimiento y ajuste.
6. Documenta el progreso y redefine objetivos.
"
        }
        default {
            $spec = @"
### 🔧 Instrucciones (A–Z)
1. Define objetivo del paso: $title.
2. Lista prerrequisitos y recursos.
3. Ejecuta tareas en orden lógico con evidencias.
4. Revisa calidad y consistencia.
5. Documenta y comunica resultados.
"@
        }
    }
    return ($commonTop + "`n" + $spec + "`n" + (Get-Tips $businessKey) + "`n" + $commonBottom)
}

function Get-DefaultStepTitles {
    param([string]$businessKey)
    switch ($businessKey) {
        "influencer_agency" { return @(
            "Definir objetivo",
            "Consistencia del personaje",
            "Estructurar hooks y CTA",
            "Variaciones A/B",
            "Medición esperada",
            "Entregables",
            "Fanvue publicación programada",
            "Fanvue marketing segmentado",
            "Fanvue engagement boost",
            "Fanvue contenido exclusivo"
        ) }
        "amazon_affiliates" { return @("Objetivo y conversión", "Seleccionar nichos/productos", "Analizar BSR", "Enlaces y disclaimers", "Comparativas", "Checklist SEO") }
        "kdp_publishing"    { return @("Objetivo y público", "Keywords y capítulos", "Maquetación", "Portada", "Metadata", "Checklist calidad") }
        "seoprogrammatic"   { return @("Objetivo y variables", "Plantilla con placeholders", "Fuente de datos", "Generación a escala", "JSON-LD", "Validación") }
        "ia_music"          { return @("Objetivo y referencia", "Estructura musical", "Arreglos", "Producción", "Mastering", "Publicación") }
        "dieta_personalizada" { return @("Perfil del cliente", "Recopilación de datos", "Diseño del plan", "Menú y recetas", "Seguimiento", "Ajuste de objetivos") }
        default             { return @("Definir objetivo", "Prerrequisitos", "Ejecución", "Validación", "Entregables", "Cierre") }
    }
}

function Ensure-FanvueTasks {
    param($contentRef)
    $biz = $contentRef.businesses | Where-Object { $_.key -eq "influencer_agency" }
    if (-not $biz) { return }
    $existingIds = @()
    foreach ($t in $biz.tasks) { $existingIds += $t.id }
    if ($existingIds -notcontains "fanvue_05_publicacion") {
        $pubTask = [pscustomobject]@{
            id = "fanvue_05_publicacion"
            title = "Publicación Fanvue"
            points = 12
            badge = "Publishing"
            description = "Configura y publica contenido en Fanvue con estructura clara."
            time = "4 horas"
            difficulty = "Media"
            subtasks = @(
                [pscustomobject]@{
                    id = "fanvue_05_01_cuenta"; title = "Configurar cuenta y verificación"
                    points = 3; time = "45 min"; difficulty = "Fácil"
                    steps = @(
                        [pscustomobject]@{ id="fanvue_05_01_s01"; title="Registro y perfil"; guide=Build-Guide -businessKey "influencer_agency" -title "Registro y perfil" },
                        [pscustomobject]@{ id="fanvue_05_01_s02"; title="Verificación identidad y fiscalidad"; guide=Build-Guide -businessKey "influencer_agency" -title "Verificación identidad y fiscalidad" },
                        [pscustomobject]@{ id="fanvue_05_01_s03"; title="Configurar payout (Stripe/Bank)"; guide=Build-Guide -businessKey "influencer_agency" -title "Configurar payout" },
                        [pscustomobject]@{ id="fanvue_05_01_s04"; title="Seguridad (2FA, accesos)"; guide=Build-Guide -businessKey "influencer_agency" -title "Seguridad 2FA" }
                    )
                },
                [pscustomobject]@{
                    id = "fanvue_05_02_producto"; title = "Definir tiers, bundles y PPV"
                    points = 3; time = "1 hora"; difficulty = "Media"
                    steps = @(
                        [pscustomobject]@{ id="fanvue_05_02_s01"; title="Niveles y beneficios"; guide=Build-Guide -businessKey "influencer_agency" -title "Niveles y beneficios" },
                        [pscustomobject]@{ id="fanvue_05_02_s02"; title="Precios y promociones"; guide=Build-Guide -businessKey "influencer_agency" -title "Precios y promociones" },
                        [pscustomobject]@{ id="fanvue_05_02_s03"; title="Contenido PPV y paywalls"; guide=Build-Guide -businessKey "influencer_agency" -title "PPV y paywalls" },
                        [pscustomobject]@{ id="fanvue_05_02_s04"; title="Políticas y normas"; guide=Build-Guide -businessKey "influencer_agency" -title "Políticas y normas" }
                    )
                },
                [pscustomobject]@{
                    id = "fanvue_05_03_calendario"; title = "Plan y calendario de publicación"
                    points = 3; time = "1 hora"; difficulty = "Media"
                    steps = @(
                        [pscustomobject]@{ id="fanvue_05_03_s01"; title="Calendario semanal (free/paid)"; guide=Build-Guide -businessKey "influencer_agency" -title "Calendario semanal" },
                        [pscustomobject]@{ id="fanvue_05_03_s02"; title="Guiones y assets"; guide=Build-Guide -businessKey "influencer_agency" -title "Guiones y assets" },
                        [pscustomobject]@{ id="fanvue_05_03_s03"; title="Series y continuidad"; guide=Build-Guide -businessKey "influencer_agency" -title "Series y continuidad" },
                        [pscustomobject]@{ id="fanvue_05_03_s04"; title="Checklist de publicación"; guide=Build-Guide -businessKey "influencer_agency" -title "Checklist de publicación" }
                    )
                },
                [pscustomobject]@{
                    id = "fanvue_05_04_lanzamiento"; title = "Lanzamiento: semana 1"
                    points = 3; time = "1 hora"; difficulty = "Media"
                    steps = @(
                        [pscustomobject]@{ id="fanvue_05_04_s01"; title="Programar 7 posts y 3 PPV"; guide=Build-Guide -businessKey "influencer_agency" -title "Programación inicial" },
                        [pscustomobject]@{ id="fanvue_05_04_s02"; title="Copys y CTA específicos Fanvue"; guide=Build-Guide -businessKey "influencer_agency" -title "Copys y CTA" },
                        [pscustomobject]@{ id="fanvue_05_04_s03"; title="Stories y etiquetado"; guide=Build-Guide -businessKey "influencer_agency" -title "Stories y etiquetado" },
                        [pscustomobject]@{ id="fanvue_05_04_s04"; title="Revisión métricas diarias"; guide=Build-Guide -businessKey "influencer_agency" -title "Revisión métricas" }
                    )
                },
                [pscustomobject]@{
                    id = "fanvue_05_05_automatizaciones"; title = "Automatizaciones y retención"
                    points = 3; time = "45 min"; difficulty = "Media"
                    steps = @(
                        [pscustomobject]@{ id="fanvue_05_05_s01"; title="Mensaje bienvenida y upsell"; guide=Build-Guide -businessKey "influencer_agency" -title "Bienvenida y upsell" },
                        [pscustomobject]@{ id="fanvue_05_05_s02"; title="DM templates y triggers"; guide=Build-Guide -businessKey "influencer_agency" -title "DM templates" },
                        [pscustomobject]@{ id="fanvue_05_05_s03"; title="Reactivación y ofertas"; guide=Build-Guide -businessKey "influencer_agency" -title "Reactivación y ofertas" },
                        [pscustomobject]@{ id="fanvue_05_05_s04"; title="Churn y fidelización"; guide=Build-Guide -businessKey "influencer_agency" -title "Churn y fidelización" }
                    )
                }
            )
        }
        $biz.tasks += $pubTask
    }
    if ($existingIds -notcontains "fanvue_06_marketing") {
        $mktTask = [pscustomobject]@{
            id = "fanvue_06_marketing"
            title = "Marketing Fanvue"
            points = 12
            badge = "Growth"
            description = "Estrategias de adquisición, retención y monetización en Fanvue."
            time = "4 horas"
            difficulty = "Media"
            subtasks = @(
                [pscustomobject]@{
                    id="fanvue_06_01_perfil"; title="Optimización perfil y SEO interno"
                    points=3; time="45 min"; difficulty="Fácil"
                    steps=@(
                        [pscustomobject]@{ id="fanvue_06_01_s01"; title="Bio, keywords y portada"; guide=Build-Guide -businessKey "influencer_agency" -title "Bio y keywords" },
                        [pscustomobject]@{ id="fanvue_06_01_s02"; title="Link-in-bio y banner"; guide=Build-Guide -businessKey "influencer_agency" -title "Link-in-bio y banner" },
                        [pscustomobject]@{ id="fanvue_06_01_s03"; title="Tracking y UTMs"; guide=Build-Guide -businessKey "influencer_agency" -title "Tracking y UTMs" }
                    )
                },
                [pscustomobject]@{
                    id="fanvue_06_02_social"; title="Adquisición social (TikTok/IG/Twitter)"
                    points=3; time="1 hora"; difficulty="Media"
                    steps=@(
                        [pscustomobject]@{ id="fanvue_06_02_s01"; title="Hook bank y formatos"; guide=Build-Guide -businessKey "influencer_agency" -title "Hook bank y formatos" },
                        [pscustomobject]@{ id="fanvue_06_02_s02"; title="Hashtags y pauta básica"; guide=Build-Guide -businessKey "influencer_agency" -title "Hashtags y pauta" },
                        [pscustomobject]@{ id="fanvue_06_02_s03"; title="Cross-post y timing"; guide=Build-Guide -businessKey "influencer_agency" -title "Cross-post y timing" }
                    )
                },
                [pscustomobject]@{
                    id="fanvue_06_03_colab"; title="Colaboraciones y cross-promo"
                    points=3; time="1 hora"; difficulty="Media"
                    steps=@(
                        [pscustomobject]@{ id="fanvue_06_03_s01"; title="Listado y outreach"; guide=Build-Guide -businessKey "influencer_agency" -title "Listado y outreach" },
                        [pscustomobject]@{ id="fanvue_06_03_s02"; title="Acuerdos y contenido conjunto"; guide=Build-Guide -businessKey "influencer_agency" -title "Acuerdos y contenido conjunto" },
                        [pscustomobject]@{ id="fanvue_06_03_s03"; title="Medición y seguimiento"; guide=Build-Guide -businessKey "influencer_agency" -title "Medición y seguimiento" }
                    )
                },
                [pscustomobject]@{
                    id="fanvue_06_04_embudos"; title="Embudos: landing, lead magnet y DM/email"
                    points=3; time="1 hora"; difficulty="Media"
                    steps=@(
                        [pscustomobject]@{ id="fanvue_06_04_s01"; title="Landing y oferta"; guide=Build-Guide -businessKey "influencer_agency" -title "Landing y oferta" },
                        [pscustomobject]@{ id="fanvue_06_04_s02"; title="Lead magnet y captura"; guide=Build-Guide -businessKey "influencer_agency" -title "Lead magnet y captura" },
                        [pscustomobject]@{ id="fanvue_06_04_s03"; title="Secuencia DM/email"; guide=Build-Guide -businessKey "influencer_agency" -title "Secuencia DM/email" }
                    )
                },
                [pscustomobject]@{
                    id="fanvue_06_05_metricas"; title="Métricas: CVR, AOV, churn, LTV"
                    points=3; time="45 min"; difficulty="Media"
                    steps=@(
                        [pscustomobject]@{ id="fanvue_06_05_s01"; title="Dashboard y KPIs"; guide=Build-Guide -businessKey "influencer_agency" -title "Dashboard y KPIs" },
                        [pscustomobject]@{ id="fanvue_06_05_s02"; title="Insights y iteración"; guide=Build-Guide -businessKey "influencer_agency" -title "Insights e iteración" },
                        [pscustomobject]@{ id="fanvue_06_05_s03"; title="Acciones de mejora"; guide=Build-Guide -businessKey "influencer_agency" -title "Acciones de mejora" }
                    )
                }
            )
        }
        $biz.tasks += $mktTask
    }
}

$totalTasks = 0
$totalSubtasks = 0
$totalSteps = 0
$missingPrompts = 0

Ensure-FanvueTasks -contentRef $content

foreach ($business in $content.businesses) {
    foreach ($task in $business.tasks) {
        $totalTasks++
        $tTime = if ($task.time) { $task.time } else { "1 hora" }
        $tDiff = if ($task.difficulty) { $task.difficulty } else { "Media" }
        $task.title = Fix-Text $task.title
        if ($task.description) { $task.description = Fix-Text $task.description }
        if ($business.key -eq "influencer_agency") {
            $value = (Generate-Prompt $task.title $business.key)
            if ($task.PSObject.Properties.Match('prompt').Count) { $task.prompt = $value } else { $task | Add-Member -MemberType NoteProperty -Name "prompt" -Value $value }
        }
        elseif (-not $task.PSObject.Properties.Match('prompt').Count -or [string]::IsNullOrWhiteSpace($task.prompt)) {
            $value = (Generate-Prompt $task.title $business.key)
            if ($task.PSObject.Properties.Match('prompt').Count) { $task.prompt = $value } else { $task | Add-Member -MemberType NoteProperty -Name "prompt" -Value $value }
            $missingPrompts++
        }

        foreach ($subtask in $task.subtasks) {
            $totalSubtasks++
            $sTime = if ($subtask.time) { $subtask.time } else { $tTime }
            $sDiff = if ($subtask.difficulty) { $subtask.difficulty } else { $tDiff }
            $subtask.title = Fix-Text $subtask.title
            if ($subtask.description) { $subtask.description = Fix-Text $subtask.description }
            
            if (-not $subtask.PSObject.Properties.Match('time').Count) { $subtask | Add-Member -MemberType NoteProperty -Name "time" -Value $sTime }
            if (-not $subtask.PSObject.Properties.Match('difficulty').Count) { $subtask | Add-Member -MemberType NoteProperty -Name "difficulty" -Value $sDiff }
            if (-not $subtask.PSObject.Properties.Match('description').Count) { $subtask | Add-Member -MemberType NoteProperty -Name "description" -Value $subtask.title }
            if ($business.key -eq "influencer_agency") {
                $value = (Generate-Prompt $subtask.title $business.key)
                if ($subtask.PSObject.Properties.Match('prompt').Count) { $subtask.prompt = $value } else { $subtask | Add-Member -MemberType NoteProperty -Name "prompt" -Value $value }
            }
            elseif (-not $subtask.PSObject.Properties.Match('prompt').Count -or [string]::IsNullOrWhiteSpace($subtask.prompt)) {
                $value = (Generate-Prompt $subtask.title $business.key)
                if ($subtask.PSObject.Properties.Match('prompt').Count) { $subtask.prompt = $value } else { $subtask | Add-Member -MemberType NoteProperty -Name "prompt" -Value $value }
                $missingPrompts++
            }

            foreach ($step in $subtask.steps) {
                $totalSteps++
                if (-not $step.PSObject.Properties.Match('time').Count) { $step | Add-Member -MemberType NoteProperty -Name "time" -Value $sTime }
                if (-not $step.PSObject.Properties.Match('difficulty').Count) { $step | Add-Member -MemberType NoteProperty -Name "difficulty" -Value $sDiff }
                if (-not $step.PSObject.Properties.Match('description').Count) { 
                    $desc = "Paso clave para completar: " + $subtask.title
                    $step | Add-Member -MemberType NoteProperty -Name "description" -Value $desc 
                }
                # Fix mojibake and ensure prompt
                $step.title = Fix-Text $step.title
                if ($step.guide) { $step.guide = Fix-Text $step.guide }
                if ($step.description) { $step.description = Fix-Text $step.description }
                if ($business.key -eq "influencer_agency") {
                    $value = (Generate-Prompt $step.title $business.key)
                    if ($step.PSObject.Properties.Match('prompt').Count) { $step.prompt = $value } else { $step | Add-Member -MemberType NoteProperty -Name "prompt" -Value $value }
                }
                elseif (-not $step.PSObject.Properties.Match('prompt').Count -or [string]::IsNullOrWhiteSpace($step.prompt)) {
                    $value = (Generate-Prompt $step.title $business.key)
                    if ($step.PSObject.Properties.Match('prompt').Count) { $step.prompt = $value } else { $step | Add-Member -MemberType NoteProperty -Name "prompt" -Value $value }
                    $missingPrompts++
                }

                if ($step.id -eq "fanvue_03_02_caption_s01") {
                    $step.guide = $guideEsquema
                }
                else {
                    if ($business.key -eq "influencer_agency") {
                        $step.guide = Build-Guide -businessKey $business.key -title $step.title
                    }
                    else {
                        if (-not $step.guide -or $step.guide.Length -lt 10) {
                            $step.guide = Build-Guide -businessKey $business.key -title $step.title
                        } elseif ($step.guide -and ($step.guide -notmatch "💡 Tips")) {
                            $step.guide += (Get-Tips $business.key)
                        }
                    }
                }
            }
            # Ensure minimum granularity: at least 5 steps per subtask
            if (-not $subtask.PSObject.Properties.Match('steps').Count) { $subtask | Add-Member -MemberType NoteProperty -Name "steps" -Value @() }
            if (-not $subtask.steps) { $subtask.steps = @() }
            $existingCount = ($subtask.steps | Measure-Object).Count
            $minSteps = 5
            $need = $minSteps - $existingCount
            if ($need -gt 0) {
                $titles = Get-DefaultStepTitles $business.key
                for ($i = 0; $i -lt $need; $i++) {
                    $stTitle = $titles[$i]
                    $suffix = "{0:d2}" -f ($existingCount + $i + 1)
                    $newId = $subtask.id + "_az" + $suffix
                    $newStep = [pscustomobject]@{
                        id = $newId
                        title = $stTitle
                        description = "Paso clave para completar: " + $subtask.title
                        time = $sTime
                        difficulty = $sDiff
                        prompt = (Generate-Prompt $stTitle $business.key)
                        guide = Build-Guide -businessKey $business.key -title $stTitle
                    }
                    $subtask.steps += $newStep
                    $totalSteps++
                }
            }
        }
    }
}

# Guardar con UTF-8 sin BOM para mejor compatibilidad web
$jsonString = $content | ConvertTo-Json -Depth 10
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($jsonPath, $jsonString, $utf8NoBom)
Write-Host ("JSON enriched successfully. Tasks: {0}, Subtasks: {1}, Steps: {2}, New prompts: {3}" -f $totalTasks, $totalSubtasks, $totalSteps, $missingPrompts)
