# Skills y subagentes: por qué el modelo es bidireccional

> Documento de arquitectura interna. Registra por qué la infraestructura agéntica de
> `.claude/` está montada como está, y en particular por qué las orquestaciones son **skills** que
> despachan subagentes, y no al revés.

## El planteamiento que este documento descarta

Circula una lectura intuitiva del modelo de Claude Code que suena razonable pero es incorrecta:

> Una skill define "qué hay que saber hacer" (conocimiento procedimental) y no debería spawnear ni
> controlar la ejecución de nada. Un subagente define "quién lo ejecuta y con qué contexto
> aislado", y es el subagente quien debe aplicar skills durante su trabajo — nunca al revés.

La segunda mitad es cierta. La primera no, y la conclusión ("nunca al revés") contradice la
documentación oficial. Conviene dejarlo escrito porque la asimetría *parece* una regla de diseño
limpia, y reaparece cada vez que alguien revisa esta carpeta con ojos nuevos.

## Lo que dice la documentación oficial

En [Extend Claude with skills](https://code.claude.com/docs/en/skills), sección *Run skills in a
subagent*:

> **Skills and subagents work together in two directions:**
>
> | Approach | System prompt | Task | Also loads |
> |---|---|---|---|
> | Skill with `context: fork` | From agent type | SKILL.md content | CLAUDE.md, except when the agent is Explore or Plan |
> | Subagent with `skills` field | Subagent's markdown body | Claude's delegation message | Preloaded skills + CLAUDE.md |

Y en [Create custom subagents](https://code.claude.com/docs/en/sub-agents), sobre el campo
`skills:`:

> This is the **inverse** of running a skill in a subagent. With `skills` in a subagent, the
> subagent controls the system prompt and loads skill content. With `context: fork` in a skill,
> the skill content is injected into the agent you specify. **Both use the same underlying
> system.**

No es una tolerancia ni un atajo: el front-matter de skill tiene campos dedicados y documentados
para elegir subagente ejecutor — `context: fork`, `agent:`, `background:`. Anthropic incluso
publica un ejemplo canónico (`deep-research`, una skill que corre en un agente `Explore`). La
documentación de subagentes describe además el anidamiento explícito ("Let subagents spawn their
own subagents", hasta tres niveles por defecto).

## El argumento decisivo: una skill no ejecuta nada

Por encima de la cita, hay un hecho de arquitectura que disuelve el problema entero.

**Un `SKILL.md` no tiene capacidad de ejecución.** Es texto que se inyecta en el contexto de quien
la invoca. Cuando `component-review/SKILL.md` dice "invoca estos tres agentes en paralelo", quien
emite las llamadas `Agent` es la conversación principal, no la skill. No existe "la skill
spawneando un subagente" — no es una mala práctica, es una imposibilidad. La skill es la
*receta*; el agente que la lee es el *cocinero*.

Por tanto "las skills no deben orquestar" no describe ninguna restricción real. Lo que de verdad
se está preguntando es: *¿puede un procedimiento reutilizable incluir, entre sus pasos, "delega
esto"?* Y la respuesta obvia es sí. Un runbook de despliegue que dice "pide a QA que valide en
staging" no deja de ser un runbook por mencionar a QA.

## Por qué mover la orquestación a subagentes sería peor aquí

Se evaluó la alternativa —convertir cada orquestación en un subagente orquestador que despacha a
los especialistas— y se descartó por coste sin contrapartida:

- **Una capa de resumen extra.** El reporte final pasaría por otra síntesis antes de llegar al
  usuario. `component-review-report` está diseñado precisamente para que los hallazgos lleguen sin
  filtrar (su rúbrica de puntuación depende de recibirlos verbatim); interponer otro agente los
  degrada.
- **Consume un nivel de anidamiento.** El límite por defecto es de tres capas bajo la conversación
  principal. Gastar una en un orquestador que no aporta aislamiento reduce el margen disponible.
- **Herramientas recortadas en background.** La documentación restringe el conjunto de
  herramientas de un subagente en segundo plano. Un orquestador lanzado así puede perder acceso a
  utilidades que sus pasos necesitan.
- **No añade aislamiento.** El motivo de existir de un subagente es sacar trabajo verboso del
  contexto principal. Los reviewers ya están aislados; el orquestador solo maneja punteros de
  alcance y texto de reportes. Aislar eso no ahorra contexto — lo duplica.

El criterio que la propia documentación da para elegir subagente ("the task produces verbose
output you don't need in your main context", "you want to enforce specific tool restrictions") lo
cumplen los diez agentes de `.claude/agents/adapto/`. No lo cumple un orquestador.

## Cómo queda el modelo en este repositorio

Ambas direcciones, cada una donde aporta:

**skill → subagente** (las tres orquestaciones)

`component-review`, `component-docs` y `release-readiness` son procedimientos multi-paso cuyos
pasos despachan agentes vía la herramienta Agent. Llevan `disable-model-invocation: true`: cuestan
varias llamadas y `component-docs` escribe ficheros, así que se invocan a propósito con `/nombre`,
nunca por auto-detección.

**subagente → skill** (los tres generadores)

`component-docs-writer`, `component-test-writer` y `component-e2e-writer` declaran
`skills: [adpt-component-conventions]`. Esa skill es conocimiento de referencia puro —estructura de
carpetas, la arquitectura `useFramework`/`useStyle`, el contrato de exportación, los ficheros a
imitar— sin un solo paso de orquestación. Se inyecta entera al arrancar el agente, lo que evita
duplicar esas convenciones en cada cuerpo de agente.

Una advertencia de la documentación aplica aquí: `context: fork` solo tiene sentido en skills con
instrucciones accionables. Una skill de solo directrices, como
`adpt-component-conventions`, sirve como contexto precargado pero devolvería vacío como target de
un fork. Y a la inversa: una skill con `disable-model-invocation: true` **no puede precargarse**
vía `skills:`, porque la precarga toma del mismo conjunto que Claude puede invocar. Por eso la
bandera está en las orquestaciones y no en la skill de referencia.

## Regla práctica

Para decidir dónde va algo nuevo:

| Si es… | va en… |
|---|---|
| Un procedimiento con pasos, que puede incluir "delega X" | una **skill** en `.claude/skills/adapto/` |
| Conocimiento factual que varios agentes necesitan | una **skill de referencia**, precargada con `skills:` |
| Un trabajador con contexto aislado y herramientas restringidas | un **subagente** en `.claude/agents/adapto/` |

La pregunta útil no es "¿quién puede llamar a quién?" sino **"¿esto necesita su propia ventana de
contexto?"**. Si la respuesta es no, es una skill.

## Referencias

- [Extend Claude with skills](https://code.claude.com/docs/en/skills) — *Run skills in a subagent*,
  *Control who invokes a skill*, tabla de front-matter.
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) — *Preload skills into
  subagents*, *Let subagents spawn their own subagents*, *Run subagents in foreground or
  background*.
