# Accordion

`adpt-accordion` is a collapsible content panel with a clickable header. It supports four visual
variants, five sizes, an optional (default) chevron icon that rotates on open, and an animated
height/opacity transition. It works either standalone, controlled via `v-model`, or as a child of
[`adpt-accordion-list`](./adpt-accordion-list), which coordinates mutually-exclusive opening
across a group of accordions.

- **Component name:** `AdaptoAccordion`
- **Source:** `src/lib/components/element/adpt-accordion/index.vue`
- **Styles:** `src/lib/components/element/adpt-accordion/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoAccordion` is
available globally:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

### Standalone, with `v-model`

Outside of an `adpt-accordion-list`, the open/closed state is driven entirely by the
`modelValue` prop — the component emits `update:modelValue` on header click instead of managing
any internal state:

<script setup>
import { ref } from 'vue'

const standaloneOpen = ref(false)
</script>

<div class="demo">
  <AdaptoAccordion
    v-model="standaloneOpen"
    color="primary-500"
    title="Click to toggle"
  >
    <p>This panel's open state is bound to a local <code>ref</code> via <code>v-model</code>.</p>
  </AdaptoAccordion>
  <span>modelValue: {{ standaloneOpen }}</span>
</div>

```vue-html
<AdaptoAccordion v-model="isOpen" color="primary-500" title="Click to toggle">
  <p>Panel content.</p>
</AdaptoAccordion>
```

```ts
import { ref } from 'vue'

const isOpen = ref(false)
```

### Inside `adpt-accordion-list`

When an `AdaptoAccordion` is nested inside an `AdaptoAccordionList`, it injects that list's
context and defers to it entirely: it reads its open state from the list's internal `opened` ref
(compared against its own auto-generated id) and calls the list's `toggle(id)` method on click.
In this mode the `modelValue` prop and `update:modelValue` emit are **ignored** — opening one item
closes any other item that was open, since the list only tracks a single open id at a time.

<div class="demo">
  <AdaptoAccordionList>
    <AdaptoAccordion color="primary-500" title="First item">
      <p>Only one of these three items can be open at a time.</p>
    </AdaptoAccordion>
    <AdaptoAccordion color="primary-500" title="Second item">
      <p>Opening this one closes the first.</p>
    </AdaptoAccordion>
    <AdaptoAccordion color="primary-500" title="Third item">
      <p>And opening this one closes whichever was open before.</p>
    </AdaptoAccordion>
  </AdaptoAccordionList>
</div>

```vue-html
<AdaptoAccordionList>
  <AdaptoAccordion color="primary-500" title="First item">
    <p>Only one of these three items can be open at a time.</p>
  </AdaptoAccordion>
  <AdaptoAccordion color="primary-500" title="Second item">
    <p>Opening this one closes the first.</p>
  </AdaptoAccordion>
  <AdaptoAccordion color="primary-500" title="Third item">
    <p>And opening this one closes whichever was open before.</p>
  </AdaptoAccordion>
</AdaptoAccordionList>
```

## Variants

The `variant` prop controls the border and background styling. Default is `fussy`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion variant="outlined" color="primary-500" title="Outlined">
    <p>Transparent background with a <code>currentColor</code> border.</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="fussy" color="primary-500" title="Fussy (default)">
    <p>Border and a tinted (<code>color-mix</code>) background.</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="soft" color="primary-500" title="Soft">
    <p>Tinted background, no border.</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="default" color="primary-500" title="Default">
    <p>Uses the shared <code>--fw-accordion-border-*</code> and <code>--fw-accordion-bg</code> theme tokens.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion variant="outlined" color="primary-500" title="Outlined">...</AdaptoAccordion>
<AdaptoAccordion variant="fussy" color="primary-500" title="Fussy (default)">...</AdaptoAccordion>
<AdaptoAccordion variant="soft" color="primary-500" title="Soft">...</AdaptoAccordion>
<AdaptoAccordion variant="default" color="primary-500" title="Default">...</AdaptoAccordion>
```

| Variant    | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------- |
| `outlined` | Transparent background, `thin solid currentColor` border.                       |
| `fussy`    | Border **and** a tinted (`color-mix`) background. **Default.**                  |
| `soft`     | Tinted background, no border.                                                   |
| `default`  | Falls back to the theme's `--fw-accordion-border-*` / `--fw-accordion-bg` tokens instead of a `currentColor`-derived style. Also used for any unrecognized `variant` value. |

## Colors

The `color` prop accepts a theme token name (e.g. `primary-500`), resolved through `fw.cv()` and
applied as the accordion's inline `color` style — which the variants above then reuse via
`currentColor` for borders and tinted backgrounds.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion variant="fussy" color="primary-500" title="Primary">
    <p>Content.</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="fussy" color="danger-600" title="Danger">
    <p>Content.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion variant="fussy" color="primary-500" title="Primary">...</AdaptoAccordion>
<AdaptoAccordion variant="fussy" color="danger-600" title="Danger">...</AdaptoAccordion>
```

