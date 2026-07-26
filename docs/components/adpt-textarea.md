# Textarea

`adpt-textarea` is a labeled multi-line text field, sharing the same visual variants, floating
label mechanism and optional clear button as [`AdaptoInputField`](./adpt-input-field), but built
on a native `<textarea>` instead of `<input>` (no `type`/password handling).

- **Component name:** `AdaptoTextarea`
- **Source:** `src/lib/components/form/adpt-textarea/index.vue`
- **Styles:** `src/lib/components/form/adpt-textarea/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoTextarea` is
available globally. `name`, `label` and `modelValue` are required props.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo">
  <AdaptoTextarea
    name="message"
    label="Message"
    model-value=""
    placeholder="Write your message..."
    color="primary-600"
  />
</div>

```vue-html
<AdaptoTextarea
  v-model="message"
  name="message"
  label="Message"
  placeholder="Write your message..."
  color="primary-600"
/>
```

## Variants

The `variant` prop controls the field's background/border style. Default is `underlined`.

<div class="demo">
  <AdaptoTextarea name="v1" label="Outlined" model-value="" variant="outlined" color="primary-600" />
  <AdaptoTextarea name="v2" label="Fussy" model-value="" variant="fussy" color="primary-600" />
  <AdaptoTextarea name="v3" label="Soft" model-value="" variant="soft" color="primary-600" />
  <AdaptoTextarea name="v4" label="Underlined" model-value="" variant="underlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="v1" label="Outlined" variant="outlined" color="primary-600" />
<AdaptoTextarea name="v2" label="Fussy" variant="fussy" color="primary-600" />
<AdaptoTextarea name="v3" label="Soft" variant="soft" color="primary-600" />
<AdaptoTextarea name="v4" label="Underlined" variant="underlined" color="primary-600" />
```

| Variant      | Description                                                        |
| ------------ | ----------------------------------------------------------------------- |
| `outlined`   | Transparent background with a `currentColor` border.               |
| `fussy`      | `currentColor` border **and** a tinted (`color-mix`) background.   |
| `soft`       | Tinted (`color-mix`) background, no border.                        |
| `underlined` | Bottom border only, faintly tinted background. **Default.**        |

## Label variants

`labelVariant` controls how the label behaves relative to the field: `'float'` floats the label
over the textarea and animates it up on focus/when filled; `'outlined'` behaves similarly with a
background "notch" cut into the border. Default is **`'float'`**.

<div class="demo">
  <AdaptoTextarea name="lv1" label="Float (default)" model-value="" variant="outlined" color="primary-600" />
  <AdaptoTextarea name="lv2" label="Outlined notch" model-value="" variant="outlined" label-variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="lv1" label="Float (default)" variant="outlined" color="primary-600" />
<AdaptoTextarea name="lv2" label="Outlined notch" variant="outlined" label-variant="outlined" color="primary-600" />
```

::: warning Default differs from `adpt-input-field`
`AdaptoTextarea`'s `labelVariant` defaults to `'float'`. The equivalent prop on
[`AdaptoInputField`](./adpt-input-field) defaults to `''` (static label). Same prop name, same
type, different default — don't assume they match across the two components.
:::

`hideLabel` visually hides the label (via a screen-reader-only utility class) while keeping it in
the accessibility tree.

## Colors

`color` accepts a theme token name (e.g. `primary-600`, `danger-700`) resolved to
`var(--fw-<color>)`. Default is **`'primary-600'`** (unlike `AdaptoInputField`'s default of
`'danger-500'` for the identical prop).

<div class="demo">
  <AdaptoTextarea name="c1" label="Primary (default)" model-value="" variant="outlined" />
  <AdaptoTextarea name="c2" label="Success" model-value="" variant="outlined" color="success-600" />
  <AdaptoTextarea name="c3" label="Danger" model-value="" variant="outlined" color="danger-600" />
</div>

```vue-html
<AdaptoTextarea name="c1" label="Primary (default)" variant="outlined" />
<AdaptoTextarea name="c2" label="Success" variant="outlined" color="success-600" />
<AdaptoTextarea name="c3" label="Danger" variant="outlined" color="danger-600" />
```

## Rows

The `rows` prop maps directly to the native `<textarea rows>` attribute. Default is `4`.

<div class="demo">
  <AdaptoTextarea name="r1" label="2 rows" model-value="" rows="2" variant="outlined" color="primary-600" />
  <AdaptoTextarea name="r2" label="6 rows" model-value="" rows="6" variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="r1" label="2 rows" rows="2" variant="outlined" color="primary-600" />
<AdaptoTextarea name="r2" label="6 rows" rows="6" variant="outlined" color="primary-600" />
```

::: tip Vertically resizable
The component's stylesheet sets `resize: vertical` on the `<textarea>`, so users can drag to make
it taller (not wider) — useful for low-vision users who need to see more of their text at once.
:::

## Clear button

When the field has content (`modelValue.length > 0`), is `clearable` (default `true`), and is not
`disabled`, a trailing "clear" icon button (`AdaptoButton`, `variant="link"`, icon `{ name: 'x' }`
by default via `trailingIcon`) renders inside the field. Clicking it emits `update:modelValue`
with `''`. Unlike `AdaptoInputField`, there is no password-toggle behavior — the button always
clears.

<div class="demo">
  <AdaptoTextarea name="clear-demo" label="Clearable" model-value="Some existing text" variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="clear-demo" label="Clearable" model-value="Some existing text" variant="outlined" color="primary-600" />
```

