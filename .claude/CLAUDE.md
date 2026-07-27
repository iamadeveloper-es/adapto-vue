# Instrucciones para Claude en adapto-ui

adapto-ui es una librería de componentes Vue 3 + TypeScript instalable como plugin (`AdaptoPlugin`), con un sistema de theming basado en tokens (tema base `Atlas`) y estilos SCSS inyectados en runtime (no build de CSS estático).

## Arquitectura

- `src/core/`: motor interno, independiente de Vue.
  - `init.ts`: `initFramework()` — combina el tema `Atlas` con overrides, normaliza tokens e inyecta estilos.
  - `create-utils.ts`: helpers expuestos a los componentes — `cx(...names)`, `cv(name)`, `getVar(name)`.
  - `inject-css.ts`: inserta `<style>` en el `<head>` en tiempo de ejecución y evita duplicados.
  - `themes/Atlas.ts`: tema/tokens por defecto. `types/`: tipos de tokens y tema.
- `src/lib/`: API pública del plugin.
  - `components/<categoría>/adpt-<nombre>/`: un componente por carpeta, en kebab-case con prefijo `adpt-`, agrupado por categoría (`element/`, `form/`, `overlay/`). Contiene `index.vue` y, si necesita estilos propios, `style.scss`.
  - `composables/useFramework.ts`: da acceso a los helpers del framework (`fw.cx`, `fw.cv`, `fw.getVar`) vía `provide/inject`.
  - `directives/`: directivas globales (`v-ripple`, `v-click-outside`).
  - `styles/`: tokens y estilos base en Sass/CSS.
  - `plugin.ts`: `AdaptoPlugin.install()` — registra en la app los estilos (tokens + globales + por componente), las directivas, y expone `fw` con `app.provide`.
- `sandbox/app/`: aplicación Vue de desarrollo con su propio `package.json` (workspace aparte, ver `pnpm-workspace.yaml`), usada para probar la librería.

## Convenciones al crear o editar componentes

- Ruta: `src/lib/components/<categoría>/adpt-<nombre>/index.vue`, carpeta en kebab-case con prefijo `adpt-` bajo una carpeta de categoría. Usa `src/lib/components/element/adpt-button/index.vue` como referencia de patrón.
- Orden del archivo: `<script setup lang="ts">` y `<template>`. Los estilos **no** van en un bloque `<style>` del componente: viven en `style.scss` junto al `index.vue` y se registran en el array `styles` de `src/lib/plugin.ts` (ver `adpt-button` y `adpt-dialog`).
- `defineOptions({ name: 'Adapto<Nombre>' })` — sigue este patrón de nombre (nota: `adpt-dialog` actualmente usa `VkDialog`, es una inconsistencia heredada, no un patrón a copiar).
- Tipa props y emits explícitamente con `PropType`/tipos concretos; evita `any`.
- Si el componente necesita los helpers del framework, usa `useFramework()` importándolo con el alias `@/lib/composables/useFramework`.
- Markup semántico y accesible por defecto: roles, `aria-*`, manejo de foco y teclado.

## Reglas generales

- No modifiques `src/App.vue` ni `src/main.ts` a menos que se pida explícitamente (son el playground de desarrollo, no la librería).
- Cambios enfocados y consistentes con la arquitectura existente; prioriza soluciones simples y componibles sobre las sobre-diseñadas.
- Gestor de paquetes: `pnpm`. Comandos relevantes: `pnpm lint` (oxlint + eslint), `pnpm format` (prettier), `pnpm test:unit` (vitest), `pnpm test:e2e` (playwright), `pnpm type-check` (vue-tsc).
- Tests en carpetas `__tests__/` junto al código que cubren, con `vitest` + `@vue/test-utils`.

## Infraestructura agéntica

Los subagentes viven en `.claude/agents/` y las orquestaciones en `.claude/skills/public/`.

- **Revisión** (`component-review`): `component-review-types`, `component-review-props` y
  `component-review-a11y` en paralelo → `component-review-report` consolida y puntúa 0-10 por área.
- **Documentación** (`component-docs`): `component-api-extractor` extrae la API factual (1 llamada)
  → un `component-docs-writer` por componente en paralelo → la orquestación aplica los registros
  compartidos de `config.ts`/`theme/index.ts` y verifica con `pnpm docs:build`.
- **Release** (`release-readiness`): reutiliza las anteriores en modo auditoría →
  `release-readiness-report`.

Política de modelos, al añadir o modificar un agente:

- `haiku` para trabajo mecánico o de puro formato: extracción de datos y agregadores que solo
  reformatean texto que ya reciben.
- `sonnet` para juicio o generación: los tres revisores, los writers de docs/tests/e2e y
  `core-tokens-review`.
- Ninguno usa `opus`. Declara siempre `model:` — omitirlo hereda el modelo de sesión y dispara el
  coste.
- Declara siempre `tools:` con el mínimo necesario. Los agregadores llevan `tools: Glob` a
  propósito: no pueden leer código, ejecutar comandos ni escribir, que es justo su contrato.

## Estilo de respuesta

- Responde en español en el chat.
- Mantén documentación, comentarios de código nuevo, nombres/descripciones de tests y archivos de prompts en inglés cuando sea razonable, salvo que el usuario pida lo contrario explícitamente.
