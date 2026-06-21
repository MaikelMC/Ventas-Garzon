-----

## description: Ejecuta el workflow completo de mejora de proyecto, fase por fase, deteniéndose tras cada fase para confirmación
agent: build

Vas a ejecutar el workflow completo definido en @workflow-1-mejora-v2.md sobre este proyecto.

REGLAS OBLIGATORIAS DE EJECUCIÓN (no negociables, no las omitas bajo ninguna circunstancia):

1. Ejecuta las fases EN ORDEN, empezando por el Paso 0 (creación/lectura de
   .agents/memory/PROJECT_MEMORY.md) si aún no se ha hecho.
1. Al terminar CADA fase (no cada paso individual, cada FASE completa según
   la numeración del documento — Fase 0, Fase 1, Fase 2… Fase 7):
- Actualiza .agents/memory/PROJECT_MEMORY.md como indica el documento.
- Muestra un resumen breve de lo que se hizo en esa fase (qué archivos
  se crearon/modificaron, qué decisiones se tomaron).
- DETENTE. Termina tu turno ahí. No empieces la siguiente fase.
- Pregunta explícitamente: “¿Continúo con la Fase [N+1]: [nombre]?”
1. NUNCA avances a la fase siguiente sin que yo responda explícitamente
   “continuar”, “sí”, “dale” o equivalente en un mensaje nuevo. Esto aplica
   incluso si técnicamente podrías seguir trabajando — la pausa es
   intencional para que yo revise el resultado de cada fase.
1. Si en cualquier momento te encuentras con un error, una decisión
   ambigua que no está resuelta en PROJECT_MEMORY.md, o un bloqueo:
- NO improvises ni asumas la respuesta.
- Anótalo en la sección PENDIENTES/BLOQUEOS de la memoria.
- Detente y pregúntame directamente qué hacer, antes de continuar esa
  fase o pasar a la siguiente.
1. Si retomamos esta sesión después de un corte de contexto o compactación,
   y me ves escribir simplemente “continuar workflow” o usar este comando
   de nuevo: relee .agents/memory/PROJECT_MEMORY.md primero, identifica
   fase_actual, y retoma exactamente desde ahí — no repitas fases ya
   marcadas como completas en el LOG DE PROGRESO.

Si me das argumentos junto al comando (ej. el nombre del proyecto o una
fase específica de inicio), úsalos así: $ARGUMENTS

Empieza ahora con la Fase 0 (o la fase indicada en $ARGUMENTS si se
proporciona), siguiendo al pie de la letra los prompts detallados de cada
paso tal como están escritos en @workflow-1-mejora-v2.md.