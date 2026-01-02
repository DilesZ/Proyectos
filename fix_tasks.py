import json
import os

file_path = r'c:\Users\d.ramos\Proyectos\Proyectos\web\data\tasks.json'

def create_step(id_suffix, title, guide_md):
    return {
        "id": id_suffix,
        "title": title,
        "guide": guide_md,
        "prompt": "Prompt automático basado en la guía."
    }

# Data to insert
kdp_extra = [
    {
        "id": "kdp_02_interior", "title": "Maquetación del Interior", "points": 15, "badge": "Design",
        "description": "Diseño y formateo del contenido del libro.", "time": "2 horas", "difficulty": "Media",
        "subtasks": [
            {
                "id": "kdp_02_01_setup", "title": "Configurar documento", "points": 5, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("kdp_02_01_setup_s01", "Definir tamaño y sangrado", "### 📏 Dimensiones\nElige un tamaño estándar (ej. 8.5x11 pulg). Añade 0.125 pulg de sangrado si las imágenes tocan el borde."),
                    create_step("kdp_02_01_setup_s02", "Márgenes de seguridad", "### 🛡️ Márgenes\nDeja al menos 0.375 pulg de margen interior para que no se coma el texto al encuadernar.")
                ]
            },
            {
                "id": "kdp_02_02_layout", "title": "Maquetar páginas", "points": 10, "time": "1.5 horas", "difficulty": "Media",
                "steps": [
                    create_step("kdp_02_02_layout_s01", "Paginar correctamente", "### 🔢 Numeración\nNo numeres las páginas en blanco o de título. Empieza en el contenido."),
                    create_step("kdp_02_02_layout_s02", "Exportar PDF Print", "### 📤 PDF\nExporta en PDF/X-1a:2001 o 'High Quality Print'.")
                ]
            }
        ]
    },
    {
        "id": "kdp_04_qa", "title": "Revisión y Copia de Prueba", "points": 10, "badge": "QA",
        "description": "Control de calidad físico antes del lanzamiento.", "time": "1 hora", "difficulty": "Fácil",
        "subtasks": [
            {
                "id": "kdp_04_01_preview", "title": "Previewer Online", "points": 5, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("kdp_04_01_preview_s01", "Revisar errores", "### 🔍 Previewer\nUsa el KDP Previewer. Busca líneas rojas que indiquen cortes.")
                ]
            },
            {
                "id": "kdp_04_02_proof", "title": "Pedir copia física", "points": 5, "time": "10 min", "difficulty": "Fácil",
                "steps": [
                    create_step("kdp_04_02_proof_s01", "Encargar Author Copy", "### 📦 Pedido\nPide una copia de autor. Tarda 1-2 semanas. Revisa el papel y los colores.")
                ]
            }
        ]
    },
    {
        "id": "kdp_07_marketing", "title": "Marketing y A+", "points": 20, "badge": "Ads",
        "description": "Potenciar las ventas con contenido enriquecido.", "time": "2 horas", "difficulty": "Media",
        "subtasks": [
            {
                "id": "kdp_07_01_aplus", "title": "Crear Contenido A+", "points": 10, "time": "1 hora", "difficulty": "Media",
                "steps": [
                    create_step("kdp_07_01_aplus_s01", "Diseñar módulos", "### 🖼️ Módulos\nDiseña banners de 970x300 px mostrando el interior del libro."),
                    create_step("kdp_07_01_aplus_s02", "Aplicar a ASINs", "### 🔗 Vincular\nSube el contenido en KDP Marketing y asígnalo a tu libro.")
                ]
            },
            {
                "id": "kdp_07_02_ads", "title": "Amazon Ads Básico", "points": 10, "time": "1 hora", "difficulty": "Media",
                "steps": [
                    create_step("kdp_07_02_ads_s01", "Campaña Auto", "### 🤖 Auto Ads\nCrea una campaña automática con puja baja (0.20€) para recolectar datos.")
                ]
            }
        ]
    }
]

