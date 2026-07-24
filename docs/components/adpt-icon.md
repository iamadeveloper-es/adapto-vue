# Icon

`adpt-icon` is a thin wrapper around [`lucide-vue-next`](https://lucide.dev/). It resolves a
kebab-case icon `name` (e.g. `arrow-right`) to the matching Lucide icon component (e.g.
`ArrowRight`) and forwards size, color and stroke width to the rendered SVG.

- **Component name:** `AdaptoIcon`
- **Source:** `src/lib/components/element/adpt-icon/index.vue`

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoIcon` is available
globally:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoIcon name="star" />
```

The `name` prop is always kebab-case, regardless of how the underlying Lucide component is
named. Internally it is split on `-` and each segment is capitalized, so `arrow-right` becomes
`ArrowRight`, `circle-check` becomes `CircleCheck`, and so on — matching the exported names in
`lucide-vue-next`. If `name` doesn't resolve to a known Lucide icon, the `:is` binding receives
`undefined` and nothing is rendered.

<div class="demo">
  <AdaptoIcon name="star" />
  <AdaptoIcon name="arrow-right" />
  <AdaptoIcon name="circle-check" />
  <AdaptoIcon name="settings" />
</div>

```vue-html
<AdaptoIcon name="star" />
<AdaptoIcon name="arrow-right" />
<AdaptoIcon name="circle-check" />
<AdaptoIcon name="settings" />
```

## Size

The `size` prop sets the icon's pixel width/height. Default is `24`.

<div class="demo">
  <AdaptoIcon name="star" :size="16" />
  <AdaptoIcon name="star" :size="24" />
  <AdaptoIcon name="star" :size="32" />
  <AdaptoIcon name="star" :size="48" />
</div>

```vue-html
<AdaptoIcon name="star" :size="16" />
<AdaptoIcon name="star" :size="24" />
<AdaptoIcon name="star" :size="32" />
<AdaptoIcon name="star" :size="48" />
```

## Color

<div class="demo">
  <AdaptoIcon name="heart" color="#ef4444" />
  <AdaptoIcon name="heart" color="rebeccapurple" />
  <AdaptoIcon name="heart" color="rgb(16, 185, 129)" />
</div>

```vue-html
<AdaptoIcon name="heart" color="#ef4444" />
<AdaptoIcon name="heart" color="rebeccapurple" />
<AdaptoIcon name="heart" color="rgb(16, 185, 129)" />
```

::: warning Raw CSS color, not a theme token
Unlike `AdaptoButton`'s `color` prop — which takes a theme token name (e.g. `primary-500`)
resolved through `fw.cv()` to a `var(--adapto-<color>)` — `AdaptoIcon`'s `color` prop is passed
straight through to the underlying `<svg>`'s `color` attribute with no token resolution. It
expects a raw CSS color value (hex, `rgb()`, a CSS color keyword, etc.). Passing a token name
here (e.g. `color="primary-500"`) will **not** work as it does on `AdaptoButton`. If left
unset, the icon falls back to Lucide's own default (`currentColor`).
:::

## Stroke width

The `strokeWidth` prop controls the thickness of the icon's stroke. Default is `2`.

<div class="demo">
  <AdaptoIcon name="star" :stroke-width="1" :size="32" />
  <AdaptoIcon name="star" :stroke-width="2" :size="32" />
  <AdaptoIcon name="star" :stroke-width="3" :size="32" />
</div>

```vue-html
<AdaptoIcon name="star" :stroke-width="1" :size="32" />
<AdaptoIcon name="star" :stroke-width="2" :size="32" />
<AdaptoIcon name="star" :stroke-width="3" :size="32" />
```

## Props

| Prop          | Type                | Default     | Description                                                                 |
| ------------- | ------------------- | ----------- | ----------------------------------------------------------------------------- |
| `name`        | `string` (required) | —           | Kebab-case icon name, converted to the matching PascalCase Lucide component (`arrow-right` → `ArrowRight`). |
| `size`        | `number`             | `24`        | Icon width/height in pixels.                                                 |
| `color`       | `string`             | `undefined` | Raw CSS color value (hex, `rgb()`, keyword, etc.) forwarded to the SVG's `color` attribute. **Not** a theme token — see the warning above. |
| `strokeWidth` | `number`             | `2`         | Stroke thickness of the icon.                                                |
| `defaultClass`| `string \| null`    | `null`      | See note below — currently has no visible effect.                            |

::: warning `defaultClass` is currently non-functional
`defaultClass` is forwarded to the rendered Lucide component as `:default-class="defaultClass"`.
`lucide-vue-next`'s icon components don't declare a `defaultClass`/`default-class` prop, so Vue's
attribute fallthrough renders it as a literal `default-class="..."` attribute on the root `<svg>`
instead of applying it as a CSS class. In practice, setting `defaultClass` has no visible styling
effect. To add custom classes to an `AdaptoIcon`, use the standard `class` attribute instead
(e.g. `<AdaptoIcon name="star" class="my-class" />`), which Vue merges with the component's own
class automatically.
:::

## Accessibility

`AdaptoIcon` is a non-interactive, non-focusable leaf element — it has no keyboard or focus
management concerns of its own.

By default, Lucide's icon components render with `aria-hidden="true"` whenever no accessible-name
attribute (`aria-label`/`aria-labelledby`) is forwarded through attrs fallthrough, so an
`<AdaptoIcon>` is treated as **decorative** unless you say otherwise. This is how `AdaptoButton`
uses it: icons inside a labeled button stay `aria-hidden` and rely on the button's own
`aria-label`.

If you need to use `AdaptoIcon` as a meaningful, standalone icon (not decorative, and not inside
an already-labeled control), pass an accessible name yourself via attrs fallthrough:

```vue-html
<AdaptoIcon name="alert-triangle" aria-label="Warning" />
```

There is no dedicated `label`/`decorative` prop for this — it's implicit, so remember to add
`aria-label` explicitly whenever an icon conveys meaning on its own.
