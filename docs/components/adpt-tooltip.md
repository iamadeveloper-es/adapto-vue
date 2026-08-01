# Tooltip

`adpt-tooltip` wraps a trigger element and shows a small text box on hover. It supports four
initial placements and repositions itself automatically when there isn't enough viewport space
for the requested placement.

- **Component name:** `AdaptoTooltip`
- **Source:** `src/lib/components/overlay/adpt-tooltip/index.vue`
- **Styles:** `src/lib/components/overlay/adpt-tooltip/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoTooltip` is
available globally. The `content` prop holds the tooltip's text, and the `content` **slot** holds
the trigger element that the tooltip is attached to — despite sharing a name, they are unrelated
(see [Slots](#slots) below).

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo">
  <AdaptoTooltip content="Saves your changes">
    <template #content>
      <AdaptoButton label="Save" color="primary-500" />
    </template>
  </AdaptoTooltip>
</div>

```vue-html
<AdaptoTooltip content="Saves your changes">
  <template #content>
    <AdaptoButton label="Save" color="primary-500" />
  </template>
</AdaptoTooltip>
```

The tooltip box is shown on `mouseenter` of the trigger and hidden again on `mouseleave` — there
is no keyboard/focus trigger and no click trigger.

## Position

The `position` prop sets the tooltip's initial placement relative to the trigger. Default is
`'top'`.

<div class="demo" style="padding: 56px 24px; justify-content: space-around;">
  <AdaptoTooltip content="Top tooltip" position="top">
    <template #content><AdaptoButton label="Top" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
  <AdaptoTooltip content="Bottom tooltip" position="bottom">
    <template #content><AdaptoButton label="Bottom" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
  <AdaptoTooltip content="Left tooltip" position="left">
    <template #content><AdaptoButton label="Left" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
  <AdaptoTooltip content="Right tooltip" position="right">
    <template #content><AdaptoButton label="Right" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
</div>

```vue-html
<AdaptoTooltip content="Top tooltip" position="top">
  <template #content><AdaptoButton label="Top" color="primary-500" /></template>
</AdaptoTooltip>
<AdaptoTooltip content="Bottom tooltip" position="bottom">
  <template #content><AdaptoButton label="Bottom" color="primary-500" /></template>
</AdaptoTooltip>
<AdaptoTooltip content="Left tooltip" position="left">
  <template #content><AdaptoButton label="Left" color="primary-500" /></template>
</AdaptoTooltip>
<AdaptoTooltip content="Right tooltip" position="right">
  <template #content><AdaptoButton label="Right" color="primary-500" /></template>
</AdaptoTooltip>
```

If `position` is set to anything other than `'top' | 'bottom' | 'left' | 'right'`, the component
silently falls back to `'top'`.

## Auto-repositioning

An `IntersectionObserver` watches the trigger element from the moment the component mounts. Each
time the tooltip becomes visible, it measures the tooltip box against the remaining viewport space
on the side it would render:

- `position="top"` flips to `bottom` if the tooltip's height is greater than the space above the
  trigger.
- `position="bottom"` flips to `top` if the tooltip's height is greater than the space below.
- `position="left"` flips to `right` if the tooltip's width is greater than the space to the left.
- `position="right"` flips to `left` if the tooltip's width is greater than the space to the
  right.

This only flips between the two opposite sides of the requested axis (top↔bottom or left↔right) —
it never reroutes, say, a `left` tooltip to `top`. A realistic demo of this requires an actual
viewport edge, which this docs page can't reliably reproduce across window sizes; try shrinking
the browser window around one of the examples above, or placing a tooltip near the top of a
scrolled page, to see it flip.

::: tip Implementation detail
`observeTrigger()` runs both in `onMounted` and again in a `watch` on the internal `showTooltip`
state (i.e. every time the tooltip is shown), without checking whether an observer already exists.
In practice this can create more than one `IntersectionObserver` instance over the component's
lifetime. This is a known implementation detail, not something this page attempts to work around.
:::

## Props

| Prop       | Type                                          | Default | Description                                                                 |
| ---------- | ---------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `content`  | `string`                                        | —       | **Required.** Text displayed inside the tooltip box.                        |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'`        | `'top'` | Initial placement. Auto-flips to the opposite side of the same axis if there isn't enough viewport space (see [Auto-repositioning](#auto-repositioning)). |

## Emits

None.

## Slots

| Slot      | Description                                                                 |
| --------- | ------------------------------------------------------------------------------ |
| `content` | The trigger element that shows the tooltip on hover. **Not** the tooltip's text — that's the `content` prop. The prop and the slot share a name but hold unrelated content; don't confuse one for the other. |

## Accessibility

- No explicit ARIA wiring is present: the tooltip box has no `role="tooltip"`, and the trigger
  has no `aria-describedby` pointing at it. Screen reader users get no equivalent of the visual
  hover tooltip.
- The tooltip only opens on `mouseenter`/`mouseleave` of the trigger — there is no keyboard
  (focus/blur) trigger, so the tooltip content is unreachable via keyboard navigation alone.
- If the tooltip conveys information that isn't available elsewhere, consumers should currently
  provide their own accessible alternative (e.g. a visually hidden description, or `aria-label` on
  the trigger) rather than relying on this component for that purpose.
