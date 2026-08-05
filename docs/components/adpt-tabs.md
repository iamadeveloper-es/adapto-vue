# Tabs

`adpt-tabs` is a tabbed navigation/content-switcher built from a `tabs` array of `{ label, value,
icon?, disabled? }` items. It supports four visual variants (including an animated underline
indicator), five sizes, per-tab corner radius, full-width stretching, alignment, a divider under
the tab list, per-tab icons and disabled states, and full arrow-key navigation. Panel content is
provided per tab through dynamically-named slots, and switching tabs animates the panel in the
direction of travel.

- **Component name:** `AdaptoTabs`
- **Source:** `src/lib/components/element/adpt-tabs/index.vue`
- **Styles:** `src/lib/components/element/adpt-tabs/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoTabs` is available
globally. `modelValue` (`v-model`) holds the active tab's `value`; if it's omitted or doesn't
match any tab, the component falls back to the first non-disabled tab. Panel content for each tab
goes in a dynamically-named slot matching that tab's `value`:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const activeTab = ref('overview')
const demoTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Settings', value: 'settings' },
]

const variantTabs = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
]

const iconTabs = [
  { label: 'Home', value: 'home', icon: { name: 'house' } },
  { label: 'Profile', value: 'profile', icon: { name: 'user' } },
  { label: 'Locked', value: 'locked', icon: { name: 'lock' }, disabled: true },
]
</script>

<div class="demo" style="display: block;">
  <AdaptoTabs v-model="activeTab" color="primary-500" :tabs="demoTabs">
    <template #overview>
      <p>Overview panel content.</p>
    </template>
    <template #activity>
      <p>Activity panel content.</p>
    </template>
    <template #settings>
      <p>Settings panel content.</p>
    </template>
  </AdaptoTabs>
</div>

```vue-html
<AdaptoTabs v-model="activeTab" color="primary-500" :tabs="tabs">
  <template #overview>
    <p>Overview panel content.</p>
  </template>
  <template #activity>
    <p>Activity panel content.</p>
  </template>
  <template #settings>
    <p>Settings panel content.</p>
  </template>
</AdaptoTabs>
```

```ts
import { ref } from 'vue'

const activeTab = ref('overview')
const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Settings', value: 'settings' },
]
```

If a tab's slot is left empty, the panel falls back to rendering the active tab's `label` as
plain text — useful for quick prototyping before wiring up real panel content.

## Variants

The `variant` prop controls the tab list's visual style. Default is `underlined`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs variant="outlined" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="soft" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="underlined" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs variant="outlined" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="soft" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="underlined" color="primary-500" :tabs="tabs" />
```

| Variant      | Description                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `outlined`   | Active tab gets a `thin solid currentColor` border; inactive tabs stay borderless.              |
| `fussy`      | Active tab gets a border **and** a tinted (`color-mix`) background.                             |
| `soft`       | Active tab gets a tinted background, no border.                                                 |
| `underlined` | No per-tab border/background. A single animated `<span>` indicator slides and resizes to sit under the active tab. **Default.** |

Any value outside these four falls back to `underlined`, since the internal class lookup defaults
to it when the prop isn't recognized.

## Colors

The `color` prop accepts a theme token name (primitive, e.g. `green-500`, or semantic, e.g.
`primary-500`) resolved via `fw.cv()` and applied as the tab list's inline `color` style, which
the variants above then reuse via `currentColor` for borders, tinted backgrounds and the
underline indicator.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs variant="fussy" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" color="success-600" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" color="danger-600" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs variant="fussy" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" color="success-600" :tabs="tabs" />
<AdaptoTabs variant="fussy" color="danger-600" :tabs="tabs" />
```

If `color` is left empty (the default), it resolves to the `primary-700` theme token instead —
`getColor` is `props.color ? fw.cv(props.color) : fw.cv('primary-700')`.

## Sizes

The `size` prop controls each tab's padding and font size. Default is `xs`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs size="xs" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="sm" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="md" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="lg" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="xl" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs size="xs" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="sm" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="md" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="lg" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="xl" color="primary-500" :tabs="tabs" />
```

## Radius

The `radius` prop maps to the shared `.rounded--*` utility classes and is applied to each
individual tab button. Default is `sm`. It's most visible on the `outlined`/`fussy`/`soft`
variants, since `underlined` tabs have no border or background of their own to round.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs variant="fussy" radius="xs" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" radius="md" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" radius="full" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs variant="fussy" radius="xs" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" radius="md" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" radius="full" color="primary-500" :tabs="tabs" />
```

## Alignment

`tabsAlign` positions the tab list within its container (`justify-content` on the list). There is
no default — omitting it leaves the browser's default `flex` start alignment in place.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs tabs-align="start" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs tabs-align="center" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs tabs-align="end" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs tabs-align="start" color="primary-500" :tabs="tabs" />
<AdaptoTabs tabs-align="center" color="primary-500" :tabs="tabs" />
<AdaptoTabs tabs-align="end" color="primary-500" :tabs="tabs" />
```

## Full width & divider

`fullWidth` stretches the tab list to the container's width, distributing space evenly across
tabs. `divider` draws a thin border line under the tab list, independent of variant.

<div class="demo" style="display: block;">
  <AdaptoTabs full-width divider color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs full-width divider color="primary-500" :tabs="tabs" />
```

