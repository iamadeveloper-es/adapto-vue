---
name: create-vue-component
description: Creates a Vue component under src/lib/components/<category>/ with the structure this repository expects.
---

# Creating a Vue component

When asked to create a Vue component in this repository, follow these rules:

1. Create the component at `src/lib/components/<category>/adpt-<component-name>/index.vue`.
   Components live under a category folder — today `element/`, `form/` and `overlay/` exist.
   Pick the one that fits; if none does, propose a new one to the user before creating it.
2. Use a kebab-case folder name with the `adpt-` prefix.
3. The `index.vue` file contains only a script block and a template block, in that order. Styles do
   not go in a component `<style>` block.
4. Prefer `<script setup lang="ts">` for the script section.
5. Use `defineOptions({ name: 'Adapto<Name>' })`, following the naming pattern of the existing
   components.
6. Keep the component simple, typed (avoid `any`) and aligned with the library's style.
7. If the component needs framework utilities, import `useFramework` through the
   `@/lib/composables/useFramework` alias — that is what the most recent components use
   (`adpt-checkbox`, `adpt-radio`, `adpt-card`, `adpt-avatar`).
8. If the component needs its own styles, create a `style.scss` next to `index.vue` and have the
   component inject it itself with `useStyle` (see below). Do **not** register it in
   `src/lib/plugin.ts`: that array is for global styles only, and adding a component there puts its
   CSS back into every consumer's bundle.
9. Export the component from `src/lib/index.ts`. Without that line it is not part of the public API
   and never reaches `dist`.
10. Do not modify App.vue or main.ts unless the user explicitly asks.
11. Always reply in Spanish.

## Expected file skeleton

```vue
<script setup lang="ts">
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'

const fw = useFramework()

useStyle('component-name', css)

const cmpClass = fw.cx('component-name')

defineOptions({
  name: 'Adapto<Name>',
})
</script>

<template>
  <div :class="cmpClass">
    <!-- markup -->
  </div>
</template>
```

Drop the `useStyle` call and the `css` import if the component has no styles of its own.

The `style.scss` sits next to `index.vue`:

```scss
.fw-component-name {
  /* styles */
}
```

The first argument to `useStyle` is the style module id (`'button'`, `'select'`, …). It ends up in
the `data-fw` attribute of the injected `<style>` and is the deduplication key, so it must be
unique across components.

Finally, register the export in `src/lib/index.ts` under its category:

```ts
export { default as AdaptoComponentName } from './components/<category>/adpt-component-name/index.vue'
```

## Additional guidance

- Keep the API small and easy to compose.
- Prefer accessible markup and semantic HTML.
- Follow the conventions of the button example at
  `src/lib/components/element/adpt-button/index.vue`.
- If the user needs specific behavior, implement a sensible default that is easy to extend.
- Do not add third-party runtime dependencies on your own: they have to be externalized in
  `vite.config.ts` and declared as `peerDependencies`, otherwise they land whole in every
  consumer's bundle. Raise it with the user first.

## After creating the component

The new component has no tests or documentation. Offer them as an explicit next step, without
running them on your own:

- `component-test-writer` for unit coverage.
- The `component-docs` skill for its VitePress page.
- The `component-review` skill for the scored quality review.

Note: under vitest, `import css from './style.scss?raw'` resolves to an empty string, so unit tests
cannot assert style injection. Do not write tests that depend on it.
