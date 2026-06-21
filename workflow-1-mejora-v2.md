# WORKFLOW 1 (v2) — Mejora de Proyecto Existente

> Con sistema de memoria persistente, prompts autocontenidos y fase creativa mejorada
> Maikel — Canary AI / Xcirculars — Junio 2026

-----

## 🧠 SISTEMA DE MEMORIA — LEE ESTO PRIMERO

Este workflow está diseñado para correr **completo, de punta a punta**, en una sola sesión larga o en varias sesiones separadas en el tiempo. Como OpenCode compacta contexto o puede perder la sesión, cada fase debe **leer y escribir** un archivo de memoria persistente.

### Paso 0 — Crear el archivo de memoria (SIEMPRE PRIMERO, una sola vez por proyecto)

Ejecuta este prompt al arrancar el workflow en un proyecto nuevo:

```
Crea el archivo .agents/memory/PROJECT_MEMORY.md en la raíz del proyecto con esta estructura exacta:

# MEMORIA DEL PROYECTO — [completar con nombre]

## VARIABLES DEL PROYECTO
- proyecto_nombre:
- proyecto_descripcion:
- proyecto_audiencia:
- proyecto_stack:
- proyecto_tono_marca:
- direccion_visual_elegida:
- paleta_colores:
- tipografia_elegida:
- skill_estilo_principal: (high-end-visual-design / minimalist-ui / otro)
- anti_patrones_a_evitar:
- vistas_principales: (lista de páginas/componentes clave del proyecto)
- flujos_criticos: (lista de user flows que deben testearse)

## ESTADO ACTUAL
- fase_actual:
- paso_actual:
- ultima_actualizacion:

## LOG DE PROGRESO
(cada fase completada se anota aquí con fecha, skill usada, decisiones tomadas, archivos modificados/creados)

## DECISIONES CLAVE
(decisiones de diseño/arquitectura que no deben repetirse o cuestionarse en fases futuras)

## PENDIENTES / BLOQUEOS
(cualquier cosa que quedó a medias o requiere decisión del usuario)

Una vez creado, confirma el contenido y pregúntame las VARIABLES DEL PROYECTO que aún no conoces antes de continuar a la Fase 0.
```

### Regla de oro para TODAS las fases siguientes

Cada prompt de fase en este documento empieza asumiendo que el agente debe:

1. **Leer `.agents/memory/PROJECT_MEMORY.md` completo antes de hacer nada.**
1. Si una variable que necesita ya está rellenada en memoria → **usarla directamente, no volver a preguntarla.**
1. Si una variable nueva surge durante la fase (ej. se elige una paleta de colores) → **escribirla en memoria inmediatamente**, no esperar al final.
1. Al terminar la fase → **actualizar `fase_actual`, `paso_actual`, agregar entrada al LOG DE PROGRESO con fecha, qué skill se usó, qué se decidió, qué archivos se tocaron.**
1. Si la fase queda incompleta (por límite de contexto, error, o decisión pendiente del usuario) → **anotarlo en PENDIENTES/BLOQUEOS antes de cortar.**

Para retomar el trabajo en cualquier momento, el prompt de re-entrada es simplemente:

```
Lee .agents/memory/PROJECT_MEMORY.md y continúa el workflow desde donde quedó.
No repitas fases ya marcadas como completas en el LOG DE PROGRESO.
```

-----

## FASE 0 — SETUP DEL ENTORNO

### Paso 1: Configurar OpenCode + Memoria

**Skill:** `customize-opencode`

```
Lee .agents/memory/PROJECT_MEMORY.md si existe. Si no existe, créalo según la
estructura del sistema de memoria del workflow antes de continuar.

Usa customize-opencode para configurar este proyecto completo:
- Detecta el stack automáticamente (package.json, requirements.txt, etc.) y
  guárdalo en proyecto_stack dentro de la memoria.
- Configura el agente principal disponible (ollama local u otro).
- Configura MCP servers relevantes si están disponibles.
- Genera AGENTS.md con contexto del proyecto para futuras sesiones.

Al terminar, actualiza PROJECT_MEMORY.md: fase_actual = "0-setup completa",
agrega entrada al log con la fecha y el stack detectado.
```