seo_extra = [
    {
        "id": "ps_02_tech", "title": "Setup Técnico (SSG)", "points": 15, "badge": "Tech",
        "description": "Infraestructura para generar miles de páginas.", "time": "2 horas", "difficulty": "Difícil",
        "subtasks": [
            {
                "id": "ps_02_01_framework", "title": "Elegir Framework", "points": 5, "time": "30 min", "difficulty": "Media",
                "steps": [
                    create_step("ps_02_01_framework_s01", "Instalar Astro/Hugo", "### 🚀 Framework\nUsa Astro para mayor flexibilidad o Hugo para velocidad extrema.")
                ]
            },
            {
                "id": "ps_02_02_git", "title": "Repositorio", "points": 5, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("ps_02_02_git_s01", "Init Repo", "### 🐙 Git\nInicializa git y conecta con GitHub.")
                ]
            }
        ]
    },
    {
        "id": "ps_05_seo_tech", "title": "SEO Técnico Onpage", "points": 15, "badge": "SEO",
        "description": "Optimización técnica masiva.", "time": "2 horas", "difficulty": "Difícil",
        "subtasks": [
            {
                "id": "ps_05_01_sitemap", "title": "Sitemap Dinámico", "points": 5, "time": "1 hora", "difficulty": "Media",
                "steps": [
                    create_step("ps_05_01_sitemap_s01", "Generar sitemap.xml", "### 🗺️ Sitemap\nAsegúrate de que tu script genere un sitemap index si superas las 50k URLs.")
                ]
            },
            {
                "id": "ps_05_02_schema", "title": "Schema Markup", "points": 5, "time": "1 hora", "difficulty": "Media",
                "steps": [
                    create_step("ps_05_02_schema_s01", "JSON-LD", "### 🤖 Schema\nInyecta JSON-LD de 'Article' o 'Product' en cada plantilla.")
                ]
            }
        ]
    },
    {
        "id": "ps_06_monetization", "title": "Monetización", "points": 10, "badge": "Money",
        "description": "Integración de anuncios y afiliados.", "time": "1 hora", "difficulty": "Media",
        "subtasks": [
            {
                "id": "ps_06_01_ads", "title": "Adsense/Ezoic", "points": 5, "time": "30 min", "difficulty": "Media",
                "steps": [
                    create_step("ps_06_01_ads_s01", "Placeholders", "### 💰 Ads\nDeja huecos en tu layout para los banners.")
                ]
            }
        ]
    }
]

