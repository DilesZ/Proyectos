import json
import os

# Path to tasks.json
file_path = r'c:\Users\d.ramos\Proyectos\Proyectos\web\data\tasks.json'

def get_details(task_id, title):
    """
    Returns a dictionary with description, time, difficulty, and guide
    based on the task_id or title keywords.
    """
    
    # Defaults
    desc = f"Detalle para la tarea: {title}"
    time = "30 min"
    diff = "Media"
    guide = f"### 🎯 Objetivo\nCompletar la tarea: **{title}**.\n\n### 📝 Instrucciones\n1. Analiza el requerimiento.\n2. Ejecuta los pasos indicados en los prompts.\n3. Verifica el resultado.\n\n### 💡 Consejo Pro\nDocumenta siempre tus hallazgos."

    # Custom logic for Fanvue (Influencer IA)
    if "fanvue" in task_id:
        if "arquetipo" in task_id:
            desc = "Definición estratégica de la identidad de la influencer."
            time = "1 hora"
            diff = "Fácil"
        elif "nombre" in task_id:
            desc = "Creación de marca personal: naming y biografía."
            time = "30 min"
            diff = "Fácil"
            guide = "### 🎯 Objetivo\nConseguir un nombre memorable y disponible.\n\n### 📝 Instrucciones\n1. Usa ChatGPT para lluvia de ideas.\n2. Verifica disponibilidad en Namechk.com.\n3. Elige el que suene más 'humano' y menos 'bot'."
        elif "paleta" in task_id:
            desc = "Definición estética visual: colores y estilo."
            time = "45 min"
            diff = "Fácil"
            guide = "### 🎯 Objetivo\nCrear una identidad visual coherente.\n\n### 📝 Instrucciones\n1. Busca inspiración en Pinterest.\n2. Define 3 colores principales.\n3. Crea un moodboard básico."
        elif "riesgo" in task_id:
            desc = "Análisis de compliance y seguridad de marca."
            time = "30 min"
            diff = "Media"
            guide = "### 🎯 Objetivo\nEvitar baneos y problemas legales.\n\n### 📝 Instrucciones\n1. Lee las guías de comunidad de IG/TikTok.\n2. Define líneas rojas (lo que NUNCA harás)."
        elif "copy" in task_id:
            desc = "Definición de la voz y tono de comunicación."
            time = "30 min"
            diff = "Media"
            guide = "### 🎯 Objetivo\nHablar como una persona real, no como una IA.\n\n### 📝 Instrucciones\n1. Define si es dulce, sarcástica o misteriosa.\n2. Escribe 3 ejemplos de respuestas a fans."
        elif "imagen_maestra" in task_id:
            desc = "Generación de la imagen base que definirá el rostro."
            time = "2 horas"
            diff = "Difícil"
            guide = "### 🎯 Objetivo\nObtener la 'cara perfecta' consistente.\n\n### 📝 Instrucciones\n1. Usa Nano Banana Pro o SDXL.\n2. Itera hasta obtener realismo fotográfico.\n3. Guarda la semilla (seed) y el prompt exacto."
        elif "dataset" in task_id:
            desc = "Creación del conjunto de datos para entrenar el LoRA."
            time = "3 horas"
            diff = "Difícil"
            guide = "### 🎯 Objetivo\nEntrenar a la IA para replicar el rostro.\n\n### 📝 Instrucciones\n1. Genera 40-60 variaciones del rostro.\n2. Asegura diversidad de iluminación y ángulos.\n3. Etiqueta (caption) cada imagen detalladamente."
        elif "datasheet" in task_id:
            desc = "Producción de catálogo de imágenes SFW seguras."
            time = "2 horas"
            diff = "Media"
            guide = "### 🎯 Objetivo\nTener contenido listo para redes sociales.\n\n### 📝 Instrucciones\n1. Usa ControlNet para poses específicas.\n2. Genera situaciones cotidianas (café, gym, parque)."
        elif "nsfc" in task_id or "sets_nsfc" in task_id:
            desc = "Generación de contenido exclusivo para monetización."
            time = "3 horas"
            diff = "Difícil"
            guide = "### 🎯 Objetivo\nCrear el producto de venta (PPV/Suscripción).\n\n### 📝 Instrucciones\n1. Respeta los límites de la plataforma Fanvue.\n2. Enfócate en la sensualidad artística y la iluminación."
        elif "video" in task_id:
            desc = "Creación de contenido en video con IA."
            time = "2 horas"
            diff = "Difícil"
            guide = "### 🎯 Objetivo\nDar vida al personaje con movimiento y voz.\n\n### 📝 Instrucciones\n1. Genera el guion y el audio (TTS).\n2. Usa herramientas como SadTalker o Wan para animar el rostro.\n3. Sincroniza los labios cuidadosamente."
        elif "cinematic" in task_id:
            desc = "Vídeos de alta calidad estética con movimiento de cámara."
            time = "2 horas"
            diff = "Difícil"
        elif "trend" in task_id:
            desc = "Adaptación de tendencias virales al personaje."
            time = "1 hora"
            diff = "Media"
        elif "infra" in task_id:
            desc = "Configuración técnica de cuentas y pasarelas."
            time = "2 horas"
            diff = "Media"
        elif "publicacion" in task_id:
            desc = "Rutina diaria de gestión de redes."
            time = "Diario"
            diff = "Fácil"
        elif "ppv" in task_id:
            desc = "Estrategia de venta directa por mensaje."
            time = "Diario"
            diff = "Media"
        elif "cupos" in task_id:
            desc = "Gestión eficiente de recursos gratuitos de IA."
            time = "30 min"
            diff = "Media"
        elif "optimizacion" in task_id:
            desc = "Mejora continua basada en datos."
            time = "1 hora"
            diff = "Difícil"

    # Custom logic for Amazon Affiliates
    elif "aa_" in task_id:
        if "analizador" in task_id:
            desc = "Investigación de mercado y tendencias."
            time = "2 horas"
            diff = "Media"
        elif "seleccion" in task_id:
            desc = "Elección de productos ganadores."
            time = "2 horas"
            diff = "Media"
        elif "stack" in task_id:
            desc = "Configuración tecnológica del sitio web."
            time = "3 horas"
            diff = "Difícil"
        elif "plantillas" in task_id:
            desc = "Diseño de la estructura de la web."
            time = "2 horas"
            diff = "Media"
        elif "contenido" in task_id:
            desc = "Generación masiva de artículos con IA."
            time = "4 horas"
            diff = "Media"

    return {
        "description": desc,
        "time": time,
        "difficulty": diff,
        "guide": guide
    }

def update_tasks():
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for business in data.get('businesses', []):
        for task in business.get('tasks', []):
            # Update main task if missing
            if 'description' not in task:
                details = get_details(task['id'], task['title'])
                task.update(details)
            
            # Update subtasks
            for subtask in task.get('subtasks', []):
                if 'description' not in subtask:
                    details = get_details(subtask['id'], subtask['title'])
                    subtask.update(details)
                
                # Update steps (steps usually don't have descriptions in this schema, 
                # but we can add guide if missing to be safe, though usually guide is at subtask level in UI?
                # Actually UI shows steps inside subtask. Let's add guide to steps if they have prompts)
                for step in subtask.get('steps', []):
                    if 'guide' not in step and 'prompt' in step:
                         # We'll use a generic guide for steps if specific one not found
                         step['guide'] = f"### 💡 Prompt Tip\nCopia y pega el prompt en tu herramienta de IA favorita.\n\n**Prompt:**\n`{step['prompt']}`"

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("Tasks updated successfully.")

if __name__ == "__main__":
    update_tasks()