### Paso 2: Inicializar Impeccable y completar variables de marca

**Skill:** `impeccable`

```
Lee .agents/memory/PROJECT_MEMORY.md primero.

Ejecuta /impeccable init para este proyecto. Durante el proceso interactivo,
captura las respuestas y guárdalas inmediatamente en las VARIABLES DEL
PROYECTO de PROJECT_MEMORY.md: proyecto_nombre, proyecto_descripcion,
proyecto_audiencia, proyecto_tono_marca.

No me preguntes nada que ya esté rellenado en la memoria — solo completa lo
que falte.

Al terminar, actualiza fase_actual = "0-impeccable init completa" y agrega
entrada al log.
```

-----

## FASE 1 — AUDITORÍA VISUAL (Diagnóstico completo, sin omisiones)

### Paso 3: Auditoría UX exhaustiva

**Skill:** `ui-ux-pro-max`

```
Lee .agents/memory/PROJECT_MEMORY.md — usa proyecto_nombre, proyecto_stack y
vistas_principales si ya están definidas. Si vistas_principales está vacío,
recorre el código del proyecto (rutas, componentes de página, App Router /
Pages Router según corresponda) y construye tú mismo la lista completa de
vistas. Guárdala en proyecto_memory bajo vistas_principales.

Usa ui-ux-pro-max para auditar TODAS las vistas del proyecto sin excepción,
incluyendo estados: loading, error, vacío, y variantes responsive (mobile
375px, tablet 768px, desktop 1440px) para cada una. No te limites a la vista
principal — recorre cada ruta/componente de página que encuentres en el
proyecto.

Analiza en cada vista:
- Consistencia visual (spacing, colores, tipografía) vs. lo que haya definido
  en design system si existe
- Contraste y accesibilidad (WCAG AA mínimo, navegación por teclado, aria-labels)
- Touch targets en mobile (mínimo 44x44px)
- Jerarquía visual y escaneo en F/Z pattern
- Patrones UX rotos, ausentes, o inconsistentes entre vistas

Entrega un reporte único, organizado por vista, priorizado: crítico /
importante / mejora. Guarda el reporte como AUDIT_REPORT.md en la raíz.

Al terminar, actualiza PROJECT_MEMORY.md: fase_actual = "1-auditoria completa",
agrega entrada al log referenciando AUDIT_REPORT.md, y anota en PENDIENTES
cualquier hallazgo crítico que requiera decisión mía antes de continuar.
```

### Paso 4: Critique de diseño + detección de anti-patrones

**Skill:** `impeccable`

```
Lee .agents/memory/PROJECT_MEMORY.md, incluyendo AUDIT_REPORT.md si existe.

Ejecuta /impeccable critique sobre TODO el proyecto, no solo un componente.
Recorre cada vista listada en vistas_principales.

Luego ejecuta detección de anti-patrones en código:
npx impeccable detect src/   (ajusta la ruta según la estructura real)

Consolida ambos resultados en un único listado de "AI tells" y problemas de
código por archivo, ordenado por severidad.

Agrega anti_patrones_a_evitar en PROJECT_MEMORY.md con la lista concreta
detectada (ej: "gradiente purple-blue en CTAs", "Inter en todo el texto",
"cards anidadas en dashboard"), para que ninguna fase futura los repita.

Actualiza fase_actual = "1-critique completa" y agrega entrada al log.
```

-----

## FASE 2 — DEFINICIÓN DE SISTEMA DE DISEÑO

### Paso 5: Marca

**Skill:** `ckm: brand`

```
Lee .agents/memory/PROJECT_MEMORY.md completo, usa proyecto_nombre,
proyecto_descripcion, proyecto_audiencia y proyecto_tono_marca ya definidos —
no los vuelvas a preguntar.

Usa ckm:brand para definir o refinar la identidad de marca completa de
[proyecto_nombre]. Si ya existe una paleta/logo previo en el repo (busca en
/public, /assets, tailwind.config), tómalo como punto de partida y evoluciona
en vez de reemplazar desde cero, salvo que detectes que contradice
proyecto_tono_marca.

Entrega:
- Paleta primaria, secundaria, semántica (error/success/warning/info)
- Voz textual: 3-5 reglas concretas de cómo se escribe en la marca
- Aplicación: cómo se ve la marca en UI vs. en marketing

Guarda paleta_colores en PROJECT_MEMORY.md con los valores hex exactos.
Actualiza fase_actual = "2-brand completa", agrega entrada al log.
```

