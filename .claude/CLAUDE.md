# Instructions for Claude in adapto-ui

adapto-ui is a Vue 3 + TypeScript component library installed as a plugin (`AdaptoPlugin`), with a token-based theming system (`Atlas` base theme) and SCSS styles injected at runtime (no static CSS build).

## Architecture

- `src/core/`: internal engine, independent of Vue.
  - `init.ts`: `initFramework()` — merges the `Atlas` theme with overrides, normalizes tokens and injects styles.
  - `create-utils.ts`: helpers exposed to components — `cx(...names)`, `cv(name)`, `getVar(name)`.
  - `inject-css.ts`: inserts `<style>` into the `<head>` at runtime and avoids duplicates (the dedup key is `${prefix}:${moduleId}`).
  - `themes/Atlas.ts`: default theme/tokens. `types/`: token and theme types.
- `src/lib/`: public plugin API.
  - `components/<category>/adpt-<name>/`: one component per folder, kebab-case with the `adpt-` prefix, grouped by category (`element/`, `form/`, `overlay/`). Contains `index.vue` and, if it needs its own styles, `style.scss`.
  - `composables/useFramework.ts`: access to the framework helpers (`fw.cx`, `fw.cv`, `fw.getVar`) via `provide/inject`.
  - `composables/useStyle.ts`: injects the component's `style.scss` on its first render. This is what lets an unused component's CSS drop out of the bundle.
  - `directives/`: global directives (`v-ripple`, `v-click-outside`).
  - `styles/`: tokens and base styles in Sass/CSS.
  - `index.ts`: build entry point. Exports `AdaptoPlugin` **and every component** as a named export (`AdaptoButton`, `AdaptoSelect`, …). A component not exported here does not exist for consumers.
  - `plugin.ts`: `AdaptoPlugin.install()` — registers only the global styles (`tokens` and `main`), the directives, and exposes `fw` through `app.provide`. It does **not** register per-component styles.
- `sandbox/app/`: Vue development app, a workspace package (declared under `packages:` in `pnpm-workspace.yaml`), linked via `adapto-ui: workspace:*`. It is gitignored.

## Conventions when creating or editing components

- Path: `src/lib/components/<category>/adpt-<name>/index.vue`, kebab-case folder with the `adpt-` prefix under a category folder. Use `src/lib/components/element/adpt-button/index.vue` as the reference pattern.
- File order: `<script setup lang="ts">` then `<template>`. Styles do **not** go in a component `<style>` block: they live in `style.scss` next to `index.vue`.
- The component injects its own CSS. Inside `<script setup>`, next to `useFramework()`:

  ```ts
  import { useStyle } from '@/lib/composables/useStyle'
  import css from './style.scss?raw'

  const fw = useFramework()
  useStyle('<id>', css)
  ```

  `<id>` is the style module identifier (`'button'`, `'select'`, …) and ends up in the `data-fw` attribute of the injected `<style>`. Do **not** register it in `src/lib/plugin.ts`: that array is for global styles only, and putting a component there pushes it back into every consumer's bundle.
- Export the component from `src/lib/index.ts` (`export { default as Adapto<Name> } from './components/<category>/adpt-<name>/index.vue'`). Without that line the component is not part of the public API and never reaches `dist`.
- `defineOptions({ name: 'Adapto<Name>' })` — follow this naming pattern (note: `adpt-dialog` currently uses `VkDialog`, an inherited inconsistency, not a pattern to copy).
- Type props and emits explicitly with `PropType`/concrete types; avoid `any`.
- If the component needs the framework helpers, use `useFramework()` imported through the `@/lib/composables/useFramework` alias.
- Semantic, accessible markup by default: roles, `aria-*`, focus and keyboard handling.

## Packaging and build

- `pnpm build-only` chains `build:js` (vite) and `build:types` (`vue-tsc -p tsconfig.lib.json` → `dist/types`). Both must stay green: type errors in the library scope break the published declarations.
- `vue`, `lucide-vue-next` and `dayjs` are `peerDependencies` and are marked `external` in `vite.config.ts`. Never move them back into `dependencies`: bundling Vue duplicates the instance and breaks `provide/inject`, which is exactly what `useFramework()` relies on.
- The `external` predicate also covers subpaths (`dayjs/locale/*`). CJS/UMD subpaths that get bundled emit a `require()` call that throws in the browser.
- `package.json` declares `"sideEffects": false`. Keep library modules free of top-level side effects, otherwise consumers' bundlers may drop code that was actually needed.
- Adding a third-party runtime dependency is a packaging decision: it must be externalized and declared as a peer, or it lands whole in every consumer's bundle.

## General rules

- Do not modify `src/App.vue` or `src/main.ts` unless explicitly asked (they are the development playground, not the library).
- Focused changes consistent with the existing architecture; prefer simple, composable solutions over over-engineered ones.
- Package manager: `pnpm`. Relevant commands: `pnpm lint` (oxlint + eslint), `pnpm format` (prettier), `pnpm test:unit` (vitest), `pnpm test:e2e` (playwright), `pnpm type-check` (vue-tsc), `pnpm build-only` (bundle + declarations).
- Tests live in `__tests__/` folders next to the code they cover, using `vitest` + `@vue/test-utils`.
- Known limitation: under vitest, `import css from './style.scss?raw'` resolves to an empty string, so style injection cannot be asserted in unit tests. Verify styling through a build or the sandbox instead.
- The sandbox consumes `dist`, not the sources — including its types. After changing the library, run `pnpm build-only` or the sandbox will keep showing the previous state.

## Agentic infrastructure

Subagents live in `.claude/agents/` and orchestrations in `.claude/skills/`, each split by scope:
`adapto/` for anything that depends on the adpt-* component convention, the Atlas token pipeline,
or this repo's build/tooling setup — which today is everything. A future agent or skill with no
such dependency (e.g. commit-message conventions, a generic Vue 3 pattern reviewer) goes in
`agents/generic/` or `skills/generic/` instead; create that folder only when the first one lands,
not before. The subfolder is organizational only — it does not become part of the invocation name
(`/component-docs`, not `/adapto:component-docs`), since Claude Code resolves identity from the
`name:` frontmatter field for agents and from the skill directory name for skills.

- **Review** (`component-review`): `component-review-types`, `component-review-props` and
  `component-review-a11y` in parallel → `component-review-report` consolidates and scores 0-10 per area.
- **Documentation** (`component-docs`): `component-api-extractor` extracts the factual API (1 call)
  → one `component-docs-writer` per component in parallel → the orchestration applies the shared
  registries in `config.ts`/`theme/index.ts` and verifies with `pnpm docs:build`.
- **Release** (`release-readiness`): reuses the above in audit mode →
  `release-readiness-report`.

Model policy, when adding or modifying an agent:

- `haiku` for mechanical or purely formatting work: data extraction and aggregators that only
  reformat text they already receive.
- `sonnet` for judgment or generation: the three reviewers, the docs/tests/e2e writers and
  `core-tokens-review`.
- None uses `opus`. Always declare `model:` — omitting it inherits the session model and blows up
  the cost.
- Always declare `tools:` with the minimum needed. The aggregators carry `tools: Glob` on purpose:
  they cannot read code, run commands or write, which is precisely their contract.

## Response style

- Reply in Spanish in the chat.
- Keep documentation, comments in new code, test names/descriptions and prompt files in English where reasonable, unless the user explicitly asks otherwise.
