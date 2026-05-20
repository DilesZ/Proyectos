# Persona: Elena (Fitness + GFE Hybrid)

## 🎯 Estrategia 2026 (Nivel Z)
Elena no es solo una chica fitness; es la **"Girlfriend Experience" (GFE)** definitiva para el nicho deportivo. 
- **Objetivo**: Pasar de un ARPS (Revenue por Suscriptor) de $24 a **$42+**.
- **Clave**: 80% de los ingresos vendrán de DMs privados y contenido personalizado (Customs), no de la suscripción base.

## 👤 Identidad Refinada
- **Arquetipo**: GFE / Girl Next Door / Fitness.
- **Personalidad**: Alegre, pero con un toque vulnerable y muy comunicativa. Envía notas de voz (ElevenLabs) preguntando por el día del fan.
- **Hook**: "Tu compañera de gimnasio que te espera en casa".

## 💸 Funnel de Monetización (0$ Cost)
1. **Tráfico (IG/TikTok)**: Clips virales de 5s (Kling/Luma) de Elena sonriendo, estirando o tomando café.
2. **Conversión (Fanvue)**: Mensaje de bienvenida con "Regalo de entrada" (Unlockable de $9.99) que es un set de fotos "recién llegada del gym".
3. **Retención**: Chat diario. "Hola [Nombre], ¿has entrenado hoy? Yo acabo de terminar y estoy agotada... ¿quieres ver cómo he quedado? [Link PPV $15]".

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