### Paso 6: Design System completo

**Skill:** `ckm: design-system`

```
Lee .agents/memory/PROJECT_MEMORY.md, usa paleta_colores y proyecto_tono_marca
ya definidos.

Usa ckm:design-system para crear el design system completo de
[proyecto_nombre], cubriendo TODOS los aspectos sin omitir ninguno:
- Tokens de color (CSS custom properties, incluyendo dark mode si el
  proyecto lo requiere — revisa si ya hay soporte dark mode en el código)
- Escala tipográfica completa (display, h1-h6, body, caption, con
  line-height y font-weight para cada uno)
- Escala de spacing en grid de 4 u 8px
- Sombras/elevación (mínimo 3 niveles)
- Radio de bordes (mínimo 3 niveles: sm/md/lg)
- Breakpoints responsive completos
- Estados de interacción (hover/focus/active/disabled) para botones, inputs,
  links, cards

Implementa los tokens directamente en el archivo de configuración real del
proyecto (tailwind.config.js / globals.css / theme.ts, según el stack).

Guarda tipografia_elegida en PROJECT_MEMORY.md.
Actualiza fase_actual = "2-design-system completa", agrega entrada al log
listando los archivos modificados.
```

-----

## FASE 3 — DIRECCIÓN VISUAL DEL REDISEÑO

### Paso 7: Análisis de qué conservar/cambiar

**Skill:** `redesign-existing-projects`

```
Lee .agents/memory/PROJECT_MEMORY.md completo, incluyendo AUDIT_REPORT.md y
anti_patrones_a_evitar.

Usa redesign-existing-projects para analizar [proyecto_nombre] completo.
Recorre cada vista en vistas_principales y clasifica cada una en:
- CONSERVAR (funciona bien, no tocar)
- MEJORAR (estructura ok, ejecución visual floja)
- REDISEÑAR (estructura y visual ambos requieren cambio)

No partas de cero en ningún caso — siempre ten en cuenta lo que ya existe
y por qué fue construido así antes de proponer cambios.

Guarda el plan como REDESIGN_PLAN.md.
Actualiza fase_actual = "3-plan rediseño completo", agrega entrada al log.
```

### Paso 8: Generar direcciones visuales

**Skill:** `design-taste-frontend`

```
Lee .agents/memory/PROJECT_MEMORY.md completo: proyecto_nombre,
proyecto_descripcion, proyecto_audiencia, proyecto_stack, paleta_colores,
tipografia_elegida y anti_patrones_a_evitar.

Usa design-taste-frontend para [proyecto_nombre]. Genera 3 direcciones
visuales completamente distintas en HTML real, cada una con lógica y
filosofía de diseño diferente (no solo paleta distinta).

Restricciones obligatorias en las 3:
- Deben respetar paleta_colores y tipografia_elegida ya definidos
- Deben evitar TODOS los anti_patrones_a_evitar listados en memoria
- Deben aplicarse a la vista marcada como REDISEÑAR de mayor prioridad en
  REDESIGN_PLAN.md (no a una landing genérica)

Preséntalas numeradas con una línea explicando la lógica de cada una.
```

Tras revisar, responde con tu elección y este prompt cierra la fase:

```
Elijo la dirección [N]. [ajustes si los hay].

Guarda en PROJECT_MEMORY.md: direccion_visual_elegida con la descripción
completa de la lógica de diseño elegida (no solo el número, sino el "por qué"
y sus reglas: tipo de layout, uso de espacio, tono de las imágenes, etc.)
para que las fases siguientes la apliquen sin volver a preguntar.

Determina también skill_estilo_principal: si la dirección elegida es premium/
corporativa, anota "high-end-visual-design"; si es limpia/funcional, anota
"minimalist-ui". Guárdalo en memoria.

Actualiza fase_actual = "3-direccion elegida", agrega entrada al log.
```

### Paso 9: Profundizar estilo

**Skill:** según `skill_estilo_principal` guardado en memoria (auto-selección, no preguntar)