## Icons and disabled tabs

Each item in `tabs` can carry its own `icon` (forwarded to `AdaptoIcon`, marked
`aria-hidden="true"`) and `disabled` flag. Disabled tabs render at `opacity: .5`, get
`cursor: not-allowed`, cannot be clicked or focused via the pointer, and are skipped by keyboard
navigation.

<div class="demo" style="display: block;">
  <AdaptoTabs color="primary-500" :tabs="iconTabs" />
</div>

```vue-html
<AdaptoTabs
  color="primary-500"
  :tabs="[
    { label: 'Home', value: 'home', icon: { name: 'house' } },
    { label: 'Profile', value: 'profile', icon: { name: 'user' } },
    { label: 'Locked', value: 'locked', icon: { name: 'lock' }, disabled: true },
  ]"
/>
```

## Keyboard navigation

Once a tab is focused, arrow keys move both focus and selection together (this follows the
[WAI-ARIA "automatic activation" tab pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) —
only the active tab has `tabindex="0"`, every other tab has `tabindex="-1"`):

- **`ArrowRight`** — moves to the next non-disabled tab, wrapping around to the first.
- **`ArrowLeft`** — moves to the previous non-disabled tab, wrapping around to the last.
- **`Home`** — jumps to the first non-disabled tab.
- **`End`** — jumps to the last non-disabled tab.

## Panel transitions

Switching the active tab animates the outgoing and incoming panel content in the direction of
travel, rather than crossfading: the panel slides as if the new content were pushing the old
content out of the way. If the newly active tab sits to the **left** of the previously active one
(a lower index in `tabs`), the incoming panel slides in from the left, pushing the outgoing one to
the right. If it sits to the **right**, the incoming panel slides in from the right, pushing the
outgoing one to the left. This gives the tab switch a sense of spatial direction that matches
where the user clicked or navigated to.

## Props

| Prop             | Type                                                       | Default        | Description                                                                 |
| ----------------- | ------------------------------------------------------------ | --------------- | ----------------------------------------------------------------------------- |
| `tabs`            | `TabItem[]` (`{ label, value, icon?, disabled? }`)            | **required**    | The tab items to render, in order.                                           |
| `modelValue`      | `string \| number`                                            | `undefined`     | Active tab's `value` (`v-model`). Falls back to the first non-disabled tab if missing or invalid. |
| `variant`         | `'outlined' \| 'fussy' \| 'soft' \| 'underlined'`             | `'underlined'`  | Visual style of the tab list. Unrecognized values fall back to `underlined`. |
| `color`           | `string`                                                      | `''`            | Theme token name resolved via `fw.cv()`, applied as `currentColor` (falls back to `primary-700` if empty). |
| `size`            | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                        | `'xs'`          | Controls per-tab padding and font size.                                      |
| `radius`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`              | `'sm'`          | Corner radius applied to each individual tab, via `.rounded--*`.             |
| `fullWidth`       | `boolean`                                                     | `false`         | Stretches the tab list to the container's full width, distributing space evenly across tabs. |
| `label`           | `string`                                                      | `'Tabs'`        | `aria-label` on the `role="tablist"` container.                              |
| `disableRipple`   | `boolean`                                                     | `false`         | Disables the `v-ripple` click feedback on tab buttons.                       |
| `tabsAlign`       | `'start' \| 'center' \| 'end'`                                | `undefined`     | Horizontal alignment (`justify-content`) of the tab list within its container. |
| `divider`         | `boolean`                                                     | `false`         | Renders a thin border line below the tab list.                               |

## Emits

| Event               | Payload            | Description                                                              |
| -------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `update:modelValue`  | `tab.value`         | Emitted when a non-disabled tab is activated, by click or by arrow-key/Home/End navigation. |

## Slots

| Slot                    | Description                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `[tab.value]` (dynamic) | One slot per tab, named after that tab's `value`. Receives the scoped prop `{ tab: activeTab }`. Renders the panel content for that tab. |
| *(none provided)*        | If the matching slot is empty or absent, the panel falls back to rendering `activeTab?.label` as plain text. |

## Accessibility

- The tab list has a static `role="tablist"` with `aria-label` bound to the `label` prop; each
  button has `role="tab"`.
- `aria-selected` reflects whether each tab is the active one, and `aria-controls` points at the
  corresponding panel's `id`.
- Only the active tab has `tabindex="0"`; every other tab has `tabindex="-1"` — this is the
  standard roving-tabindex pattern for tab lists, so `Tab` moves focus into and out of the
  tablist as a single stop, while arrow keys move between tabs.
- The panel has `role="tabpanel"`, `tabindex="0"`, and `aria-labelledby` pointing back at the
  active tab's `id`.
- Per-tab icons and the underline indicator are marked `aria-hidden="true"` so assistive
  technology relies on the tab's visible/accessible label text instead.
- Disabled tabs use the native `disabled` attribute on the `<button>`, so they're automatically
  excluded from the tab order and announced as unavailable.
