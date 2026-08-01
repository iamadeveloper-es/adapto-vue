# Avatar

`adpt-avatar` displays a user's picture, full name, or initials inside a fixed-size circle. It
behaves as an interactive element (`role="button"`, keyboard-activatable) and emits a single
`clicked` event on click or on <kbd>Enter</kbd>/<kbd>Space</kbd>.

- **Component name:** `AdaptoAvatar`
- **Source:** `src/lib/components/element/adpt-avatar/index.vue`
- **Styles:** `src/lib/components/element/adpt-avatar/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoAvatar` is
available globally:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoAvatar name="Ada Lovelace" @clicked="onAvatarClick" />
```

## Content: image, name, or initials

`adpt-avatar` has no visual variants — its rendered content depends entirely on the combination
of the `image` and `showInitials` props:

<div class="demo">
  <AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" />
  <AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" show-initials />
  <AdaptoAvatar name="Ada Lovelace" />
  <AdaptoAvatar name="Ada Lovelace" show-initials />
</div>

```vue-html
<!-- image provided, showInitials false (default) -> renders the <img> -->
<AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" />

<!-- image provided, showInitials true -> the image is ignored, initials are shown instead -->
<AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" show-initials />

<!-- no image, showInitials false (default) -> renders the full name, truncated to fit -->
<AdaptoAvatar name="Ada Lovelace" />

<!-- no image, showInitials true -> renders the initials -->
<AdaptoAvatar name="Ada Lovelace" show-initials />
```

| `image`    | `showInitials` | Rendered content                                    |
| ---------- | --------------- | ------------------------------------------------------ |
| provided   | `false`         | `<img :src="image" :alt="name">`                       |
| provided   | `true`          | Initials — the image is not requested/rendered.        |
| not provided | `false`       | The full `name` text, truncated with an ellipsis if it overflows the circle. |
| not provided | `true`        | Initials.                                               |

Initials are computed from `name` as the first character plus the first character of the second
space-separated word (e.g. `"Ada Lovelace"` → `"AL"`, `"Ada"` → `"A"`).

::: warning No image and no name
If neither `image` nor `name` is provided (and `showInitials` is `false`), the avatar renders an
empty circle with no accessible name — this is a legitimate edge case of the component, not a
bug, so always pass at least `name`.
:::

## Sizes

The `size` prop controls the avatar's diameter and font size via a fixed size map. Default is
`'md'`.

<div class="demo">
  <AdaptoAvatar size="xs" name="Ada Lovelace" />
  <AdaptoAvatar size="sm" name="Ada Lovelace" />
  <AdaptoAvatar size="md" name="Ada Lovelace" />
  <AdaptoAvatar size="lg" name="Ada Lovelace" />
  <AdaptoAvatar size="xl" name="Ada Lovelace" />
</div>

```vue-html
<AdaptoAvatar size="xs" name="Ada Lovelace" />
<AdaptoAvatar size="sm" name="Ada Lovelace" />
<AdaptoAvatar size="md" name="Ada Lovelace" />
<AdaptoAvatar size="lg" name="Ada Lovelace" />
<AdaptoAvatar size="xl" name="Ada Lovelace" />
```

| Size | Diameter |
| ---- | -------- |
| `xs` | 16px     |
| `sm` | 24px     |
| `md` | 32px (default) |
| `lg` | 48px     |
| `xl` | 64px     |

## Interaction

The avatar is always focusable and clickable, regardless of its content:

<div class="demo">
  <AdaptoAvatar name="Ada Lovelace" @clicked="() => {}" />
</div>

```vue-html
<AdaptoAvatar name="Ada Lovelace" @clicked="onAvatarClick" />
```

- Clicking the avatar emits `clicked` with the `MouseEvent`.
- Pressing <kbd>Enter</kbd> or <kbd>Space</kbd> while the avatar is focused also emits `clicked`,
  with the `KeyboardEvent`. The default page-scroll behavior of <kbd>Space</kbd> is prevented.
- There is no `disabled` prop — the avatar is always interactive.

## Props

| Prop           | Type                                       | Default | Description                                                                 |
| -------------- | ------------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `image`        | `string`                                    | `undefined` | Image URL. Rendered as `<img>` when set and `showInitials` is `false`. |
| `name`         | `string`                                    | `undefined` | Person's name. Used as `aria-label`, as the `<img>` `alt`, and to compute the displayed initials/text. |
| `size`         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`       | `'md'`  | Diameter and font size, via a fixed size map.                               |
| `showInitials` | `boolean`                                   | `false` | Forces initials to be shown instead of the image or the full name text.     |

## Emits

| Event     | Payload                        | Description                                                          |
| --------- | ------------------------------- | ------------------------------------------------------------------------ |
| `clicked` | `MouseEvent \| KeyboardEvent`   | Emitted on click, or on <kbd>Enter</kbd>/<kbd>Space</kbd> keydown while focused. |

## Slots

`adpt-avatar` has no slots — its content (image, name, or initials) is fully controlled by the
`image`, `name`, and `showInitials` props.

## Accessibility

- The root element has `role="button"` and `tabindex="0"`, so it participates in the tab order
  and is announced as a button by assistive technology.
- `aria-label` is bound directly to the `name` prop. If `name` is omitted, the avatar exposes no
  accessible name — always pass `name`, even when only `image` is used.
- The `<img>` element's `alt` attribute also uses `name`, falling back to an empty string when
  `name` is not provided.
- The inner `<span>` used for the name/initials text is marked `aria-hidden="true"`, since the
  accessible name is already supplied by `aria-label` on the root element — this avoids the text
  being announced twice.
