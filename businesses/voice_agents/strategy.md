# Proyecto: Agentes de Voz IA para Ventas y Soporte

## 📋 Concepto
Implementar sistemas de telefonía inteligente que pueden mantener conversaciones humanas fluidas para agendar citas, confirmar pedidos o dar soporte técnico básico.

## 🛠️ Stack Tecnológico
- **Motores de Voz**: Bland AI (el más rápido), Vapi o Retell AI.
- **Latencia**: Buscar proveedores con menos de 800ms de respuesta para que parezca natural.
- **Integración**: n8n para conectar la llamada con el calendario (Google Calendar/Calendly).

## 🚀 Plan de Ejecución
1. **Fase 1: Guion**: Diseñar un árbol de decisión para la conversación (Qué decir si el cliente dice A o B).
2. **Fase 2: Clonación**: Usar ElevenLabs para crear una voz de marca amigable y profesional.
3. **Fase 3: Piloto**: Configurar un número de teléfono y probar con 50 leads antiguos de un cliente.
4. **Fase 4: Modelo de Negocio**: Cobrar por cita agendada con éxito (modelo de éxito).

## 💡 Factores de Éxito
- **Naturalidad**: Evitar que el bot parezca un robot de los años 90.
- **Objetivo Único**: El bot no debe intentar resolver la vida del cliente, solo cumplir una misión (ej: "Confirmar asistencia").
- **Manejo de Objeciones**: Entrenar al modelo para manejar el "no tengo tiempo" o "llámame más tarde".
