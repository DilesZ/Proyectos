# Perfil de Éxito: "Elena, la vecina deportista"

Para asegurar el éxito en Fanvue, he decidido crear un perfil basado en el arquetipo de **"Girl Next Door" (La chica de al lado) con un enfoque en Fitness y Vida Saludable**. Este perfil es el que mejor convierte porque combina aspiración (cuerpo fitness) con accesibilidad (personalidad cercana).

## 1. Identidad Psicológica (The Persona)
- **Nombre**: Elena.
- **Edad**: 24 años.
- **Personalidad**: Alegre, un poco tímida pero aventurera, amante de la cafeína y de madrugar para entrenar.
- **Voz de Marca**: Habla de forma natural, usa emojis de forma moderada, comparte "fracasos" (ej: "se me quemó la avena") para humanizarse.
- **Gancho Emocional**: "Tu compañera de motivación que también tiene un lado travieso en privado".

## 2. Identidad Visual (The Look)
- **Rasgos**: Pelo castaño claro/miel con ondas naturales, ojos miel/verdes, pecas sutiles en la nariz, sonrisa con hoyuelos.
- **Físico**: Atlético pero femenino (curvas de fitness), piel con textura natural (no de porcelana).
- **Estilo de Ropa**: 80% ropa deportiva (leggings, tops de yoga), 20% ropa de casa cómoda (camisetas oversized, calcetines altos).

## 3. Estrategia de Contenido (Storyline Inicial)
- **Muro Público (Gancho)**: Rutinas de ejercicios, recetas de desayunos, selfies post-entreno con sudor realista.
- **Muro Privado (Retención)**: El "detrás de cámaras" de los entrenamientos, pruebas de ropa interior "deportiva", fotos más íntimas relajándose tras el gimnasio.
- **PPV (Venta Directa)**: Vídeos de estiramientos personalizados, "conversaciones íntimas" nocturnas, sets temáticos exclusivos.

---

# Dataset de Prompts para Entrenamiento (LoRA Identity)

He diseñado estos prompts para generar las 30 fotos base que servirán para fijar la cara de Elena.

### Bloque 1: Retratos Primer Plano (10 fotos)
*Objetivo: Capturar cada detalle de la cara, ojos y pecas.*
- **Prompt Base**: `(extreme close-up portrait of Elena:1.2), young woman, honey brown wavy hair, hazel eyes, subtle freckles on nose, dimples, natural skin texture, soft daylight, 8k raw photo, highly detailed, neutral expression.`

### Bloque 2: Ángulos y Perfiles (10 fotos)
*Objetivo: Que la IA aprenda la estructura ósea desde diferentes lados.*
- **Prompt Base**: `(side profile of Elena:1.1), looking away, honey brown wavy hair, athletic build, wearing a simple cotton tank top, messy room background, realistic lighting, shot on iPhone, grainy texture.`

### Bloque 3: Expresiones y Contextos (10 fotos)
*Objetivo: Humanizar con emociones y entornos cotidianos.*
- **Prompt Base**: `(candid photo of Elena laughing:1.1), sitting in a sunlit kitchen, holding a coffee mug, wearing an oversized t-shirt, messy hair, depth of field, natural lighting, cinematic but realistic, 35mm film style.`

---
**Instrucciones de Ejecución**: 
1. Usa **Nano Banana Pro** con estos prompts para generar las imágenes.
2. Descarga las 30 mejores y guárdalas en la carpeta `/agents/ingestion/downloads/dataset_elena`.
3. Procederemos al entrenamiento del LoRA para fijar esta identidad.

¿Quieres que cree la estructura de carpetas ahora mismo para empezar a organizar el dataset?
