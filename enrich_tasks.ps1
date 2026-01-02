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
            if ($t -match "nicho") { return "Genera 3 nichos para el arquetipo definido. Explica público objetivo y monetización." }
            if ($t -match "arquetipo|persona") { return "Redacta una ficha de personaje con rasgos físicos, estilo, tono y valores." }
            if ($t -match "caption|copy") { return "Escribe 10 captions cortos en tono atractivo, con CTA y hashtags relevantes." }
            if ($t -match "calendario|contenido") { return "Genera un calendario de contenidos semanal con ideas y formatos." }
            return "Propón contenido y hooks alineados al arquetipo seleccionado."
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

function Get-Tips {
    param([string]$businessKey)
    switch ($businessKey) {
        "influencer_agency" { return $tipsInfluencer }
        "amazon_affiliates" { return $tipsAmazon }
        "kdp_publishing"    { return $tipsKdp }
        "seoprogrammatic"   { return $tipsSeo }
        "ia_music"          { return $tipsMusic }
        default             { return $guideTips }
    }
}

function Build-Guide {
    param([string]$businessKey, [string]$title)
    $commonTop = @'
### 🎯 Objetivo
Define claramente el resultado de este paso. Documenta en una nota qué esperas conseguir.

### ✅ Prerrequisitos
- Acceso al proyecto y recursos necesarios
- Datos base preparados y organizados
- Tiempo reservado sin interrupciones

### 🛠️ Herramientas
- Navegador y hojas de cálculo
- Editor/IA para generación de contenido
- Gestor de tareas para seguimiento
'@
    $commonBottom = @'
### ✅ Validación
- Verifica que cada subpaso esté completado con evidencias (capturas, enlaces, archivos).
- Revisa coherencia, formato y calidad mínima aceptable.

### 📦 Entregables
- Documento/archivo con el resultado del paso
- Breve resumen de decisiones y próximos pasos

### ⚠️ Errores comunes
- Saltar prerrequisitos o no medir resultados
- Inconsistencia en nomenclaturas y formatos
- No guardar evidencias
'@
    switch ($businessKey) {
        "influencer_agency" {
            $spec = @"
### 🔧 Instrucciones (A–Z)
1. Define objetivo del paso: $title y relación con el arquetipo.
2. Revisa consistencia del personaje (rasgos, tono, estilo).
3. Genera ideas iniciales y selecciona las mejores.
4. Estructura contenido con hooks, valor y CTA.
5. Prepara variaciones para test A/B.
6. Documenta resultados esperados y cómo medirlos.
"@
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
        if (-not $task.PSObject.Properties.Match('prompt').Count -or [string]::IsNullOrWhiteSpace($task.prompt)) {
            $task | Add-Member -MemberType NoteProperty -Name "prompt" -Value (Generate-Prompt $task.title $business.key)
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
            if (-not $subtask.PSObject.Properties.Match('prompt').Count -or [string]::IsNullOrWhiteSpace($subtask.prompt)) {
                $subtask | Add-Member -MemberType NoteProperty -Name "prompt" -Value (Generate-Prompt $subtask.title $business.key)
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
                if (-not $step.PSObject.Properties.Match('prompt').Count -or [string]::IsNullOrWhiteSpace($step.prompt)) {
                    $step | Add-Member -MemberType NoteProperty -Name "prompt" -Value (Generate-Prompt $step.title $business.key)
                    $missingPrompts++
                }

                if ($step.id -eq "fanvue_03_02_caption_s01") {
                    $step.guide = $guideEsquema
                }
                else {
                    if (-not $step.guide -or $step.guide.Length -lt 300) {
                        $step.guide = Build-Guide -businessKey $business.key -title $step.title
                    } elseif ($step.guide -and ($step.guide -notmatch "💡 Tips")) {
                        $step.guide += (Get-Tips $business.key)
                    } 
                }
            }
            # Ensure minimum granularity: at least 5 steps per subtask
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

$content | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath -Encoding utf8
Write-Host ("JSON enriched successfully. Tasks: {0}, Subtasks: {1}, Steps: {2}, New prompts: {3}" -f $totalTasks, $totalSubtasks, $totalSteps, $missingPrompts)
