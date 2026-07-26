# Input Field

`adpt-input-field` is a labeled text input with four visual variants, a floating/outlined label
mode, an optional clear button, and a built-in password-visibility toggle for `type="password"`
fields.

- **Component name:** `AdaptoInputField`
- **Source:** `src/lib/components/form/adpt-input-field/index.vue`
- **Styles:** `src/lib/components/form/adpt-input-field/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoInputField` is
available globally. `name`, `label` and `modelValue` are required props.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo">
  <AdaptoInputField
    name="email"
    label="Email"
    model-value=""
    placeholder="you@example.com"
    color="primary-600"
  />
</div>

```vue-html
<AdaptoInputField
  v-model="email"
  name="email"
  label="Email"
  placeholder="you@example.com"
  color="primary-600"
/>
```

## Variants

The `variant` prop controls the input's background/border style. Default is `underlined`.

<div class="demo">
  <AdaptoInputField name="v1" label="Outlined" model-value="" variant="outlined" color="primary-600" />
  <AdaptoInputField name="v2" label="Fussy" model-value="" variant="fussy" color="primary-600" />
  <AdaptoInputField name="v3" label="Soft" model-value="" variant="soft" color="primary-600" />
  <AdaptoInputField name="v4" label="Underlined" model-value="" variant="underlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="v1" label="Outlined" variant="outlined" color="primary-600" />
<AdaptoInputField name="v2" label="Fussy" variant="fussy" color="primary-600" />
<AdaptoInputField name="v3" label="Soft" variant="soft" color="primary-600" />
<AdaptoInputField name="v4" label="Underlined" variant="underlined" color="primary-600" />
```

| Variant      | Description                                                        |
| ------------ | ----------------------------------------------------------------------- |
| `outlined`   | Transparent background with a `currentColor` border.               |
| `fussy`      | `currentColor` border **and** a tinted (`color-mix`) background.   |
| `soft`       | Tinted (`color-mix`) background, no border.                        |
| `underlined` | Bottom border only, faintly tinted background. **Default.**        |

Any value outside these four falls back internally to `outlined` styling (note: this fallback is
not enforced by the prop's `validator`, which still only allows the four listed values).

## Label variants

`labelVariant` controls how the label behaves relative to the input: `'float'` floats the label
over the input and animates it up on focus/when filled; `'outlined'` behaves similarly but with a
background "notch" cut into the border. Default is `''` (a static label above the input, no
floating/notch behavior).

<div class="demo">
  <AdaptoInputField name="lv1" label="Static (default)" model-value="" variant="outlined" color="primary-600" />
  <AdaptoInputField name="lv2" label="Float" model-value="" variant="outlined" label-variant="float" color="primary-600" />
  <AdaptoInputField name="lv3" label="Outlined notch" model-value="" variant="outlined" label-variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="lv1" label="Static (default)" variant="outlined" color="primary-600" />
<AdaptoInputField name="lv2" label="Float" variant="outlined" label-variant="float" color="primary-600" />
<AdaptoInputField name="lv3" label="Outlined notch" variant="outlined" label-variant="outlined" color="primary-600" />
```

::: warning Default differs from `adpt-textarea`
`AdaptoInputField`'s `labelVariant` defaults to `''` (static label). The equivalent prop on
[`AdaptoTextarea`](./adpt-textarea) defaults to `'float'`. Same prop name, same type, different
default — don't assume they match across the two components.
:::

`hideLabel` visually hides the label (via a screen-reader-only utility class) while keeping it in
the accessibility tree.

## Colors

`color` accepts a theme token name (e.g. `primary-600`, `danger-700`) resolved to
`var(--fw-<color>)`. It's applied to both the label and input text color.

<div class="demo">
  <AdaptoInputField name="c1" label="Danger (default)" model-value="" variant="outlined" />
  <AdaptoInputField name="c2" label="Primary" model-value="" variant="outlined" color="primary-600" />
  <AdaptoInputField name="c3" label="Success" model-value="" variant="outlined" color="success-600" />
</div>

```vue-html
<AdaptoInputField name="c1" label="Danger (default)" variant="outlined" />
<AdaptoInputField name="c2" label="Primary" variant="outlined" color="primary-600" />
<AdaptoInputField name="c3" label="Success" variant="outlined" color="success-600" />
```

::: warning Default color is `danger-500`
Unlike [`AdaptoTextarea`](./adpt-textarea) (whose analogous default is `primary-600`),
`AdaptoInputField`'s `color` prop defaults to `'danger-500'` — a semantic "error" color used as
the default styling for an ordinary, non-error input. Passing an explicit `color` is recommended
for anything other than an intentionally error-styled field.
:::

## Clear button & password toggle

When the field has content (`modelValue.length > 0`), is `clearable` (default `true`), and is not
`disabled`, a trailing icon button (`AdaptoButton`, `variant="link"`) renders inside the field:

- For any `type` other than `password`, clicking it clears the field (emits
  `update:modelValue` with `''`).
- For `type="password"`, clicking it **toggles password visibility** instead of clearing —
  it flips the underlying native `<input type>` between `password` and `text`. The same
  `clearable` prop gates whether this toggle button is shown at all, so setting
  `clearable="false"` on a password field removes the only way to reveal the password; there's no
  separate prop to keep the reveal toggle while disabling clearing.

