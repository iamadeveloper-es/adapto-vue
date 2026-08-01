# Radio

`adpt-radio` renders a single radio input with a custom SVG icon (unchecked square / checked
checkmark), a label, and an optional inline validation message. Multiple `AdaptoRadio` instances
sharing the same `name` and bound to the same `v-model` form a standard exclusive-choice group —
there is no separate `AdaptoRadioGroup` wrapper component.

- **Component name:** `AdaptoRadio`
- **Source:** `src/lib/components/form/adpt-radio/index.vue`
- **Styles:** `src/lib/components/form/adpt-radio/style.scss` (registered in `AdaptoPlugin`) for
  the `fw-radio` layout classes, plus the shared `fw-check-radio` rules in
  `src/lib/styles/sass/globals/forms/_check-radio.scss` (also used by `AdaptoCheckbox`) for the
  icon, focus ring and disabled styling.

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoRadio` is available
globally. `name` and `value` are required props; `modelValue` is optional on the component itself
but is how you read/drive the selection with `v-model`.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const plan = ref('pro')
const agreement = ref('')
const answer = ref('')
</script>

<div class="demo">
  <AdaptoRadio name="single-demo" value="on" label="Enable notifications" v-model="plan" active-color="primary-500" />
</div>

```vue-html
<AdaptoRadio
  v-model="enabled"
  name="single-demo"
  value="on"
  label="Enable notifications"
  active-color="primary-500"
/>
```

## Radio group

A group is just several `AdaptoRadio` elements sharing one `name` (which groups them at the
native HTML level) and one `v-model` (which the component compares against each radio's `value`
via `props.modelValue === props.value`, falling back to a `JSON.stringify` comparison so
object-shaped values also work).

<div class="demo">
  <AdaptoRadio name="plan" value="basic" label="Basic" v-model="plan" active-color="primary-500" />
  <AdaptoRadio name="plan" value="pro" label="Pro" v-model="plan" active-color="primary-500" />
  <AdaptoRadio name="plan" value="enterprise" label="Enterprise" v-model="plan" active-color="primary-500" />
</div>

<p>Selected: <code>{{ plan }}</code></p>

```vue-html
<AdaptoRadio name="plan" value="basic" label="Basic" v-model="plan" active-color="primary-500" />
<AdaptoRadio name="plan" value="pro" label="Pro" v-model="plan" active-color="primary-500" />
<AdaptoRadio name="plan" value="enterprise" label="Enterprise" v-model="plan" active-color="primary-500" />
```

::: tip No `<fieldset>`/`<legend>` provided
`AdaptoRadio` renders one independent `<div>` per option; nothing in the component groups them
under a `<fieldset>` with a `<legend>` describing the group as a whole. If the group needs an
accessible group label, wrap the instances in your own `<fieldset>`/`<legend>` (or
`role="radiogroup"` + `aria-label`).
:::

## Colors

`activeColor` is a theme token name (e.g. `primary-500`, `danger-600`) applied as the icon's
`color` **only while the radio is checked**; unchecked radios use the icon's inherited
`currentColor`.

<div class="demo">
  <AdaptoRadio name="color-primary" value="on" label="Primary" model-value="on" active-color="primary-500" />
  <AdaptoRadio name="color-success" value="on" label="Success" model-value="on" active-color="success-600" />
  <AdaptoRadio name="color-danger" value="on" label="Danger" model-value="on" active-color="danger-600" />
</div>

```vue-html
<AdaptoRadio name="color-primary" value="on" label="Primary" model-value="on" active-color="primary-500" />
<AdaptoRadio name="color-success" value="on" label="Success" model-value="on" active-color="success-600" />
<AdaptoRadio name="color-danger" value="on" label="Danger" model-value="on" active-color="danger-600" />
```

::: warning `getVar`, not `cv` — a resolved value, not a live reference
Unlike components that bind colors through `fw.cv(name)` (which yields the string
`var(--fw-<name>)`), `AdaptoRadio` resolves `activeColor` through `fw.getVar(name)`, which calls
`getComputedStyle(document.documentElement)` and reads back the **already-resolved** value of
`--fw-<name>` at render time. In practice this still updates correctly on toggle because it's
evaluated inline in the template, but it is reading a computed value rather than emitting a
`var()` reference like most of the rest of the library does.
:::

## Label & link slots

The default `label` prop text can be replaced with the `label` slot; an additional `link` slot
renders right after it, still inside the same `<label>` (useful for "I agree to the **Terms of
Service**" style copy where part of the text needs its own link/interaction).

<div class="demo">
  <AdaptoRadio name="agreement" value="accepted" v-model="agreement" active-color="primary-500">
    <template #label>I agree to the</template>
    <template #link>&nbsp;<a href="#" @click.prevent>Terms of Service</a></template>
  </AdaptoRadio>
</div>

```vue-html
<AdaptoRadio name="agreement" value="accepted" v-model="agreement" active-color="primary-500">
  <template #label>I agree to the</template>
  <template #link>&nbsp;<a href="#">Terms of Service</a></template>
</AdaptoRadio>
```

## Validation

When `validations` is set, an error `<span role="alert">` renders below the input/label, carrying
an id of `{id}-error` that the input's `aria-describedby` points to. The component does not decide
*when* to show it (there's no internal "touched"/"invalid" state) — it renders unconditionally
whenever the prop has a value, so the consumer controls visibility by binding `validations`
conditionally.

<div class="demo">
  <AdaptoRadio name="answer" value="yes" v-model="answer" label="Yes" active-color="primary-500" />
  <AdaptoRadio
    name="answer"
    value="no"
    v-model="answer"
    label="No"
    active-color="primary-500"
    validations="Please make a selection before continuing"
  />
</div>

```vue-html
<AdaptoRadio name="answer" value="yes" v-model="answer" label="Yes" active-color="primary-500" />
<AdaptoRadio
  name="answer"
  value="no"
  v-model="answer"
  label="No"
  active-color="primary-500"
  :validations="showError ? 'Please make a selection before continuing' : undefined"