```
Lee .agents/memory/PROJECT_MEMORY.md y usa el valor de skill_estilo_principal
para decidir automáticamente si aplicas high-end-visual-design o
minimalist-ui — no me preguntes cuál usar, ya está decidido.

Aplica esa skill sobre direccion_visual_elegida para profundizar las reglas
de ejecución: cómo se comportan las imágenes, el peso tipográfico en
distintos contextos, el uso de espacio negativo, y el tratamiento de
componentes complejos (tablas, formularios, navegación) bajo esa misma
lógica.

Actualiza fase_actual = "3-estilo profundizado", agrega entrada al log.
```

-----

## FASE 4 — PROTOTIPADO HI-FI

### Paso 10: Prototipos de todas las vistas marcadas para rediseño

**Skill:** `huashu-design`

```
Lee .agents/memory/PROJECT_MEMORY.md completo: direccion_visual_elegida,
paleta_colores, tipografia_elegida, anti_patrones_a_evitar, y REDISEÑO_PLAN.md.

Usa huashu-design para crear un prototipo HTML hi-fi de CADA vista marcada
como REDISEÑAR o MEJORAR en REDESIGN_PLAN.md, en orden de prioridad. No te
detengas en una sola vista — recorre la lista completa en esta misma fase.

Para cada prototipo, sin que tenga que pedírtelo cada vez:
- Aplica fielmente direccion_visual_elegida
- Incluye TODOS los estados relevantes de esa vista: vacío, cargando, con
  datos, error (revisa el componente real para saber qué estados maneja)
- Hazlo clickeable con transiciones reales, no mockup estático
- Si la vista tiene versión mobile relevante (revisa si el proyecto es
  responsive o tiene app companion), incluye también el frame mobile

Guarda cada prototipo en /design/prototypes/[nombre-vista].html

Actualiza fase_actual = "4-prototipos completos", agrega entrada al log
listando cada vista prototipada.
```

-----

## FASE 5 — IMPLEMENTACIÓN Y REFINAMIENTO

### Paso 11: Implementación guiada completa

**Skills:** `ckm: ui-styling` + `frontend-design`

```
Lee .agents/memory/PROJECT_MEMORY.md completo: direccion_visual_elegida,
paleta_colores, tipografia_elegida, anti_patrones_a_evitar.

Usa ckm:ui-styling y frontend-design juntas para implementar en código real
TODAS las vistas prototipadas en /design/prototypes/, una por una, sin
saltarte ninguna.

Para cada vista, sin que tenga que especificártelo:
- Usa los tokens del design system ya implementado (no valores hardcoded)
- Implementa TODOS los estados de interacción: hover, focus, active,
  disabled, en cada elemento interactivo
- Implementa TODOS los breakpoints responsive (mobile/tablet/desktop)
- Implementa dark mode si el design system lo define
- Verifica accesibilidad: contraste WCAG AA, navegación por teclado,
  aria-labels en elementos no semánticos
- Evita explícitamente cada anti-patrón en anti_patrones_a_evitar

Modifica los archivos reales del proyecto, no crees archivos paralelos.

Actualiza PROJECT_MEMORY.md tras cada vista completada (no esperes a
terminar todas) — agrega entrada al log por cada archivo modificado, así si
la sesión se corta, sabemos exactamente dónde retomar.
```

### Paso 12: Polish final

**Skill:** `impeccable`

```
Lee .agents/memory/PROJECT_MEMORY.md para saber qué vistas ya se
implementaron en el paso anterior.

Ejecuta sobre cada una de esas vistas, en orden:
/impeccable polish [archivo]
/impeccable accessibility [archivo]

Al final de recorrer todas, ejecuta /impeccable audit sobre el proyecto
completo para confirmar que no quedó nada pendiente.

Actualiza fase_actual = "5-implementacion completa", agrega entrada al log
con el resultado del audit final.
```

-----

## FASE 6 — TESTING

### Paso 13: Verificación visual + tests E2E completos

**Skills:** `browser-act` → `playwright-core` → `playwright-pom` → `playwright-ci`

