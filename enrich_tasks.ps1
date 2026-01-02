$jsonPath = "c:\Users\d.ramos\Proyectos\Proyectos\web\data\tasks.json"
$jsonContent = Get-Content -Path $jsonPath -Raw -Encoding UTF8
$content = $jsonContent | ConvertFrom-Json

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

foreach ($business in $content.businesses) {
    foreach ($task in $business.tasks) {
        $tTime = if ($task.time) { $task.time } else { "1 hora" }
        $tDiff = if ($task.difficulty) { $task.difficulty } else { "Media" }

        foreach ($subtask in $task.subtasks) {
            $sTime = if ($subtask.time) { $subtask.time } else { $tTime }
            $sDiff = if ($subtask.difficulty) { $subtask.difficulty } else { $tDiff }
            
            if (-not $subtask.PSObject.Properties.Match('time').Count) { $subtask | Add-Member -MemberType NoteProperty -Name "time" -Value $sTime }
            if (-not $subtask.PSObject.Properties.Match('difficulty').Count) { $subtask | Add-Member -MemberType NoteProperty -Name "difficulty" -Value $sDiff }
            if (-not $subtask.PSObject.Properties.Match('description').Count) { $subtask | Add-Member -MemberType NoteProperty -Name "description" -Value $subtask.title }

            foreach ($step in $subtask.steps) {
                if (-not $step.PSObject.Properties.Match('time').Count) { $step | Add-Member -MemberType NoteProperty -Name "time" -Value $sTime }
                if (-not $step.PSObject.Properties.Match('difficulty').Count) { $step | Add-Member -MemberType NoteProperty -Name "difficulty" -Value $sDiff }
                if (-not $step.PSObject.Properties.Match('description').Count) { 
                    $desc = "Paso clave para completar: " + $subtask.title
                    $step | Add-Member -MemberType NoteProperty -Name "description" -Value $desc 
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
Write-Host "JSON enriched successfully"