/>
```

## States

<div class="demo">
  <AdaptoRadio name="state-disabled" value="on" label="Disabled" model-value="on" active-color="primary-500" disabled />
  <AdaptoRadio name="state-hidden" value="on" label="Hidden label (still has an accessible name)" model-value="on" active-color="primary-500" hide-label />
</div>

```vue-html
<AdaptoRadio name="state-disabled" value="on" label="Disabled" model-value="on" active-color="primary-500" disabled />
<AdaptoRadio name="state-hidden" value="on" label="Hidden label" model-value="on" active-color="primary-500" hide-label />
```

- **`disabled`** — sets the native `disabled` attribute on the `<input>` and adds a `disabled`
  class to the root, which (via the shared `_check-radio.scss` rules) forces the label and icon to
  a hardcoded `--cacao-surface-300` color token — a different, hardcoded prefix left over from an
  earlier naming scheme, independent of the runtime `fw` prefix and of the `activeColor` prop.
- **`hideLabel`** — removes the `<label>` element entirely (`v-if="!hideLabel"`) and adds a
  `--no-label` modifier class that zeroes out the layout margins. The `aria-label` on the `<input>`
  still uses the `label` prop regardless, so the radio keeps an accessible name even with no
  visible label.
- Focus is tracked internally (`isFocused` ref, set on native `focus`/`blur`) and adds a `focused`
  class that draws a `currentColor` outline around the icon wrapper — this is a custom visible
  focus indicator, not the browser's default outline.

## Props

| Prop           | Type                                                        | Default            | Description                                                                                     |
| -------------- | ------------------------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------- |
| `modelValue`   | `string \| number \| boolean \| Record<string, unknown>`     | —                   | `v-model` binding — the currently selected value across the whole group.                        |
| `value`        | `string \| number \| boolean \| Record<string, unknown>` (required) | —            | The value this specific radio represents; compared against `modelValue` to derive checked state. |
| `name`         | `string` (required)                                           | —                   | Native `name` attribute — radios sharing the same `name` form a group.                          |
| `disabled`     | `boolean`                                                     | `false`             | Disables the native input and applies the disabled styling described above.                     |
| `label`        | `string`                                                      | `'Radio label'`     | Visible label text and the input's `aria-label`. Visible text is overridden by the `label` slot, but the `aria-label` always uses this prop's text, even when the slot renders something different. |
| `hideLabel`    | `boolean`                                                     | `false`             | Removes the visible `<label>` element and adds a `--no-label` modifier class. `aria-label` is unaffected. |
| `activeColor`  | `string`                                                      | `'secondary-400'`   | Theme token name resolved via `fw.getVar` and applied as the icon's color, only while checked.  |
| `validations`  | `string`                                                      | `undefined`         | Error message text. When set, renders a `role="alert"` span and wires `aria-describedby` on the input. |

## Emits

| Event               | Payload      | Description                                                                 |
| -------------------- | ------------ | ---------------------------------------------------------------------------- |
| `update:modelValue`  | `RadioValue` (`string \| number \| boolean \| Record<string, unknown>`) | Emitted through the native input's own `v-model` handling whenever this radio becomes the checked one. |
| `onFocus`            | `FocusEvent` | Emitted on native `focus`. Listen for it with `@on-focus`, not `@focus` — see the note below. |
| `onBlur`             | `FocusEvent` | Emitted on native `blur`. Listen for it with `@on-blur`, not `@blur`.        |

::: warning Non-standard emit names
`onFocus`/`onBlur` don't follow the "plain, kebab-case, thing-that-happened" convention used
elsewhere in the library (compare `AdaptoButton`'s `clicked`). Because Vue treats `onXxx`-shaped
prop/emit names specially, consumers must listen with `@on-focus` / `@on-blur` rather than the
more idiomatic `@focus` / `@blur`.
:::

## Slots

| Slot    | Description                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------- |
| `label` | Renders inside the `<label>`, replacing the static `label` prop text (visible text only — the input's `aria-label` still uses the `label` prop, see above). Only rendered when `hideLabel` is `false`. |
| `link`  | Renders inside the same `<label>`, right after the label content — for inline links/actions ("...the **Terms of Service**"). Only rendered when passed. |

## Accessibility

- The input's accessible name always comes from `aria-label="{label}"`, independently of whether
  the visible text is the `label` prop or the `label` slot, and even when `hideLabel` removes the
  visible `<label>` element altogether.
- The decorative icon's inner `<svg>` carries both `role="img"` and `aria-hidden="true"`;
  `aria-hidden` takes precedence in accessible-name/role computation, so the `role="img"` has no
  practical effect — the icon is fully hidden from assistive technology either way, which is the
  intended outcome since the label already conveys the checked state.
- When `validations` is set, the error `<span role="alert">` is linked to the input via
  `aria-describedby="{id}-error"`, so screen readers announce it alongside the input's name.
  `aria-describedby` is only present at all when `validations` has a value.
- Grouping relies entirely on the native `name` attribute shared across instances; the component
  does not render a `<fieldset>`/`<legend>` or `role="radiogroup"` wrapper, so a group-level
  accessible label/description is the consumer's responsibility (see the tip above).
- Focus is visually indicated with a custom `currentColor` outline around the icon (via the
  `focused` class), not just the browser's default focus ring.
