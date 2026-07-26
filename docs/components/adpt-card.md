# Card

`adpt-card` is a purely presentational content container. It renders a semantic `<article>` with
optional `media`, `title`, `subtitle`, `body` and `footer` slots, three visual variants, a
configurable radius/elevation, and an optional "image overlap" layout where the title/subtitle
block is superimposed on top of the media image.

- **Component name:** `AdaptoCard`
- **Source:** `src/lib/components/element/adpt-card/index.vue`
- **Styles:** `src/lib/components/element/adpt-card/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoCard` is available
globally. All content is provided through named slots — there are no `title`/`body` text props.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo" style="display: block;">
  <AdaptoCard variant="outlined" color="primary-500" radius="md">
    <template #title>Card title</template>
    <template #subtitle>Supporting subtitle</template>
    <template #body>
      <p>Body content is fully consumer-provided — plain text, HTML, or nested components all
      work here.</p>
    </template>
    <template #footer>
      <AdaptoButton label="Action" size="sm" color="primary-500" />
    </template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="outlined" color="primary-500" radius="md">
  <template #title>Card title</template>
  <template #subtitle>Supporting subtitle</template>
  <template #body>
    <p>Body content is fully consumer-provided — plain text, HTML, or nested components all
    work here.</p>
  </template>
  <template #footer>
    <AdaptoButton label="Action" size="sm" color="primary-500" />
  </template>
</AdaptoCard>
```

Every section is conditionally rendered based on which slots are actually passed: the header
block (`title`/`subtitle`/`media`) only appears if a `title` or `subtitle` slot is present, and
`body`/`footer` only render if their respective slots are used. A card with no slots at all
renders an essentially empty `<article>`.

## Variants

The `variant` prop controls the card's background/border style. Default is `default`.

<div class="demo">
  <AdaptoCard variant="default" color="primary-500" style="width: 220px;">
    <template #title>Default</template>
    <template #body>Uses the theme's card background token.</template>
  </AdaptoCard>
  <AdaptoCard variant="outlined" color="primary-500" style="width: 220px;">
    <template #title>Outlined</template>
    <template #body>Transparent background, `currentColor` border.</template>
  </AdaptoCard>
  <AdaptoCard variant="fussy" color="primary-500" style="width: 220px;">
    <template #title>Fussy</template>
    <template #body>Border and a tinted background.</template>
  </AdaptoCard>
  <AdaptoCard variant="soft" color="primary-500" style="width: 220px;">
    <template #title>Soft</template>
    <template #body>Tinted background, no border.</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="default" color="primary-500">...</AdaptoCard>
<AdaptoCard variant="outlined" color="primary-500">...</AdaptoCard>
<AdaptoCard variant="fussy" color="primary-500">...</AdaptoCard>
<AdaptoCard variant="soft" color="primary-500">...</AdaptoCard>
```

| Variant    | Description                                                                  |
| ---------- | ------------------------------------------------------------------------------ |
| `default`  | Uses the theme's `--fw-card-bg` background token. **Default.**               |
| `outlined` | Transparent background with a `currentColor` border.                        |
| `fussy`    | `currentColor` border **and** a tinted (`color-mix`) background.            |
| `soft`     | Tinted (`color-mix`) background, no border.                                 |

