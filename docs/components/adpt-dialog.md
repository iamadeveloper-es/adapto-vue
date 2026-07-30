# Dialog

`adpt-dialog` is a modal built on the native `<dialog>` element. It handles its own open/close
animation, backdrop click-to-close, `Escape` handling, and a Tab/Shift+Tab focus trap, and exposes
its state exclusively through named slots (`header`, `body`, `footer`) and an imperative
`open()`/`close()` API.

- **Component name:** `VkDialog` — a legacy inconsistency in the internal `defineOptions` name
  (documented in `.claude/CLAUDE.md`, not a pattern to copy). It is registered globally as
  `AdaptoDialog`, like every other component.
- **Source:** `src/lib/components/overlay/adpt-dialog/index.vue`
- **Styles:** `src/lib/components/overlay/adpt-dialog/style.scss` (registered in `AdaptoPlugin`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoDialog` is
available globally. It renders closed by default — there is no `modelValue`/`open` prop to
control it declaratively. Instead, grab a template ref and call the exposed `open()`/`close()`
methods:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const basicDialog = ref()
const backdropDialog = ref()
const plainDialog = ref()
const status = ref('closed')
</script>

<div class="demo">
  <AdaptoButton label="Open dialog" color="primary-500" @clicked="basicDialog.open()" />
  <AdaptoDialog
    ref="basicDialog"
    label="Example dialog"
    @opened="status = 'opened'"
    @closed="status = 'closed'"
  >
    <template #header>
      <h3>Dialog title</h3>
    </template>
    <template #body>
      <p>Dialog body content — this block scrolls internally once it exceeds 340px of height.</p>
    </template>
    <template #footer>
      <AdaptoButton label="Close" color="primary-500" @clicked="basicDialog.close()" />
    </template>
  </AdaptoDialog>
  <span>Status: {{ status }}</span>
</div>

```vue-html
<AdaptoButton label="Open dialog" color="primary-500" @clicked="dialogRef.open()" />

<AdaptoDialog
  ref="dialogRef"
  label="Example dialog"
  @opened="onOpened"
  @closed="onClosed"
>
  <template #header><h3>Dialog title</h3></template>
  <template #body><p>Dialog body content.</p></template>
  <template #footer>
    <AdaptoButton label="Close" color="primary-500" @clicked="dialogRef.close()" />
  </template>
</AdaptoDialog>
```

```ts
import { ref } from 'vue'

const dialogRef = ref()
```

A close button (a hardcoded icon-only `AdaptoButton`, `variant="soft"` `size="sm"` `radius="full"`
`icon="x"`) is always rendered inside the dialog regardless of which slots are used — there is no
slot to replace or remove it.

## Header, body & footer slots

`header`, `body` and `footer` are each rendered only when the corresponding slot is actually
passed — an empty dialog with no slots renders just the close button. The `header` and `body`
wrappers also drive the dialog's accessible name/description (see [Accessibility](#accessibility)
below): when no `header` slot is present, the `label` prop is used as `aria-label` instead.

<div class="demo">
  <AdaptoButton label="Open (no header)" color="primary-500" @clicked="plainDialog.open()" />
  <AdaptoDialog ref="plainDialog" label="Accessible name via aria-label">
    <template #body>
      <p>No <code>header</code> slot is passed here, so <code>label</code> becomes the dialog's
      <code>aria-label</code> instead of driving <code>aria-labelledby</code>.</p>
    </template>
  </AdaptoDialog>
</div>

```vue-html
<AdaptoDialog ref="dialogRef" label="Accessible name via aria-label">
  <template #body>
    <p>No header slot passed — label becomes aria-label.</p>
  </template>
</AdaptoDialog>
```

## Backdrop click

By default, clicking outside the dialog's content closes it. `blockBackdrop` disables that
behavior, requiring the consumer to close the dialog explicitly (via the built-in close button,
`Escape`, or a call to `close()`).

<div class="demo">
  <AdaptoButton label="Open (backdrop blocked)" color="danger-600" @clicked="backdropDialog.open()" />
  <AdaptoDialog ref="backdropDialog" label="Blocked backdrop" block-backdrop>
    <template #body>
      <p>Clicking outside this dialog does nothing — only the close button or <kbd>Esc</kbd>
      closes it.</p>
    </template>
  </AdaptoDialog>
</div>

```vue-html
<AdaptoDialog ref="dialogRef" label="Blocked backdrop" block-backdrop>
  <template #body><p>Only the close button or Esc closes this dialog.</p></template>
</AdaptoDialog>
```

::: tip How the backdrop click is detected
`handleBackdrop()` doesn't check `event.target` — it compares the click's coordinates against the
dialog element's bounding rect. A click anywhere outside that rect (i.e. on the native
`::backdrop`) triggers `close()`, unless `blockBackdrop` is `true`.
:::

## Animation & timing

Opening and closing both animate opacity/scale via the `is-visible` and `is-closing` class
modifiers (`--duration: 0.24s`, applied to both the dialog panel and its `::backdrop`):

- **`open()`** — calls the native `showModal()` immediately and emits `update:modelValue(true)`
  synchronously, then waits 16ms before adding `is-visible` and emitting `opened` (giving the
  browser a frame to apply the initial closed state before transitioning).
- **`close()`** — adds `is-closing` and emits `update:modelValue(false)` immediately, then waits
  the full 240ms transition before calling the native `close()`, restoring focus to the
  previously focused element, and emitting `closed`.

Both timers are cleared on unmount and whenever `open()`/`close()` is called again, so rapid
toggling can't leave a stale timer running.

## Props

| Prop            | Type      | Default | Description                                                                 |
| ---------------- | --------- | ------- | ----------------------------------------------------------------------------- |
| `blockBackdrop`   | `boolean` | `false` | If `true`, clicking the backdrop does not close the dialog.                  |
| `label`           | `string`  | `''`    | `aria-label` for the dialog. Only used when no `header` slot is provided.    |

There is no `modelValue`/`open` prop: the dialog's open state lives entirely inside the component
and is driven by the exposed `open()`/`close()` methods, not by a prop binding. `v-model` on
`AdaptoDialog` is therefore **not** a two-way controlled binding — it only receives the
`update:modelValue` notifications below, it cannot be used to programmatically open the dialog by
setting the bound value.

## Emits

| Event                | Payload                                | Description                                                                 |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `opened`               | none                                     | Emitted ~16ms after `open()` is called, once the dialog is confirmed open.  |
| `closed`               | none                                     | Emitted ~240ms after `close()` is called, once the close transition ends.   |
| `update:modelValue`    | `boolean` (`true` opening / `false` closing) | Emitted synchronously at the start of `open()`/`close()` — notification only, see the note above. |

## Slots

| Slot      | Description                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------- |
| `header`  | Rendered in a `div` with an auto-generated id (bound to `aria-labelledby`). Only shown if the slot is passed. |
| `body`    | Rendered in a `div` with an auto-generated id (bound to `aria-describedby`), `max-height: 340px` and internal scroll. Only shown if the slot is passed. |
| `footer`  | Rendered in a plain `div`. Only shown if the slot is passed.                                  |

## Accessibility

- The root is a native `<dialog>` opened via `showModal()`, with `aria-modal="true"`.
- If a `header` slot is present, the dialog gets `aria-labelledby` pointing at that block; if not,
  `aria-label` falls back to the `label` prop (when set).
- If a `body` slot is present, the dialog gets `aria-describedby` pointing at that block.
- **Focus trap:** `Tab`/`Shift+Tab` cycle focus among the dialog's focusable descendants only,
  wrapping from the last back to the first (and vice versa). If no focusable element exists inside,
  focus is kept on the dialog element itself.
- **Focus management:** on `open()`, the currently focused element is remembered and the dialog
  itself receives initial focus; on `close()`, focus is restored to that remembered element once
  the closing transition finishes.
- `Escape` is intercepted (`handleCancel`) to run the same `close()` path as any other close
  trigger, keeping the emitted events and closing animation consistent.
- The close button is always present and always icon-only, with a hardcoded `aria-label="Close
  dialog"` — it does not depend on the `label` prop or any slot.