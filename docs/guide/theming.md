# Styling & Theming

Adapto UI has no static CSS build: every style — global tokens, base styles, and each
component's own stylesheet — is injected into `<head>` at runtime when [`AdaptoPlugin`](../../src/lib/plugin.ts)
is installed and as components render. This page covers how that pipeline works and how to
control light/dark mode.

## How styles reach the page

- **`src/core/`** is the engine: it normalizes theme tokens into CSS custom properties and
  inserts `<style>` tags into the document. It has no Vue dependency.
- **`AdaptoPlugin.install()`** calls `initFramework()` once, which injects two global blocks:
  the `tokens` stylesheet (all `--adapto-*` custom properties) and the `main` stylesheet (resets,
  utility classes). It also registers the `v-ripple`/`v-click-outside` directives and exposes the
  framework helpers via `provide('fw', fw)`.
- **Per-component styles are not part of that global bundle.** Each `adpt-*` component imports
  its own `style.scss` and injects it the first time it renders, via `useStyle()`:

  ```ts
  import { useStyle } from '@/lib/composables/useStyle'
  import css from './style.scss?raw'

  useStyle('button', css)
  ```

  `useStyle()` calls the same `injectCSS()` used internally for the global blocks, keyed by
  `${prefix}:${moduleId}` to avoid inserting the same block twice. The practical effect: a
  component you never render never injects its CSS, and the bundler can drop the module entirely
  because the library declares `"sideEffects": false`.

## Tokens and the helpers

Theme tokens come in three layers, defined in [`Atlas`](../../src/core/themes/Atlas.ts) and
normalized by `initFramework()` into flat custom properties:

| Layer       | Example source                          | Resulting CSS variable      |
| ----------- | ---------------------------------------- | ---------------------------- |
| Primitive   | `green.500`                              | `--adapto-green-500`         |
| Semantic    | `primary.500` (→ `green.500`)            | `--adapto-primary-500`       |
| Component   | `btn.bg` (→ `sm.primary.100`)            | `--adapto-btn-bg`             |

Semantic and component tokens are emitted as `var(...)` references to the layer below them
rather than resolved values, so changing a primitive or semantic variable at runtime cascades
through everything that depends on it — this is exactly what makes dark mode possible without
re-injecting any component stylesheet.

Inside a component, [`useFramework()`](../../src/lib/composables/useFramework.ts) exposes three
helpers built on top of the configured `prefix`:

| Helper           | Example                          | Result                              |
| ----------------- | --------------------------------- | ------------------------------------ |
| `fw.cx(...names)` | `fw.cx('btn', 'primary')`         | `'adapto-btn adapto-primary'`        |
| `fw.cv(name)`      | `fw.cv('color-primary')`          | `'var(--adapto-color-primary)'`      |
| `fw.getVar(name)`  | `fw.getVar('color-primary')`      | the computed value read from `:root` |

## Dark mode

`Atlas` defines a `dark` mode alongside its base (light) tokens:

```ts
// src/core/themes/Atlas.ts
export const Atlas: ThemeOptions = {
  // ...
  darkModeSelector: 'dark-mode',
  modes: {
    light: { semantic: {} },
    dark: {
      semantic: {
        primary: { 50: 'green.950', /* ... */ 950: 'green.50' },
        // ...
      },
    },
  },
}
```

`initFramework()` normalizes `modes.dark.semantic` the same way it normalizes the base tokens,
and injects it as a second block scoped under the configured selector, right after the `:root`
block:

```css
:root {
  --adapto-primary-100: var(--adapto-green-100);
  --adapto-btn-bg: var(--adapto-primary-100);
  /* ... */
}

.dark-mode {
  --adapto-primary-100: var(--adapto-green-900);
  /* ... */
}
```

Because component tokens like `--adapto-btn-bg` reference `--adapto-primary-100` rather than a
resolved color, adding the `dark-mode` class to `<html>` re-points every dependent variable
through normal CSS cascade — no component needs to know dark mode exists.

### Toggling the mode

Once `AdaptoPlugin` is installed, dark mode can be controlled from anywhere in the consuming
app, without needing a Vue component:

```ts
import { applyThemeMode, getSystemThemeMode, getStoredThemeMode, storeThemeMode } from 'adapto-ui'

// Apply a mode immediately (defaults to Atlas's darkModeSelector, 'dark-mode')
applyThemeMode('dark')

// Persist the choice for future page loads (defaults to Atlas's prefix, 'adapto')
storeThemeMode('dark')

// Read back what was stored, or fall back to the OS preference
const mode = getStoredThemeMode() ?? getSystemThemeMode()
```

These are plain functions from `src/core/theme-mode.ts` — no Vue, no reactivity, safe to call
during app bootstrap (e.g. in `main.ts`, before mounting) as well as from event handlers.

`initFramework()` already calls this logic once on install, applying whichever mode was
previously stored or, if none was, the OS's `prefers-color-scheme`. So a returning visitor sees
the correct mode before any component renders.

### Inside a component

[`useFramework()`](../../src/lib/composables/useFramework.ts) exposes the same behavior bound to
the app's configured `prefix`/`darkModeSelector`, handy for building a toggle:

```vue
<script setup lang="ts">
import { useFramework } from '@/lib/composables/useFramework'

const fw = useFramework()
</script>

<template>
  <button @click="fw.toggleMode()">Toggle theme</button>
</template>
```

| Method                | Description                                                                 |
| ---------------------- | ----------------------------------------------------------------------------- |
| `fw.setMode(mode)`      | Applies `'light'` or `'dark'` and persists it.                               |
| `fw.toggleMode()`       | Flips between light and dark based on the class currently on `<html>`.       |
| `fw.getInitialMode()`   | Stored mode, or the OS preference if nothing was stored yet.                 |

### Custom `prefix` or `darkModeSelector`

If the app installs the plugin with a non-default `prefix` or `darkModeSelector`:

```ts
app.use(AdaptoPlugin, { prefix: 'myapp', darkModeSelector: 'theme-dark' })
```

the standalone functions need those same values passed explicitly, since they can't read the
plugin's install options on their own:

```ts
applyThemeMode('dark', 'theme-dark')
storeThemeMode('dark', 'myapp')
getStoredThemeMode('myapp')
```

`fw.setMode()`/`fw.toggleMode()` via `useFramework()` don't need this — they already close over
the app's actual configuration.

::: warning No SSR guard needed on your side
Every function in `theme-mode.ts` already no-ops when `document`/`window`/`localStorage` are
unavailable, so they're safe to import in an SSR entry point. They simply do nothing until they
run in a browser.
:::
