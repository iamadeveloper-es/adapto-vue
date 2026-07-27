Mapa general

Dos capas: skills que orquestan (no analizan nada por sí mismas) y agentes que hacen el trabajo real.

.claude/
├── CLAUDE.md                    convenciones + política de modelos
├── skills/public/               4 orquestaciones  → se lanzan con /nombre
│   ├── component-review/
│   ├── component-docs/
│   ├── release-readiness/
│   └── create-vue-component/
└── agents/                      10 subagentes     → los invoca la skill, o tú en lenguaje natural

---
Pipeline 1 — Revisión de calidad

Se ejecuta con: /component-review adpt-checkbox · /component-review (toda la librería)

      resuelve scope (Glob src/lib/components/**/adpt-<name>)
                          │
        ┌─────────────────┼─────────────────┐   ← 3 en paralelo, 1 solo mensaje
   review-types      review-props      review-a11y
    (sonnet)           (sonnet)          (sonnet)
   any, PropType,    naming, defaults,  WCAG 2.1 AA,
   emits, refs       props muertos,     nombre accesible,
                     v-model            foco, teclado
        └─────────────────┼─────────────────┘
                          │  los 3 informes en crudo, verbatim
                  review-report (haiku, tools: Glob)
                  aplica rúbrica −3/−1.5/−0.5 desde 10
                          │
              informe en español con notas 0-10

Qué sale: por componente, veredicto + Tipado 8.5 · Props/API 10 · A11y 7; tabla global por área; aspectos de mejora en las tres áreas; lista priorizada final.

Detalle de ejecución: los 3 revisores enumeran su propia lista de ficheros, así que un run de librería completa siguen siendo 4 llamadas. El agregador no tiene herramientas de lectura — si la skill le pasa los informes filtrados o resumidos, las notas cambian y no puede recuperarlos. Por eso la skill dice explícitamente pasar verbatim.

---
Pipeline 2 — Documentación

Se ejecuta con: /component-docs adpt-dialog · /component-docs (todos)

      resuelve scope → lista concreta de componentes
                          │
              api-extractor (haiku)          ← 1 sola llamada, aunque sean 10 componentes
              ficha factual por componente:
              props/tipos/defaults, emits/payloads,
              slots, variantes, a11y presente,
              hijos y directivas que usa
                          │
        ┌─────────────────┼─────────────────┐   ← N en paralelo, lotes de 4-5 si >6
   docs-writer        docs-writer        docs-writer
    (sonnet)           (sonnet)           (sonnet)
   adpt-avatar.md     adpt-radio.md      adpt-dialog.md
   + "Registrations needed"  (no tocan ficheros compartidos)
        └─────────────────┼─────────────────┘
                          │
        la orquestación aplica config.ts + theme/index.ts
        (append, dedup — varios piden AdaptoIcon)
                          │
                   pnpm docs:build

Por qué así: el extractor es solo-lectura y su salida es compacta → escala en 1 llamada. El writer es generativo y cada página son 150-270 líneas → se shardea. Coste 1 + N.

Ficheros compartidos: con 1 componente no hay carrera y el writer registra él mismo. Con varios, la skill le dice "el orquestador es dueño de los compartidos" y el writer solo reporta qué entrada de sidebar y qué app.component(...) necesita.

Modo auditoría: pasos 1-2 normales, writers en verificación, sin build. Reporta página ausente / desactualizada (con los props concretos que difieren) / al día.

---
Pipeline 3 — Release readiness

Se ejecuta con: /release-readiness adpt-button · /release-readiness

        ┌──────────┬──────────────┬──────────────┐  ← 4 en paralelo, todo en modo auditoría
  /component-  test-writer    /component-    core-tokens-
    review      (audit)         docs           review
  (ya trae      qué falta      (audit)        (sonnet)
   notas 0-10)  cobertura     qué falta doc   Atlas.ts,
                                              refs colgantes
        └──────────┴──────────────┴──────────────┘
                          │
              release-readiness-report (haiku, tools: Glob)
                          │
              checklist ✅ Listo / ⚠️ Con observaciones / 🛑 No listo

Es una puerta de solo lectura. Detecta huecos, no los tapa. Si falta cobertura o doc, te lo dice y ofrece lanzar los writers en serio como paso siguiente explícito. Las notas 0-10 vienen ya calculadas del pipeline 1 y este agregador las arrastra sin recalcular.

core-tokens-review se lanza una sola vez sea cual sea el scope — audita Atlas.ts como unidad, no por componente.

---
Skill suelta — Creación

Se ejecuta con: /create-vue-component o simplemente pidiendo "crea un componente toggle".

No orquesta agentes: son las reglas de estructura (ruta con categoría, defineOptions, style.scss registrado en plugin.ts, import con alias @/lib/composables/useFramework). Al terminar te ofrece tests, docs y review como pasos separados.

---
Agentes que también funcionan sueltos

No hace falta pasar por una skill; se invocan describiendo la tarea:

┌─────────────────────────┬────────┬─────────────────────────────────────────────────┐
│         Agente          │ Modelo │                  Cómo lanzarlo                  │
├─────────────────────────┼────────┼─────────────────────────────────────────────────┤
│ component-test-writer   │ sonnet │ "escribe tests unitarios para adpt-radio"       │
├─────────────────────────┼────────┼─────────────────────────────────────────────────┤
│ component-e2e-writer    │ sonnet │ "cubre con Playwright el foco del dialog"       │
├─────────────────────────┼────────┼─────────────────────────────────────────────────┤
│ core-tokens-review      │ sonnet │ "audita los tokens de Atlas"                    │
├─────────────────────────┼────────┼─────────────────────────────────────────────────┤
│ component-api-extractor │ haiku  │ "extrae la API de adpt-tooltip"                 │
├─────────────────────────┼────────┼─────────────────────────────────────────────────┤
│ Los 3 revisores         │ sonnet │ "revisa solo la accesibilidad de adpt-checkbox" │
└─────────────────────────┴────────┴─────────────────────────────────────────────────┘

Los tres revisores sueltos devuelven su informe crudo sin puntuar — la rúbrica vive en el agregador, así que la nota 0-10 solo aparece pasando por /component-review.

Los dos agregadores no se invocan sueltos. No tienen forma de reunir hechos: tools: Glob les impide leer código. Fuera de su orquestación no producen nada útil.

---
Reglas que mantienen esto coherente

Están escritas en CLAUDE.md para que no se degrade al añadir agentes:

- Declara siempre model: — omitirlo hereda el modelo de sesión (Opus) y dispara el coste.
- haiku para extracción y agregación; sonnet para juicio y generación; nunca opus.
- Declara siempre tools: con el mínimo. Los agregadores llevan tools: Glob a propósito: su contrato de "no re-analizo nada" es estructural, no una promesa en el prompt.

Recordatorio: .claude/ sigue en .gitignore (línea 46), así que nada de esto se versiona todavía.