music_extra = [
    {
        "id": "music_02_stack", "title": "Setup Herramientas IA", "points": 15, "badge": "Stack",
        "description": "Instalación del software necesario.", "time": "1.5 horas", "difficulty": "Media",
        "subtasks": [
            {
                "id": "music_02_01_rvc", "title": "RVC / Applio", "points": 5, "time": "45 min", "difficulty": "Media",
                "steps": [
                    create_step("music_02_01_rvc_s01", "Instalar Applio", "### 🎤 RVC\nInstala Applio o RVC localmente para clonación de voz.")
                ]
            },
            {
                "id": "music_02_02_daw", "title": "DAW", "points": 5, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("music_02_02_daw_s01", "Instalar Reaper", "### 🎚️ DAW\nDescarga Reaper (es 'gratis' y potente).")
                ]
            }
        ]
    },
    {
        "id": "music_03_trend", "title": "Análisis de Tendencias", "points": 10, "badge": "Trend",
        "description": "Descubrir qué sonidos son virales.", "time": "1 hora", "difficulty": "Media",
        "subtasks": [
            {
                "id": "music_03_01_tiktok", "title": "TikTok Charts", "points": 5, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("music_03_01_tiktok_s01", "Buscar sonidos virales", "### 📈 Charts\nUsa el Creative Center de TikTok para ver canciones populares.")
                ]
            }
        ]
    },
    {
        "id": "music_05_voice", "title": "Producción Vocal IA", "points": 20, "badge": "Voice",
        "description": "Creación y mezcla de voces sintéticas.", "time": "2 horas", "difficulty": "Difícil",
        "subtasks": [
            {
                "id": "music_05_01_dataset", "title": "Grabar Dataset", "points": 10, "time": "1 hora", "difficulty": "Media",
                "steps": [
                    create_step("music_05_01_dataset_s01", "Grabar a capella", "### 🎙️ Grabación\nGraba 5-10 min de voz limpia, sin reverb.")
                ]
            },
            {
                "id": "music_05_02_train", "title": "Entrenar Modelo", "points": 10, "time": "1 hora", "difficulty": "Difícil",
                "steps": [
                    create_step("music_05_02_train_s01", "Entrenamiento RVC", "### 🏋️ Train\nEntrena el modelo por 200-300 epochs.")
                ]
            }
        ]
    },
    {
        "id": "music_06_mix", "title": "Mezcla y Master", "points": 15, "badge": "Mix",
        "description": "Pulido final del audio.", "time": "1.5 horas", "difficulty": "Media",
        "subtasks": [
            {
                "id": "music_06_01_eq", "title": "EQ y Compresión", "points": 7, "time": "45 min", "difficulty": "Media",
                "steps": [
                    create_step("music_06_01_eq_s01", "Limpiar frecuencias", "### 🎛️ EQ\nCorta los graves (<30Hz) y limpia el barro (200-300Hz).")
                ]
            },
            {
                "id": "music_06_02_master", "title": "Mastering IA", "points": 8, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("music_06_02_master_s01", "Landr/Bandlab", "### 🔊 Master\nUsa un servicio de mastering AI para alcanzar -14 LUFS.")
                ]
            }
        ]
    },
    {
        "id": "music_10_freelance", "title": "Servicios Freelance", "points": 15, "badge": "Service",
        "description": "Vender servicios musicales en plataformas.", "time": "1 hora", "difficulty": "Fácil",
        "subtasks": [
            {
                "id": "music_10_01_fiverr", "title": "Crear Gig Fiverr", "points": 8, "time": "45 min", "difficulty": "Media",
                "steps": [
                    create_step("music_10_01_fiverr_s01", "Redactar Gig", "### 💼 Fiverr\nOfrece 'I will create a custom lo-fi song for your stream'.")
                ]
            }
        ]
    },
    {
        "id": "music_11_patreon", "title": "Comunidad", "points": 10, "badge": "Fans",
        "description": "Monetización directa de fans.", "time": "1 hora", "difficulty": "Fácil",
        "subtasks": [
            {
                "id": "music_11_01_tiers", "title": "Definir Niveles", "points": 5, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("music_11_01_tiers_s01", "Beneficios", "### 🎁 Rewards\nOfrece descargas de WAVs y stems exclusivos.")
                ]
            }
        ]
    },
    {
        "id": "music_12_iterar", "title": "Optimización Continua", "points": 10, "badge": "Growth",
        "description": "Análisis y mejora.", "time": "1 hora", "difficulty": "Media",
        "subtasks": [
            {
                "id": "music_12_01_stats", "title": "Analizar Spotify for Artists", "points": 5, "time": "30 min", "difficulty": "Fácil",
                "steps": [
                    create_step("music_12_01_stats_s01", "Ver Save Rate", "### 📊 Stats\nSi el Save Rate es > 40%, vas bien. Si no, mejora la intro.")
                ]
            }
        ]
    }
]

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for bus in data['businesses']:
    if bus['key'] == 'kdp_publishing':
        bus['tasks'].extend(kdp_extra)
        bus['tasks'].sort(key=lambda x: x['id'])
    elif bus['key'] == 'programmatic_seo':
        bus['tasks'].extend(seo_extra)
        bus['tasks'].sort(key=lambda x: x['id'])
    elif bus['key'] == 'music_arbitrage':
        bus['tasks'].extend(music_extra)
        bus['tasks'].sort(key=lambda x: x['id'])

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Tasks updated successfully.")
