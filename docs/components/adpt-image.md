# Image

`adpt-image` is a thin wrapper around a native `<img>`: a fixed-structure div/img pair that adds
`object-fit` control, an optional `aspect-ratio` box, and a normalized `on-error` event. It has no
slots and no visual variants beyond `fit`.

- **Component name:** `AdaptoImage`
- **Source:** `src/lib/components/element/adpt-image/index.vue`
- **Styles:** `src/lib/components/element/adpt-image/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoImage` is available
globally. `src` is the only required prop:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" />
```

## Object fit

The `fit` prop maps to a `.fw-image--<fit>` modifier class that sets `object-fit` on the inner
`<img>`. Default is `'cover'`. Any value outside `'contain' | 'cover'` silently falls back to
`'cover'` — both the applied class and the resolved `object-fit` behavior.

<div class="demo">
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" fit="cover" aspect-ratio="1/1" width="160px" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" fit="contain" aspect-ratio="1/1" width="160px" />
</div>

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" fit="cover" aspect-ratio="1/1" width="160px" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" fit="contain" aspect-ratio="1/1" width="160px" />
```

| `fit`       | Effect                                                             |
| ----------- | ------------------------------------------------------------------- |
| `cover`     | Fills the box, cropping overflow. **Default.**                     |
| `contain`   | Scales the whole image to fit inside the box, letterboxing if needed. |

## Aspect ratio

The `aspectRatio` prop sets an inline `aspect-ratio` style on the wrapper `div`, but only when the
value is one of a fixed whitelist: `'16/9' | '4/3' | '1/1' | '9/16'`. Any other value (or no value
at all) is ignored and no `aspect-ratio` style is applied — the wrapper then sizes itself from the
image's natural dimensions and the surrounding layout instead.

<div class="demo">
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" aspect-ratio="16/9" width="220px" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" aspect-ratio="1/1" width="140px" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" aspect-ratio="9/16" width="110px" />
</div>

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" aspect-ratio="16/9" width="220px" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" aspect-ratio="1/1" width="140px" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" aspect-ratio="9/16" width="110px" />
```

::: warning No aspectRatio provided
Without `aspectRatio`, the wrapper has no fixed height of its own — the rendered size depends on
the `<img>`'s natural dimensions (scaled to the `width` you pass, if any) and whatever height the
parent layout allows. Pass an `aspectRatio` whenever you need a predictable box before the image
loads.
:::

## Width

The `width` prop is written verbatim as the wrapper `div`'s inline `width` style, so it must
include a unit (`"200px"`, `"50%"`, …) — a bare number is not converted to pixels.

<div class="demo">
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" width="100px" aspect-ratio="1/1" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" width="200px" aspect-ratio="1/1" />
</div>

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" width="100px" aspect-ratio="1/1" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Mountain river" width="200px" aspect-ratio="1/1" />
```

## Error handling

The `<img>`'s native `error` event is forwarded as `on-error`, carrying the original `Event`. This
is the only way to react to a broken `src` — there is no built-in fallback image or placeholder
state.

<div class="demo">
  <AdaptoImage src="https://this-domain-does-not-exist.invalid/broken.jpg" alt="Broken image" width="120px" aspect-ratio="1/1" @on-error="() => {}" />
</div>

```vue-html
<AdaptoImage
  src="https://example.com/broken.jpg"
  alt="Broken image"
  @on-error="onImageError"
/>
```

```ts
function onImageError(event: Event) {
  // e.g. swap `src` to a fallback, log the failure, etc.
}
```

## Props

| Prop          | Type                                    | Default   | Description                                                                                   |
| ------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `src`         | `string`                                  | —         | **Required.** Sets the `<img src>` attribute.                                                  |
| `width`       | `string`                                  | `undefined` | Inline `width` style on the wrapper `div`. Must include a unit.                              |
| `alt`         | `string`                                  | `undefined` | Sets the `<img alt>` attribute. Optional per the prop definition, but should be provided for semantic images. |
| `fit`         | `'contain' \| 'cover'`                    | `'cover'` | Applies `object-fit` via a `.fw-image--<fit>` modifier class. Values outside this union fall back to `'cover'`. |
| `aspectRatio` | `'16/9' \| '4/3' \| '1/1' \| '9/16'`       | `undefined` | Inline `aspect-ratio` style on the wrapper `div`, applied only if the value is in this whitelist; otherwise ignored. |

## Emits

| Event      | Payload | Description                                                  |
| ---------- | ------- | ---------------------------------------------------------------- |
| `on-error` | `Event` | Emitted when the `<img>` fails to load (native `error` event).  |

## Slots

`adpt-image` has no slots. The wrapper `div` and the `<img>` it contains are a fixed structure —
all rendered content comes from the `src`/`alt`/`fit`/`aspectRatio`/`width` props.

## Accessibility

- The `<img>`'s `alt` attribute is bound directly to the `alt` prop. `alt` is optional in the prop
  definition, but omitting it leaves the image without accessible text — always pass `alt` for any
  image that conveys information, and pass an empty string explicitly (`alt=""`) for purely
  decorative images.
- There is no `role` or `aria-*` attribute beyond `alt`; assistive technology treats the element as
  a standard image.
- A failed load (`on-error`) does not change the rendered markup or announce anything on its own —
  if you need users to be notified of a broken image, handle that in the `on-error` listener
  yourself (e.g. swap in a fallback `src` or render accompanying text).