<div class="demo">
  <AdaptoInputField name="clear-demo" label="Clearable text" model-value="Some text" variant="outlined" color="primary-600" />
  <AdaptoInputField name="pw-demo" type="password" label="Password" model-value="secret123" variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="clear-demo" label="Clearable text" model-value="Some text" variant="outlined" color="primary-600" />
<AdaptoInputField name="pw-demo" type="password" label="Password" model-value="secret123" variant="outlined" color="primary-600" />
```

The trailing icon itself defaults to `{ name: 'x' }` (`trailingIcon` prop). An `onTrailingIcon`
prop exists to swap in an alternate icon once the password toggle is engaged, but its default is
an empty object (`{}`); with no `onTrailingIcon` passed, the button keeps showing the `x` icon
even after toggling password visibility to "revealed" — it still functions (clicking it toggles
visibility), it just doesn't visually swap icons out of the box.

::: tip Set `onTrailingIcon` for a visually-accurate password toggle
```vue-html
<AdaptoInputField
  name="pw"
  type="password"
  label="Password"
  v-model="password"
  trailing-icon="{ name: 'eye-off' }"
  :on-trailing-icon="{ name: 'eye' }"
/>
```
:::

## States

<div class="demo">
  <AdaptoInputField name="s1" label="Disabled" model-value="Can't touch this" disabled variant="outlined" color="primary-600" />
  <AdaptoInputField name="s2" label="Readonly" model-value="Read only value" readonly variant="outlined" color="primary-600" />
  <AdaptoInputField name="s3" label="Required" model-value="" required variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="s1" label="Disabled" disabled variant="outlined" color="primary-600" />
<AdaptoInputField name="s2" label="Readonly" readonly variant="outlined" color="primary-600" />
<AdaptoInputField name="s3" label="Required" required variant="outlined" color="primary-600" />
```

- **`disabled`** — sets the native `disabled` attribute and hides the trailing icon button.
- **`readonly`** — sets the native `readonly` attribute; the trailing icon button remains visible.
- **`required`** — sets the native `required` attribute; no accessible error messaging is wired up
  (see [Accessibility](#accessibility)).
- `min` / `max` / `maxlength` are forwarded as-is to the native `<input>` (`min`/`max` only have a
  browser effect on numeric/date-like `type`s).

## Props

| Prop             | Type                                                        | Default        | Description                                                                                     |
| ---------------- | ------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `modelValue`     | `string` (required)                                            | —              | Bound value (`v-model`).                                                                         |
| `type`           | `string`                                                       | `'text'`       | Native `<input type>`. Reactive changes to `type` at runtime are followed.                       |
| `name`           | `string` (required)                                            | —              | Native `name` attribute.                                                                        |
| `label`          | `string` (required)                                            | —              | Label text, associated to the input via `<label for>`. Always present in the accessibility tree, even when `hideLabel` visually hides it. |
| `placeholder`    | `string`                                                        | `undefined`    | Native `placeholder`.                                                                            |
| `disabled`       | `boolean`                                                       | `false`        | Disables the input and hides the trailing icon button.                                          |
| `required`       | `boolean`                                                       | `false`        | Sets the native `required` attribute.                                                            |
| `readonly`       | `boolean`                                                       | `false`        | Sets the native `readonly` attribute.                                                            |
| `min`            | `number`                                                        | `undefined`    | Forwarded to the native `min` attribute.                                                         |
| `max`            | `number`                                                        | `undefined`    | Forwarded to the native `max` attribute.                                                         |
| `maxlength`      | `number`                                                        | `undefined`    | Forwarded to the native `maxlength` attribute.                                                   |
| `color`          | `string`                                                        | `'danger-500'` | Theme token name resolved to `var(--fw-<color>)`, applied to label and input text color.        |
| `variant`        | `'outlined' \| 'fussy' \| 'soft' \| 'underlined'`               | `'underlined'` | Visual style of the field.                                                                       |
| `hideLabel`      | `boolean`                                                       | `false`        | Visually hides the label (screen-reader-only), keeping it in the accessibility tree.            |
| `labelVariant`   | `'float' \| 'outlined' \| ''`                                   | `''`           | Label positioning behavior. Empty string renders a static label with no floating/notch effect.  |
| `clearable`      | `boolean`                                                       | `true`         | Shows the trailing clear/toggle button when the field has content. For password fields, also gates the reveal toggle (see above). |
| `trailingIcon`   | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`) | `{ name: 'x' }` | Icon for the trailing button in its default state.                                              |
| `onTrailingIcon` | `Icon`                                                          | `{}`           | Alternate icon shown after the password-reveal toggle is engaged. Empty by default — see the tip above. |

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

`AdaptoInputField` declares no slots; all content is prop-driven.

## Accessibility

- The accessible name comes from the native `<label for>` association — no `aria-label` /
  `aria-labelledby` override is applied to the `<input>`, so it can't drift out of sync with the
  visible label text.
- The trailing clear/toggle button is an `AdaptoButton` with `hide-label`, and receives a
  descriptive `label` that reflects its current action and state ("Limpiar campo" when clearing,
  "Mostrar contraseña" / "Ocultar contraseña" for the password toggle depending on its current
  visibility state) — screen reader users hear what the button actually does, not a generic name.
- No accessible error-messaging mechanism (e.g. `aria-invalid` + `aria-describedby` pointing at an
  error message) is wired up, despite the component supporting `required`/`min`/`max`/`maxlength`.
  If you need validation messaging, you'll need to build it around this component yourself.
