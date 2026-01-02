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

$totalTasks = 0
$totalSubtasks = 0
$totalSteps = 0
$missingPrompts = 0

foreach ($business in $content.businesses) {
    foreach ($task in $business.tasks) {
        $totalTasks++
        $tTime = if ($task.time) { $task.time } else { "1 hora" }
        $tDiff = if ($task.difficulty) { $task.difficulty } else { "Media" }
        $task.title = Fix-Text $task.title
        if ($task.description) { $task.description = Fix-Text $task.description }
        if (-not $task.PSObject.Properties.Match('prompt').Count) {
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
            if (-not $subtask.PSObject.Properties.Match('prompt').Count) {
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
                if (-not $step.PSObject.Properties.Match('prompt').Count) {
                    $step | Add-Member -MemberType NoteProperty -Name "prompt" -Value (Generate-Prompt $step.title $business.key)
                    $missingPrompts++
                }

                if ($step.id -eq "fanvue_03_02_caption_s01") {
                    $step.guide = $guideEsquema
                }
                elseif ($step.guide.Length -lt 150 -and $step.guide -match "###" -and ($step.guide -notmatch "💡 Tips")) {
                    $step.guide += (Get-Tips $business.key)
                }
            }
        }
    }
}

$content | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath -Encoding utf8
Write-Host ("JSON enriched successfully. Tasks: {0}, Subtasks: {1}, Steps: {2}, New prompts: {3}" -f $totalTasks, $totalSubtasks, $totalSteps, $missingPrompts)