Any value outside `'default' | 'outlined' | 'fussy' | 'soft'` falls back to `default` (enforced
by the prop's `validator`).

## Colors

`color`, `titleColor` and `subtitleColor` each accept the name of a theme token (e.g.
`primary-500`, `danger-700`) resolved to `var(--fw-<color>)`. `color` sets the card's overall text
color (`currentColor`), which `outlined`/`fussy`/`soft` reuse for borders and tinted backgrounds.
`titleColor`/`subtitleColor` independently override just the title/subtitle slot wrapper's color.

<div class="demo">
  <AdaptoCard variant="soft" color="success-600" title-color="success-800" style="width: 260px;">
    <template #title>Success</template>
    <template #subtitle>Independent subtitle color</template>
    <template #body>Card color vs. title color.</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="soft" color="success-600" title-color="success-800">
  <template #title>Success</template>
  <template #subtitle>Independent subtitle color</template>
  <template #body>Card color vs. title color.</template>
</AdaptoCard>
```

If left unset (the default for all three), no inline `color` style is applied and the element
falls back to its inherited/ambient text color.

## Radius & elevation

`radius` maps to the shared `.rounded--*` utility classes (default `sm`). `elevation` maps to
`.elevation-<n>` utility classes and accepts `'1' | '2' | '3' | '4' | '5'`; it's unset (`''`) by
default, which renders no elevation/shadow class at all.

<div class="demo">
  <AdaptoCard variant="default" color="primary-500" radius="xl" elevation="3" style="width: 220px;">
    <template #title>Rounded + elevated</template>
    <template #body>radius="xl" elevation="3"</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="default" color="primary-500" radius="xl" elevation="3">
  <template #title>Rounded + elevated</template>
  <template #body>radius="xl" elevation="3"</template>
</AdaptoCard>
```

## Media

Passing a `media` slot (typically an `<img>`) renders it above the title/subtitle block by
default. `titleReverse` flips that stacking order, placing the media **below** the title/subtitle
instead.

<div class="demo">
  <AdaptoCard variant="default" color="primary-500" style="width: 260px;">
    <template #media>
      <img src="https://picsum.photos/id/1015/400/300" alt="Mountain lake at sunrise" />
    </template>
    <template #title>Stacked media</template>
    <template #body>Media renders above the title block (default order).</template>
  </AdaptoCard>
  <AdaptoCard variant="default" color="primary-500" title-reverse style="width: 260px;">
    <template #media>
      <img src="https://picsum.photos/id/1018/400/300" alt="Forest road" />
    </template>
    <template #title>Reversed media</template>
    <template #body>`title-reverse` moves the media below the title block.</template>
  </AdaptoCard>
</div>

```vue-html
<!-- default stacking: media above title -->
<AdaptoCard color="primary-500">
  <template #media><img src="..." alt="..." /></template>
  <template #title>Stacked media</template>
  <template #body>...</template>
</AdaptoCard>

<!-- title-reverse: media below title -->
<AdaptoCard color="primary-500" title-reverse>
  <template #media><img src="..." alt="..." /></template>
  <template #title>Reversed media</template>
  <template #body>...</template>
</AdaptoCard>
```

::: tip `titleReverse` requires a `media` slot
`titleReverse` only has a visible effect when a `media` slot is present **and** `imageOverlap` is
`false`. On a card without media, or with `imageOverlap` enabled, it is a silent no-op.
:::

### Image overlap

Setting `imageOverlap` superimposes the title/subtitle block on top of the media image instead of
stacking them. `titleOverlapPosition` (`'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' |
'center'`) controls where the title block sits over the image, and `titleOverlapTextAlign`
(`'start' | 'center' | 'end'`) controls the text alignment inside it.

<div class="demo">
  <AdaptoCard
    variant="default"
    color="primary-500"
    image-overlap
    title-overlap-position="bottom-start"
    title-overlap-text-align="start"
    style="width: 280px;"
  >
    <template #media>
      <img src="https://picsum.photos/id/1019/400/300" alt="Desert dunes" />
    </template>
    <template #title>Overlapping title</template>
    <template #subtitle>Positioned bottom-start</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard
  color="primary-500"
  image-overlap
  title-overlap-position="bottom-start"
  title-overlap-text-align="start"
>
  <template #media><img src="..." alt="..." /></template>
  <template #title>Overlapping title</template>
  <template #subtitle>Positioned bottom-start</template>
</AdaptoCard>
```

::: warning `titleOverlapPosition` / `titleOverlapTextAlign` are modifiers of `imageOverlap`
Both props are gated behind `imageOverlap` in the component's internal class computation: they
only produce a visible effect when `imageOverlap` is `true`. Setting either one without
`imageOverlap` compiles and renders without error, but has no visible effect — a silent no-op.
:::

## Props

| Prop                     | Type                                                                | Default     | Description                                                                                     |
| ------------------------ | -------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `color`                  | `string`                                                              | `''`        | Theme token name resolved to `var(--fw-<color>)`, sets the card's text color (`currentColor`).      |
| `titleColor`             | `string`                                                              | `''`        | Theme token name resolved to `var(--fw-<color>)`, applied only to the `title` slot wrapper.         |
| `subtitleColor`          | `string`                                                              | `''`        | Theme token name resolved to `var(--fw-<color>)`, applied only to the `subtitle` slot wrapper.      |
| `radius`                 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`                      | `'sm'`      | Corner radius, via the shared `.rounded--*` utility classes.                                        |
| `variant`                | `'default' \| 'outlined' \| 'fussy' \| 'soft'`                        | `'default'` | Visual style of the card. Invalid values fall back to `'default'`.                                  |
| `elevation`              | `'1' \| '2' \| '3' \| '4' \| '5'`                                     | `''`        | Adds an `.elevation-<n>` box-shadow utility class. Unset by default (no shadow).                    |
| `imageOverlap`           | `boolean`                                                             | `false`     | Superimposes the title/subtitle block over the `media` slot instead of stacking them.               |
| `titleOverlapPosition`   | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end' \| 'center'` | `''`     | Position of the title block over the media image. **Only applies when `imageOverlap` is `true`.**   |
| `titleOverlapTextAlign`  | `'start' \| 'center' \| 'end'`                                        | `''`        | Text alignment of the overlapping title block. **Only applies when `imageOverlap` is `true`.**      |
| `titleReverse`           | `boolean`                                                             | `false`     | Renders `media` below the title/subtitle block instead of above. **Only applies when a `media` slot is present and `imageOverlap` is `false`.** |

## Emits

`AdaptoCard` is a purely presentational component — it declares no emits.

## Slots

| Slot       | Description                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `media`    | Media content (typically an `<img>`), rendered inside the header block. The consumer is responsible for providing appropriate `alt` text. |
| `title`    | Card title. Its presence (along with `subtitle`) determines whether the header block renders at all, and drives `aria-labelledby` on the root `<article>`. |
| `subtitle` | Card subtitle, rendered under the title. Its presence drives `aria-describedby` on the root `<article>`. |
| `body`     | Main card content. Only rendered when the slot is used.                                       |
| `footer`   | Footer content (e.g. action buttons). Only rendered when the slot is used.                    |

## Accessibility

- The root element is a semantic `<article>`.
- When a `title` slot is present, the `<article>` gets `aria-labelledby` pointing at the title
  block's auto-generated id, so assistive technology announces the card's title as its accessible
  name.
- When a `subtitle` slot is present, the `<article>` gets `aria-describedby` pointing at the
  subtitle block's auto-generated id.
- `AdaptoCard` has no interactive elements of its own; it renders no `role` beyond the implicit
  `article` role and manages no focus.
- Content inside `media`/`title`/`body`/`footer` slots is entirely consumer-provided — remember to
  supply meaningful `alt` text on images passed to the `media` slot, and to use appropriately
  focusable/labeled interactive elements (e.g. `AdaptoButton`) inside `footer`.
