# Accordion List

`adpt-accordion-list` is a lightweight coordination wrapper for [`AdaptoAccordion`](./adpt-accordion)
items. It has no visual style of its own — it renders a plain `<div>` around its slot content — and
exists purely to provide shared state so that only one child accordion can be open at a time.

- **Component name:** `AdaptoAccordionList`
- **Source:** `src/lib/components/element/adpt-accordion-list/index.vue`
- **Styles:** none (`style.scss` not present; this component only renders a wrapper `<div>`)

## Usage

Once [`AdaptoPlugin`](../../src/lib/plugin.ts) is installed on the app, `AdaptoAccordionList` is
available globally. Wrap two or more `AdaptoAccordion` items in it to link them together:

```vue-html
<AdaptoAccordionList>
  <AdaptoAccordion title="First item">
    Content of the first item.
  </AdaptoAccordion>
  <AdaptoAccordion title="Second item">
    Content of the second item.
  </AdaptoAccordion>
</AdaptoAccordionList>
```

`AdaptoAccordionList` accepts no props and emits no events — it works purely through slot content
and an internal `provide`/`inject` context.

## Single-open coordination

`AdaptoAccordionList` provides an `AccordionKey` injection context — an `opened` ref (the `id` of
the currently open accordion, or `null`), an `isList: true` flag, and a `toggle(id)` function. Each
child `AdaptoAccordion` injects this context (falling back to its own local `modelValue` when no
list ancestor exists) and calls `toggle(id)` instead of managing its own open state.

Opening one accordion in the list closes whichever one was previously open, and clicking the title
of the currently open accordion again closes it, leaving none open. Try it below:

<div class="demo" style="display: block;">
  <AdaptoAccordionList>
    <AdaptoAccordion title="What is Adapto UI?">
      A Vue 3 + TypeScript component library installable as a plugin, with a token-based theming system.
    </AdaptoAccordion>
    <AdaptoAccordion title="How does theming work?">
      Styles are generated from a base theme (Atlas) merged with overrides, then injected at runtime as CSS custom properties.
    </AdaptoAccordion>
    <AdaptoAccordion title="Can accordions be disabled?">
      Yes, each AdaptoAccordion accepts its own `disabled` prop independently of the list.
    </AdaptoAccordion>
  </AdaptoAccordionList>
</div>

```vue-html
<AdaptoAccordionList>
  <AdaptoAccordion title="What is Adapto UI?">
    A Vue 3 + TypeScript component library installable as a plugin, with a token-based theming system.
  </AdaptoAccordion>
  <AdaptoAccordion title="How does theming work?">
    Styles are generated from a base theme (Atlas) merged with overrides, then injected at runtime as CSS custom properties.
  </AdaptoAccordion>
  <AdaptoAccordion title="Can accordions be disabled?">
    Yes, each AdaptoAccordion accepts its own `disabled` prop independently of the list.
  </AdaptoAccordion>
</AdaptoAccordionList>
```

::: tip Without a list
An `AdaptoAccordion` rendered outside of an `AdaptoAccordionList` still works — it falls back to
its own local `modelValue`/`update:modelValue` v-model, opening and closing independently of any
sibling accordions. See the [Accordion](./adpt-accordion) page for that standalone usage.
:::

## Props

None. `AdaptoAccordionList` declares no props.

## Emits

None. `AdaptoAccordionList` declares no emits.

## Slots

| Slot      | Description                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------- |
| `default` | Expects one or more `AdaptoAccordion` children. There is no fallback content if left empty.       |

## Accessibility

`AdaptoAccordionList` itself carries no ARIA attributes — it is a plain, unstyled `<div>` used only
to share single-open-accordion state via `provide`/`inject`. All accessible markup (the toggle
`<button>`, the `role="region"` content panel) lives on each individual `AdaptoAccordion`; see that
component's own Accessibility section for details. The single-open behavior it coordinates matches
the expected keyboard/screen-reader pattern for a standard accordion group, where opening one panel
closes the others.
