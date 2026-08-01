# Checkbox

`adpt-checkbox` is a labeled checkbox input built on a native `<input type="checkbox">`. It
supports two `v-model` shapes: a `boolean` for a single standalone checkbox, or an array of
values for a group of checkboxes sharing the same `modelValue` (multi-select). It ships a custom
SVG icon that swaps between an unchecked/checked path, and an optional inline validation message.

- **Component name:** `AdaptoCheckbox`
- **Source:** `src/lib/components/form/adpt-checkbox/index.vue`
- **Styles:** `src/lib/components/form/adpt-checkbox/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoCheckbox` is
available globally. `name` is the only required prop; `modelValue` is not required by the prop
declaration, but the component is not useful without a `v-model`.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

### Single checkbox (boolean `v-model`)

When `modelValue` is a plain `boolean`, the checkbox ignores the `value` prop for state purposes
and simply reflects/toggles that boolean:

<script setup>
import { ref } from 'vue'

const accepted = ref(false)
const fruits = ref(['apple'])
</script>

<div class="demo">
  <AdaptoCheckbox
    v-model="accepted"
    name="terms"
    label="I accept the terms and conditions"
    active-color="primary-500"
  />
  <span>modelValue: {{ accepted }}</span>
</div>

```vue-html
<AdaptoCheckbox
  v-model="accepted"
  name="terms"
  label="I accept the terms and conditions"
  active-color="primary-500"
/>
```

### Checkbox group (array `v-model`)

When several `AdaptoCheckbox` share the same array `modelValue` and each is given a distinct
`value`, checked state is derived from `modelValue.includes(value)`, and toggling any one of them
adds/removes its `value` from the shared array:

<div class="demo" style="flex-direction: column; align-items: flex-start;">
  <AdaptoCheckbox v-model="fruits" name="fruit" value="apple" label="Apple" active-color="primary-500" />
  <AdaptoCheckbox v-model="fruits" name="fruit" value="banana" label="Banana" active-color="primary-500" />
  <AdaptoCheckbox v-model="fruits" name="fruit" value="cherry" label="Cherry" active-color="primary-500" />
  <span>modelValue: {{ fruits }}</span>
</div>

```vue-html
<AdaptoCheckbox v-model="fruits" name="fruit" value="apple" label="Apple" active-color="primary-500" />
<AdaptoCheckbox v-model="fruits" name="fruit" value="banana" label="Banana" active-color="primary-500" />
<AdaptoCheckbox v-model="fruits" name="fruit" value="cherry" label="Cherry" active-color="primary-500" />
```

`value` accepts a `string`, `number`, `boolean`, or plain object — whatever shape is meaningful
for the group's items. It defaults to `false`, which is only sensible for the standalone boolean
mode above.

## Active color

`activeColor` is a theme token name (e.g. `primary-500`, `success-600`) resolved via
`fw.getVar` and applied as the checked icon's `color`. It has no effect while unchecked.

<div class="demo">
  <AdaptoCheckbox name="c1" label="Primary" model-value active-color="primary-500" />
  <AdaptoCheckbox name="c2" label="Success" model-value active-color="success-600" />
  <AdaptoCheckbox name="c3" label="Danger" model-value active-color="danger-600" />
</div>

```vue-html
<AdaptoCheckbox name="c1" label="Primary" :model-value="true" active-color="primary-500" />
<AdaptoCheckbox name="c2" label="Success" :model-value="true" active-color="success-600" />
<AdaptoCheckbox name="c3" label="Danger" :model-value="true" active-color="danger-600" />
```

## Hidden label

`hideLabel` removes the `<label>` element entirely (not just visually) and adds a
`--no-label` modifier class that removes the surrounding margins. `label` is still required in
this case, since it becomes the input's `aria-label`.

<div class="demo">
  <AdaptoCheckbox name="hidden" label="Subscribe to newsletter" hide-label active-color="primary-500" />
</div>

```vue-html
<AdaptoCheckbox name="hidden" label="Subscribe to newsletter" hide-label active-color="primary-500" />
```

## Validation message

Passing a non-empty `validations` string renders a `role="alert"` span below the checkbox, linked
to the input via `aria-describedby`. The component does not validate anything itself — the
consumer decides when to pass a message.

<div class="demo">
  <AdaptoCheckbox
    name="required-check"
    label="I agree to the privacy policy"
    active-color="primary-500"
    validations="You must accept to continue"
  />
</div>

```vue-html
<AdaptoCheckbox
  name="required-check"
  label="I agree to the privacy policy"
  active-color="primary-500"
  validations="You must accept to continue"
/>
```

