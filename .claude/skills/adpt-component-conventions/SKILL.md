---
name: adpt-component-conventions
description: Reference knowledge about how adpt-* components are structured in adapto-ui — folder layout under category subfolders, the useFramework/useStyle runtime-CSS architecture, the public export contract, and the reference files to imitate for source, tests and docs. Read-only background for any agent that reads, tests, documents or generates a component.
---

> **Scope:** Adapto UI-specific — describes the adpt-* component convention and the
> `useFramework`/`useStyle` architecture.

Reference material, not a procedure. It answers "how is a component put together in this repo?"
so an agent doesn't have to re-derive it by reading source. It contains no steps to execute and
prescribes no workflow of its own.

## Where components live

```
src/lib/components/<category>/adpt-<name>/
├── index.vue          # <script setup lang="ts"> then <template>. No <style> block.
└── style.scss         # optional; only if the component has its own styles

tests/lib/components/<category>/adpt-<name>/
└── index.spec.ts       # optional; vitest + @vue/test-utils
```

Unit tests do **not** live next to the component. They live under a top-level `tests/` folder
that mirrors the path of the file under test — the same way `e2e/` sits alongside `src/` instead
of inside it. Import the subject under test through the `@/` alias (`@/lib/components/...`), not
a relative path crossing from `tests/` back into `src/`.

- `<category>` is a real subfolder — today `element/`, `form/`, `overlay/`. **Never assume a flat
  path.** To find a component by name, glob `src/lib/components/**/adpt-<name>`; to enumerate all
  of them, glob `src/lib/components/**/adpt-*/index.vue`. New categories can appear without any
  agent needing an update, which is exactly why the glob is written this way.
- Folder names are kebab-case with the `adpt-` prefix. The exported symbol is PascalCase with the
  `Adapto` prefix: `adpt-button` → `AdaptoButton`.

## The runtime-CSS architecture

There is no static CSS build. Styles are injected into `<head>` at runtime, which is what lets an
unused component's CSS drop out of a consumer's bundle.

```ts
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'

const fw = useFramework()
useStyle('button', css) // first arg = style module id, also the dedup key
```

- `useFramework()` reads `fw` out of Vue's `provide`/`inject`, injected by `AdaptoPlugin.install()`.
  It exposes `cx(...names)`, `cv(name)` and `getVar(name)`. **A component mounted without that
  provide will fail** — anything that mounts a component in isolation has to supply an `fw` mock
  through `global.provide`.
- `useStyle(id, css)` injects the component's own CSS on first render. The id lands in the
  `data-fw` attribute of the injected `<style>` and is the dedup key, so it must be unique.
- Per-component styles are **never** registered in `src/lib/plugin.ts`. That array is for global
  styles (`tokens`, `main`) only; adding a component there pushes its CSS back into every
  consumer's bundle.

## The public API contract

A component that isn't exported from `src/lib/index.ts` does not exist for consumers and never
reaches `dist`:

```ts
export { default as AdaptoButton } from './components/element/adpt-button/index.vue'
```

Each component declares `defineOptions({ name: 'Adapto<Name>' })`. Note that `adpt-dialog`
currently declares `VkDialog` — an inherited inconsistency, not a pattern to copy.

Props and emits are typed explicitly with `PropType`/concrete types; `any` is treated as a defect.

## Packaging constraints

`vue`, `lucide-vue-next` and `dayjs` are `peerDependencies`, marked `external` in
`vite.config.ts` (the predicate also covers subpaths like `dayjs/locale/*`). Bundling Vue would
duplicate the instance and break the `provide`/`inject` that `useFramework()` depends on.
`package.json` sets `"sideEffects": false`, so library modules must stay free of top-level side
effects.

Adding a third-party runtime dependency is a packaging decision, never an incidental one: it has
to be externalized and declared as a peer, or it lands whole in every consumer's bundle.

## Reference files to imitate

| For | Read |
|---|---|
| Component source | `src/lib/components/element/adpt-button/index.vue` |
| Unit tests | `tests/lib/components/overlay/adpt-dialog/index.spec.ts` |
| Documentation page | `docs/components/adpt-button.md` |

## Known limitation: `?raw` under vitest

Under vitest, `import css from './style.scss?raw'` resolves to an **empty string**. Style
injection therefore cannot be asserted in a unit test — never write one that depends on it.
Verify styling through `pnpm build-only` or the sandbox instead.

## Commands

`pnpm lint` · `pnpm format` · `pnpm test:unit` · `pnpm test:e2e` · `pnpm type-check` ·
`pnpm build-only` (bundle + declarations) · `pnpm docs:build`.

`pnpm test:unit` runs with coverage enabled (`vitest.config.ts`, `coverage.thresholds`), scoped to
`src/lib/**` and `src/core/**`: `functions`/`branches`/`statements` must be 100%, `lines` allows at
most 10 uncovered lines project-wide.

The sandbox (`sandbox/app/`) consumes `dist`, including its types — not the sources. After
changing the library, `pnpm build-only` has to run or the sandbox keeps showing the previous
state.
