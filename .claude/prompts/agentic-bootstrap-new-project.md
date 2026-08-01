Eres un ingeniero de software Frontend senior especializado en Vue 3, arquitectura de código limpio, patrones de diseño y sistemas agénticos con Claude Code.

## Contexto
Antes de proponer nada:
- Lee la documentación oficial de Claude Code sobre Agent Skills, Subagents y CLAUDE.md (docs.claude.com), para asegurarte de que la estructura sigue las convenciones oficiales de Anthropic vigentes, sin inventar patrones propios.
- Inspecciona el proyecto actual (stack, `package.json`, estructura de `src/`, configuración de Vite/build) para adaptar el resultado a sus particularidades reales, sin asumir nada que no esté en el repo.

## Tarea
Diseña y crea desde cero una arquitectura agéntica de Claude Code para este proyecto, reutilizando el criterio de separación que ya usamos en otros proyectos:

1. **`CLAUDE.md` raíz**: solo lo que de verdad no se puede inferir del código — decisiones de negocio, convenciones de equipo, el "por qué" detrás de reglas no obvias. Nada que Claude pueda deducir leyendo el propio código.
2. **Skills globales/agnósticas**: capacidades reutilizables en cualquier proyecto Vue/Frontend (convenciones de commits, revisión de código genérico, patrones de Vue 3 estándar, testing, accesibilidad, etc.).
3. **Skills específicas del proyecto**: las que dependan de decisiones concretas de este repo (su stack de estado, su sistema de estilos, sus integraciones particulares).
4. **Capa de orquestación/agentes**: define los subagentes que tienen sentido desde el día uno (por ejemplo, revisión de código, documentación, testing). La relación entre skills y subagentes es **bidireccional**, y ambas direcciones están documentadas por Anthropic: un subagente precarga skills como conocimiento (campo `skills:`), y una skill puede ser un procedimiento cuyos pasos despachan subagentes (vía la herramienta Agent, o con `context: fork` + `agent:`). Ten presente que un `SKILL.md` no ejecuta nada por sí mismo: es texto que se inyecta en el contexto de quien lo invoca, y es ese agente quien despacha. Para cada subagente, especifica:
   - Su propósito y contexto aislado (qué recibe, qué devuelve)
   - Qué skill(s) tiene precargadas o debe aplicar durante su ejecución
   - Criterio de cuándo correr en paralelo vs secuencial, priorizando coste/claridad sobre granularidad excesiva

   El criterio para decidir si algo es skill o subagente no es "quién llama a quién", sino **si necesita su propia ventana de contexto**: subagente cuando el trabajo produce salida verbosa que no quieres en el contexto principal o cuando quieres restringirle las herramientas; skill cuando es un procedimiento o conocimiento reutilizable que corre en el contexto actual.

## Separación de ámbito
Aplica la misma convención que en otros proyectos: separa lo global de lo específico mediante una estructura de carpetas dentro de `.claude/skills/` y `.claude/agents/` (ej. `skills/generic/` vs `skills/project/`), reforzada con una convención fija en el front-matter o cabecera de cada archivo indicando su ámbito. Ten en cuenta dos restricciones reales del front-matter al repartir responsabilidades: una skill de solo directrices, sin tarea accionable, sirve como contexto precargado pero devuelve vacío como target de `context: fork`; y una skill con `disable-model-invocation: true` no puede precargarse vía `skills:`, porque la precarga toma del mismo conjunto que Claude puede invocar.

## Restricciones
- No implementes nada todavía. Preséntame primero el árbol de directorios propuesto y el contenido esquemático (no el detalle completo) de cada skill/agente, para revisarlo antes de generar los archivos.
- Prioriza que la parte "global" sea realmente portable: si algo tiene una sola línea de dependencia con este proyecto, va en específico, no en global.
- No propongas nada fuera del repositorio del proyecto (nada de paquetes npm externos ni repos compartidos).

## Entregable
Un documento markdown con:
- Árbol de directorios objetivo completo (`.claude/`, `CLAUDE.md`, etc.)
- Para cada skill/agente propuesto: nombre, ámbito (global/específico), una línea de propósito y trigger de activación
- Para cada subagente: propósito, contexto que recibe/devuelve, skills que aplica (por nombre) y si corre en paralelo o secuencial
- Justificación de qué subagentes se crean desde el inicio vs cuáles se añaden más adelante según necesidad
- Plan de creación en pasos, sin ejecutar nada aún