```
Lee .agents/memory/PROJECT_MEMORY.md completo: vistas_principales y
flujos_criticos. Si flujos_criticos está vacío, infiérelos tú mismo
recorriendo el código (autenticación, creación/edición de recursos
principales del dominio, pagos si existen, formularios críticos) y
guárdalos en memoria antes de continuar.

1. Usa browser-act para recorrer visualmente cada vista en vistas_principales
   sobre el entorno local corriendo. Toma screenshot de cada una. Reporta
   cualquier diferencia visual entre lo implementado y direccion_visual_elegida.

2. Usa playwright-core para escribir tests E2E que cubran TODOS los
   flujos_criticos, no solo el principal. Incluye manejo de errores y
   estados vacíos en cada flujo. TypeScript, locators por rol/label.

3. Usa playwright-pom para reorganizar esos tests en Page Objects: una clase
   por vista en vistas_principales, fixtures reutilizables, helpers de
   acciones comunes.

4. Usa playwright-ci para configurar la ejecución automática en
   [GitHub Actions/GitLab — revisa qué usa el repo], con sharding y
   artifacts en fallos (screenshots + traces).

Actualiza fase_actual = "6-testing completo", agrega entrada al log con la
cobertura de flujos lograda.
```

-----

## FASE 7 — ASSETS DE MARKETING (versión mejorada)

> Esta fase fue rediseñada para producir resultados visualmente más creativos:
> investiga referencias reales antes de diseñar, combina una skill de
> copywriting publicitario con la de diseño visual, y usa generación de
> imágenes para ilustraciones/fotos en vez de solo composición tipográfica.

### Paso 14: Investigación de referencias (NUEVO — siempre antes de diseñar)

```
Lee .agents/memory/PROJECT_MEMORY.md: proyecto_nombre, proyecto_descripcion,
proyecto_audiencia, direccion_visual_elegida.

Busca en la web 6-8 ejemplos reales de banners/anuncios/campañas exitosas
de productos o servicios similares a [proyecto_nombre] dirigidos a
[proyecto_audiencia]. Prioriza ejemplos recientes (2025-2026) de marcas
reconocidas en el mismo sector o en sectores con audiencia similar.

Para cada ejemplo, anota en una sección nueva de PROJECT_MEMORY.md llamada
"REFERENCIAS CREATIVAS":
- Qué patrón visual usan (jerarquía, dónde está el CTA, uso de espacio)
- Qué emoción o gancho usan en el copy
- Qué tipo de imagen usan (foto real, ilustración, 3D, producto aislado)

No copies ningún elemento de marca de terceros (logos, colores exactos de
marca ajena) — usa esto solo como inspiración de PATRÓN, no de contenido.

Actualiza fase_actual = "7-investigacion completa", agrega entrada al log.
```

### Paso 15: Copy publicitario

**Skill nueva recomendada:** `ad-creative` (de coreyhaines31/marketingskills)

Instalación si aún no la tienes:

```bash
npx skills add coreyhaines31/marketingskills --skill ad-creative -a opencode
```

```
Lee .agents/memory/PROJECT_MEMORY.md completo, incluyendo REFERENCIAS
CREATIVAS del paso anterior.

Usa ad-creative para generar copy publicitario para [proyecto_nombre],
dirigido a [proyecto_audiencia], en el tono definido en proyecto_tono_marca.

Genera para cada formato necesario (banner web, post cuadrado 1080x1080,
story vertical 1080x1920, [agrega otros si el proyecto lo requiere]):
- 3 variantes de headline (gancho directo al beneficio, no genérico)
- 1 línea de soporte/subtítulo por variante
- CTA específico y accionable (no "Click aquí" — algo como
  "Probar gratis" / "Agenda tu demo" según el objetivo real del banner)

Aplica los patrones de gancho emocional identificados en REFERENCIAS
CREATIVAS, adaptados a la voz de marca, sin copiar texto ajeno.

Guarda el copy en /marketing/copy-[campaña].md.
Actualiza el log en PROJECT_MEMORY.md.
```

### Paso 16: Generación de imágenes/ilustraciones para el banner