## States

<div class="demo">
  <AdaptoTextarea name="s1" label="Disabled" model-value="Can't touch this" disabled variant="outlined" color="primary-600" />
  <AdaptoTextarea name="s2" label="Readonly" model-value="Read only value" readonly variant="outlined" color="primary-600" />
  <AdaptoTextarea name="s3" label="Required" model-value="" required variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="s1" label="Disabled" disabled variant="outlined" color="primary-600" />
<AdaptoTextarea name="s2" label="Readonly" readonly variant="outlined" color="primary-600" />
<AdaptoTextarea name="s3" label="Required" required variant="outlined" color="primary-600" />
```

- **`disabled`** — sets the native `disabled` attribute and hides the trailing clear button.
- **`readonly`** — sets the native `readonly` attribute; the trailing clear button remains
  visible.
- **`required`** — sets the native `required` attribute; no accessible error messaging is wired
  up (see [Accessibility](#accessibility)).
- `maxlength` is forwarded to the native `maxlength` attribute.

## Props

| Prop             | Type                                                        | Default         | Description                                                                                     |
| ---------------- | ------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `modelValue`     | `string` (required)                                            | —               | Bound value (`v-model`).                                                                         |
| `name`           | `string` (required)                                            | —               | Native `name` attribute.                                                                        |
| `label`          | `string` (required)                                            | —               | Label text, associated to the field via `<label for>`. Always present in the accessibility tree, even when `hideLabel` visually hides it. |
| `placeholder`    | `string`                                                        | `undefined`     | Native `placeholder`.                                                                            |
| `disabled`       | `boolean`                                                       | `false`         | Disables the field and hides the trailing clear button.                                         |
| `required`       | `boolean`                                                       | `false`         | Sets the native `required` attribute.                                                            |
| `readonly`       | `boolean`                                                       | `false`         | Sets the native `readonly` attribute.                                                            |
| `maxlength`      | `number`                                                        | `undefined`     | Forwarded to the native `maxlength` attribute.                                                   |
| `rows`           | `number`                                                        | `4`             | Forwarded to the native `rows` attribute.                                                        |
| `color`          | `string`                                                        | `'primary-600'` | Theme token name resolved to `var(--fw-<color>)`, applied to label and text color.               |
| `variant`        | `'outlined' \| 'fussy' \| 'soft' \| 'underlined'`               | `'underlined'`  | Visual style of the field.                                                                       |
| `hideLabel`      | `boolean`                                                       | `false`         | Visually hides the label (screen-reader-only), keeping it in the accessibility tree.             |
| `labelVariant`   | `'float' \| 'outlined'`                                         | `'float'`       | Label positioning behavior.                                                                       |
| `clearable`      | `boolean`                                                       | `true`          | Shows the trailing clear button when the field has content.                                      |
| `trailingIcon`   | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`) | `{ name: 'x' }` | Icon for the clear button.                                                                        |

`min`/`max` were previously declared here too, copied over from `AdaptoInputField`, but
`<textarea>` has no native `min`/`max` attributes — they had no effect and have been removed from
the component's public API. Use `maxlength` to constrain input length.

## Emits

| Event              | Payload      | Description                                                                 |
| ------------------ | ------------ | ---------------------------------------------------------------------------- |
| `update:modelValue`| `string`     | Emitted on every native `input` event, and when the field is cleared via the trailing button. |
| `onFocus`          | `FocusEvent` | Emitted on native `focus`. Listen for it with `@on-focus`, not `@focus` — see the note below. |
| `onBlur`           | `FocusEvent` | Emitted on native `blur`. Listen for it with `@on-blur`, not `@blur`.        |

::: warning Non-standard emit names
`onFocus`/`onBlur` don't follow the "plain, kebab-case, thing-that-happened" convention used
elsewhere in the library (compare `AdaptoButton`'s `clicked`). Because Vue treats `onXxx`-shaped
prop/emit names specially, consumers must listen with `@on-focus` / `@on-blur` rather than the
more idiomatic `@focus` / `@blur`.
:::

## Slots

`AdaptoTextarea` declares no slots; all content is prop-driven.

## Accessibility

- The accessible name comes from the native `<label for>` association — no `aria-label` /
  `aria-labelledby` override is applied to the `<textarea>`, so it can't drift out of sync with the
  visible label text.
- The trailing clear button is an `AdaptoButton` with `hide-label` and `label="Limpiar campo"`, so
  screen reader users hear a descriptive name instead of a generic one.
- No accessible error-messaging mechanism (e.g. `aria-invalid` + `aria-describedby` pointing at an
  error message) is wired up, despite the component supporting `required`/`maxlength`. If you need
  validation messaging, you'll need to build it around this component yourself.
- The field is vertically resizable (`resize: vertical`), which helps low-vision users see more of
  their text at once.
