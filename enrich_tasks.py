import json
import os

file_path = r'c:\Users\d.ramos\Proyectos\Proyectos\web\data\tasks.json'

def enrich_data():
    if not os.path.exists(file_path):
        print("tasks.json not found")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    businesses = data.get('businesses', [])
    
    for b in businesses:
        for t in b.get('tasks', []):
            # Task level
            t_time = t.get('time', '1 hora')
            t_diff = t.get('difficulty', 'Media')
            
            for s in t.get('subtasks', []):
                # Subtask level
                s_time = s.get('time', t_time)
                s_diff = s.get('difficulty', t_diff)
                
                # Ensure subtask has these if missing
                if 'time' not in s: s['time'] = s_time
                if 'difficulty' not in s: s['difficulty'] = s_diff
                if 'description' not in s: s['description'] = s.get('title', '')
                
                for st in s.get('steps', []):
                    # Step level
                    # Inherit from subtask
                    if 'time' not in st: st['time'] = s_time
                    if 'difficulty' not in st: st['difficulty'] = s_diff
                    
                    # Description if missing
                    if 'description' not in st:
                        st['description'] = f"Paso clave para completar: {s['title']}."

                    # Enrich Guide if it looks too simple
                    guide = st.get('guide', '')
                    if "###" in guide and len(guide) < 150:
                        # Append a generic tips section
                        st['guide'] = guide + "\n\n### 💡 Tips\n* Tómate tu tiempo para revisar los detalles.\n* Si tienes dudas, consulta la documentación oficial o usa IA para generar ideas."
                    
                    # Specific fix for "Esquema" (fanvue_03_02_caption_s01)
                    if st.get('id') == "fanvue_03_02_caption_s01":
                         st['guide'] = """### 🏷️ Formato
Define una estructura consistente para tus prompts.
Por ejemplo: `[Sujeto], [Acción], [Entorno], [Iluminación], [Estilo], [Cámara]`.

### 📝 Ejemplo
> "Mujer joven de 25 años, pelo rubio, mirando a cámara, sonriendo, en una cafetería moderna, luz natural suave, fotografía realista, 8k, alta definición."

### ⚠️ Importante
Mantén siempre las mismas características físicas (pelo, ojos, cuerpo) para asegurar la consistencia del personaje."""

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("Enriched tasks.json")

if __name__ == "__main__":
    enrich_data()