## Slots

The `label` slot replaces the static label text entirely, and the `link` slot renders additional
content (e.g. an inline link) right after it, still inside the same `<label>`:

<div class="demo">
  <AdaptoCheckbox name="slotted" active-color="primary-500">
    <template #label>I accept the</template>
    <template #link>
      &nbsp;<a href="#" @click.prevent>terms of service</a>
    </template>
  </AdaptoCheckbox>
</div>

```vue-html
<AdaptoCheckbox name="slotted" active-color="primary-500">
  <template #label>I accept the</template>
  <template #link>
    &nbsp;<a href="#">terms of service</a>
  </template>
</AdaptoCheckbox>
```

## States

<div class="demo">
  <AdaptoCheckbox name="disabled-unchecked" label="Disabled" disabled active-color="primary-500" />
  <AdaptoCheckbox name="disabled-checked" label="Disabled, checked" disabled model-value active-color="primary-500" />
</div>

```vue-html
<AdaptoCheckbox name="disabled-unchecked" label="Disabled" disabled active-color="primary-500" />
<AdaptoCheckbox name="disabled-checked" label="Disabled, checked" disabled :model-value="true" active-color="primary-500" />
```

- **`disabled`** — sets the native `disabled` attribute on the input and adds a `disabled` class
  to the root, which style.scss does not currently visually style (no dimming/cursor rule beyond
  whatever the input's native disabled rendering provides).
- **focused** — while the input has focus, an internal `isFocused` ref adds a `focused` class to
  the root; there is no other prop-driven state.

## Props

| Prop          | Type                                                          | Default              | Description                                                                                          |
| ------------- | --------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `boolean \| CheckboxItemValue[]`                                | —                     | `v-model` binding. A `boolean` drives a single checkbox; an array of `CheckboxItemValue` drives a multi-select group. |
| `disabled`    | `boolean`                                                       | `false`               | Disables the checkbox input.                                                                          |
| `value`       | `string \| number \| boolean \| Record<string, unknown>`       | `false`               | The value associated with this checkbox. Only used to compute checked state when `modelValue` is an array. |
| `name`        | `string`                                                        | —                     | **Required.** Native `name` attribute of the input, needed for form submission.                       |
| `label`       | `string`                                                        | `'Checkbox label'`    | Visible text label, and always the input's `aria-label`. Overridden (visually) by the `label` slot.  |
| `hideLabel`   | `boolean`                                                       | `false`               | Removes the `<label>` element and adds a `--no-label` modifier class.                                 |
| `activeColor` | `string`                                                        | `'secondary-400'`     | Theme token name applied as the checked icon's color. No effect while unchecked.                      |
| `validations` | `string`                                                        | —                     | Error message text. When set, renders a `role="alert"` span linked via `aria-describedby`.            |

`CheckboxItemValue` is `string | number | boolean | Record<string, unknown>`.

## Emits

| Event               | Payload                          | Description                                              |
| -------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `update:modelValue` | `boolean \| CheckboxItemValue[]`  | Emitted whenever the native checkbox toggles, via `v-model`. |
| `onFocus`            | `FocusEvent`                       | Emitted when the input gains focus.                       |
| `onBlur`             | `FocusEvent`                       | Emitted when the input loses focus.                        |

## Slots

| Slot    | Description                                                                    |
| ------- | ---------------------------------------------------------------------------------- |
| `label` | Renders inside the `<label>`, replacing the static `label` prop text.              |
| `link`  | Renders inside the `<label>`, after the label content (typically for an inline link). |

## Accessibility

- The input always exposes `label` as its `aria-label`, whether the visible text comes from the
  `label` prop or the `label` slot, and even when `hideLabel` removes the `<label>` element.
- The `<label for>`/`id` pairing (via `useId()`) associates the visible label with the input when
  `hideLabel` is `false`, in addition to the `aria-label`.
- When `validations` is set, the input gets `aria-describedby` pointing at the error span's id,
  and the error span itself has `role="alert"` so assistive technology announces it.
- The decorative icon `<span>` and its inner `<svg>` are both marked `aria-hidden="true"`
  (`role="img"` is also present on the SVG, which is redundant with `aria-hidden`), so the visible
  check mark never gets announced independently of the native checkbox state.
- Consumers building a checkbox group are responsible for wrapping the group in a `fieldset`/
  `legend` (or `role="group"` with an accessible name) if the group as a whole needs to be
  announced — `adpt-checkbox` only handles the accessibility of each individual input.
