# 🏭 ORQUESTADOR - Multi-Agent Business Factory v2.0

> **🚀 NUEVO: Guía para Principiantes**
> ¿Quieres generar ingresos con una Influencer IA pero no sabes por dónde empezar?
> 👉 **[LEE LA GUÍA MAESTRA AQUÍ](MASTER_GUIDE_INFLUENCER.md)** (Paso a paso, herramientas gratis, cero experiencia requerida).

## 🎯 Objetivo del Proyecto
Sistema automatizado para crear y gestionar negocios digitales utilizando una arquitectura de agentes especializados e Inteligencia Artificial de vanguardia.

---

## 🧠 Arquitectura Multi-Agente

### 1. 📥 **Ingestion Agent** (Recolector)
- **Ubicación**: `agents/ingestion/`
- **Función**: Descarga y procesa contenido de referencia (Instagram/YouTube).

### 2. 🧠 **Strategist Agent** (Estratega)
- **Ubicación**: `agents/strategist/`
- **Función**: Analiza mercados y define planes de ejecución con NotebookLM.

### 3. 🖼️ **Image Gen Agent** (Visuales)
- **Ubicación**: `agents/image_gen/`
- **Sub-Agentes**:
    - **Nano Banana (Freepik)**: Creación rápida de assets, edición y prototipado.
    - **Stable Diffusion (Pony/SDXL)**: Contenido adulto de alta fidelidad, consistencia de personajes (LoRA) para Fanvue.

### 4. 🎥 **Video Gen Agent** (Cineasta)
- **Ubicación**: `agents/video_gen/`
- **Tecnología**: **Wan 2.6** (Alibaba).
- **Función**: Generación de video con lip-sync y consistencia de personajes.

### 5. 🎨 **Designer Agent** (UI/UX)
- **Ubicación**: `agents/designer/`
- **Función**: Especificaciones de interfaz para Web Apps.

### 6. 👨‍💻 **Engineer Agent** (Desarrollador)
- **Ubicación**: `agents/engineer/`
- **Función**: Construcción de Web Apps (React + Vite).

---

## 📁 Estructura del Directorio

```
c:\Orquestador\
├── businesses\                 # Instancias de negocios (ej. Influencer Agency)
├── agents\                     # Lógica de los agentes
│   ├── image_gen\              # Nano Banana & Stable Diffusion
│   ├── video_gen\              # Wan 2.6
│   └── ...
├── mcp\                        # Servidores MCP y Herramientas
├── models\                     # Definiciones de IA
│   ├── personas\               # Hojas de personaje (Datasheets)
│   ├── prompts\                # Prompts Maestros
│   └── loras\                  # Modelos LoRA entrenados
└── config.yaml                 # Configuración Global
```

## 🚀 Flujos de Trabajo

### A. Influencer Agency (Fanvue)
1. **Strategist**: Define nicho y personalidad (Datasheet).
2. **Image Gen (Nano Banana)**: Genera dataset inicial de entrenamiento.
3. **Image Gen (SDXL)**: Entrena LoRA y genera contenido premium.
4. **Video Gen (Wan 2.6)**: Crea Reels y Stories hablando a cámara.
5. **Marketer**: Publica y gestiona el crecimiento.

### B. Micro-SaaS / Web Apps
1. **Strategist**: Analiza oportunidad.
2. **Designer**: Crea sistema de diseño.
3. **Engineer**: Programa la aplicación.

---

## 🛠️ Requisitos Técnicos
- Python 3.10+
- Node.js
- Cuenta Freepik (para Nano Banana)
- Acceso a GPU o Cloud (RunPod/Fal.ai) para Stable Diffusion/Wan 2.6
