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
    param([string]$title)
    if (-not $title) { return "Describe claramente el objetivo y genera el resultado esperado." }
    $clean = ($title -replace '^\s*\d+\s*', '').Trim()
    if ($clean -match '^(Listar|Elegir|Definir|Crear|Escribir|Generar|Diseñar|Grabar|Configurar|Analizar)') {
        return "$clean..."
    } else {
        return "Genera un resultado para: $clean"
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
            $task | Add-Member -MemberType NoteProperty -Name "prompt" -Value (Generate-Prompt $task.title)
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
                $subtask | Add-Member -MemberType NoteProperty -Name "prompt" -Value (Generate-Prompt $subtask.title)
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
                    $step | Add-Member -MemberType NoteProperty -Name "prompt" -Value (Generate-Prompt $step.title)
                    $missingPrompts++
                }

                if ($step.id -eq "fanvue_03_02_caption_s01") {
                    $step.guide = $guideEsquema
                }
                elseif ($step.guide.Length -lt 150 -and $step.guide -match "###") {
                    $step.guide += $guideTips
                }
            }
        }
    }
}

$content | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath -Encoding utf8
Write-Host ("JSON enriched successfully. Tasks: {0}, Subtasks: {1}, Steps: {2}, New prompts: {3}" -f $totalTasks, $totalSubtasks, $totalSteps, $missingPrompts)