::: tip No color provided
Unlike `adpt-button` (which falls back to the literal `red`), leaving `color` empty here resolves
to the `surface-700` theme token instead — `getColor` is `props.color ? fw.cv(props.color) :
fw.cv('surface-700')`.
:::

## Sizes

The `size` prop controls header padding and font size via a `--*` modifier class. Default is `xs`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion size="xs" color="primary-500" title="XS">
    <p>Content.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="sm" color="primary-500" title="SM">
    <p>Content.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="md" color="primary-500" title="MD">
    <p>Content.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="lg" color="primary-500" title="LG">
    <p>Content.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="xl" color="primary-500" title="XL">
    <p>Content.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion size="xs" color="primary-500" title="XS">...</AdaptoAccordion>
<AdaptoAccordion size="sm" color="primary-500" title="SM">...</AdaptoAccordion>
<AdaptoAccordion size="md" color="primary-500" title="MD">...</AdaptoAccordion>
<AdaptoAccordion size="lg" color="primary-500" title="LG">...</AdaptoAccordion>
<AdaptoAccordion size="xl" color="primary-500" title="XL">...</AdaptoAccordion>
```

::: warning `radius` prop has no effect
`radius` is declared, typed and defaulted to `'sm'`, but it is never read in the template or
applied to any class or style — passing any value currently changes nothing visually. Treat it as
a no-op until it's wired up in the component.
:::

## Icon

The header renders an icon (default `{ name: 'chevron-down' }`) that rotates 180° when the item is
open. If `icon.size` is omitted, it's computed on mount from the `--fw-accordion-title-font-size`
CSS variable (`remToPx(fontSize) + 2`). Pass a different `icon` object to change it, or `hideIcon`
to remove it entirely.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion color="primary-500" title="Custom icon" :icon="{ name: 'plus' }">
    <p>Content.</p>
  </AdaptoAccordion>
  <AdaptoAccordion color="primary-500" title="No icon" hide-icon>
    <p>Content.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion color="primary-500" title="Custom icon" :icon="{ name: 'plus' }">
  ...
</AdaptoAccordion>
<AdaptoAccordion color="primary-500" title="No icon" hide-icon>
  ...
</AdaptoAccordion>
```

## States

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion color="primary-500" title="Disabled" disabled>
    <p>Content.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion color="primary-500" title="Disabled" disabled />
```

- **`disabled`** — sets the native `disabled` attribute on the header `<button>`, preventing
  clicks (and therefore `toggle`) from firing. It does not affect styling beyond the browser's
  default disabled button rendering.

## Animation

Opening and closing animate via a `<Transition :css="false">` with manual JS hooks (`enter`/
`leave`) rather than CSS transition classes: the content's `height` is measured from `0` to
`scrollHeight` and `opacity` from `0` to `1`, both over `.3s` with an easing of
`cubic-bezier(0.4, 0, 0.2, 1)`. After the enter transition ends, `height` is reset to `auto` so
the content can resize naturally (e.g. if it contains dynamic or responsive content) while open.

## Props

| Prop         | Type                                                | Default                          | Description                                                                 |
| ------------ | ---------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `variant`    | `'outlined' \| 'fussy' \| 'soft' \| 'default'`       | `'fussy'`                          | Border and background styling.                                               |
| `color`      | `string`                                             | `''`                               | Theme token name resolved via `fw.cv()`; sets the inline `color` style (falls back to `surface-700` if empty). |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`               | `'xs'`                              | Controls header padding and font size.                                       |
| `radius`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`     | `'sm'`                              | Declared but never read — currently has **no visual effect**.                |
| `title`      | `string`                                             | `'Accordion title item'`           | Text displayed in the header button.                                         |
| `modelValue` | `boolean`                                            | `false`                             | Open/closed state (`v-model`). Ignored when nested in `adpt-accordion-list`. |
| `disabled`   | `boolean`                                            | `false`                             | Disables the header button.                                                  |
| `icon`       | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`) | `{ name: 'chevron-down' }` | Icon rendered via `AdaptoIcon`; auto-sized from the header font size if `size` is omitted. |
| `hideIcon`   | `boolean`                                            | `false`                             | Hides the header icon.                                                       |

## Emits

| Event               | Payload   | Description                                                                                   |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `update:modelValue`  | `boolean` | Emitted on header click **only** when standalone (no `adpt-accordion-list` ancestor). Not emitted when nested in a list — the list's own `toggle()` handles state instead. |

## Slots

| Slot      | Description                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------- |
| `default` | Panel content, rendered inside a `<div role="region">` only while the accordion is open. No fallback content. |

## Accessibility

- The expandable content wrapper has a static `role="region"`.
- `disabled` reflects onto the native `disabled` attribute of the header `<button>`, so it's
  automatically excluded from the tab order and announced as unavailable by assistive
  technology.
- The header is a real `<button>`, so it is reachable and activatable via keyboard (`Tab` +
  `Enter`/`Space`) without any extra wiring.
- The component does not set `aria-expanded` on the header button or `aria-controls`/`id`
  pairing between the button and the `role="region"` panel — consumers relying on that level of
  ARIA wiring should verify it against their accessibility requirements.