```
Lee .agents/memory/PROJECT_MEMORY.md: paleta_colores, direccion_visual_elegida,
REFERENCIAS CREATIVAS.

Busca o genera imágenes/ilustraciones para el banner de [proyecto_nombre]
que coincidan con el tipo de imagen identificado como efectivo en
REFERENCIAS CREATIVAS (foto real, ilustración flat, 3D render, etc., según
lo que mejor encaje con proyecto_audiencia).

Si el proyecto tiene una skill de generación de imágenes propia (imagegen),
úsala. Si no, busca referencias visuales de alta calidad como guía de
composición y estilo antes de pasar al diseño final.

La imagen debe dejar espacio negativo deliberado para el texto del banner
(no centrar el sujeto si el copy va a superponerse) — sigue el patrón de
composición de las referencias guardadas.

Guarda los assets en /marketing/assets/.
```

### Paso 17: Composición final del banner

**Skill:** `ckm: banner-design`

```
Lee .agents/memory/PROJECT_MEMORY.md completo: paleta_colores,
tipografia_elegida, direccion_visual_elegida, y REFERENCIAS CREATIVAS.

Usa ckm:banner-design para componer el banner final de [proyecto_nombre]
combinando:
- El copy generado en /marketing/copy-[campaña].md
- Las imágenes/ilustraciones de /marketing/assets/
- paleta_colores y tipografia_elegida del design system

Aplica reglas de banner de alto rendimiento sin que tengas que pedírselo
cada vez:
- Jerarquía clara en secuencia: Gancho → Valor → CTA, en ese orden visual
- CTA con color complementario al fondo para máximo contraste (no del
  mismo tono que el resto del banner)
- Un único elemento "héroe" — si la imagen es protagonista, el texto es
  secundario, y viceversa; nunca compiten ambos por la atención
- Espacio en blanco deliberado — no llenar cada centímetro
- Logo/marca presente pero no dominante (esquina o footer del banner)
- Genera en TODOS los formatos: 1200x630 (OG/web), 1080x1080 (feed),
  1080x1920 (story), 728x90 (leaderboard si aplica a banner web)

Genera 2-3 variantes de composición (no solo de copy) para poder elegir
la más fuerte visualmente.

Guarda en /marketing/banners/.
Actualiza fase_actual = "7-banners completos", agrega entrada al log.
```

### Paso 18 (si aplica): Demo animado / video promocional

**Skill:** `huashu-design`

```
Lee .agents/memory/PROJECT_MEMORY.md: direccion_visual_elegida, REFERENCIAS
CREATIVAS, y el copy de /marketing/copy-[campaña].md.

Usa huashu-design para crear un demo animado de 30-45 segundos del flujo
principal de [proyecto_nombre], pensado para usarse como video promocional
en redes.

Estructura obligatoria (sigue el patrón de campañas exitosas de
REFERENCIAS CREATIVAS):
1. Hook inicial (0-3s): el problema o la promesa central, fuerte y directo
2. Demostración (mayor parte): el producto resolviendo ese problema en
   pantalla, con transiciones suaves entre pasos
3. Cierre con CTA (últimos 3-5s): texto + el mismo CTA usado en los banners

Mantén coherencia visual total con los banners ya generados — misma
paleta, misma tipografía, mismo tono.

Exporta como MP4 y GIF (el GIF para feeds que no soportan video, el MP4
para reels/stories).

Guarda en /marketing/video/.
Actualiza fase_actual = "7-video completo", agrega entrada final al log de
toda la Fase 7.
```

-----

## CIERRE DE WORKFLOW

```
Lee .agents/memory/PROJECT_MEMORY.md completo.

Genera un resumen ejecutivo final: qué se hizo en cada fase, qué archivos
se crearon o modificaron, qué decisiones de diseño se tomaron y por qué,
y qué quedó pendiente (si algo).

Guárdalo en PROJECT_MEMORY.md bajo una sección "RESUMEN FINAL" y muéstramelo.
```

-----

## NOTA SOBRE WORKFLOW 2 (Crear desde cero)

Aplica exactamente el mismo sistema de memoria: el Paso 0 de creación de
`PROJECT_MEMORY.md` va primero, cada fase lee/escribe memoria, y los
prompts de la Fase 7 (marketing) mejorados de este documento reemplazan
los del documento original.

-----

*Actualizado para Maikel — Canary AI / Xcirculars — Junio 2026 (v2: memoria persistente + prompts autocontenidos + fase creativa con investigación de referencias)*