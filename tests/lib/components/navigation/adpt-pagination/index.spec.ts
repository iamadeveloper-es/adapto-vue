import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AdaptoPagination from '@/lib/components/navigation/adpt-pagination/index.vue'

const fwMock = {
  prefix: 'fw',
  cx: (...names: string[]) => names.filter(Boolean).map((n) => `fw-${n}`).join(' '),
  cv: (name: string) => `var(--fw-${name})`,
  getVar: (name: string) => `var(--fw-${name})`,
}

// AdaptoButton is not the subject under test: stub it with a minimal button that
// forwards the props pagination cares about (disabled/label/color/icon/...) so we can
// assert on them via `.props()`, and re-emits `clicked` so we can simulate interaction.
const AdaptoButtonStub = {
  name: 'AdaptoButton',
  props: {
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
    color: { type: String, default: '' },
    size: { type: String, default: '' },
    variant: { type: String, default: '' },
    hideLabel: { type: Boolean, default: false },
    icon: { type: Object, default: () => ({}) },
  },
  emits: ['clicked'],
  template: `<button type="button" :disabled="disabled" @click="$emit('clicked', $event)">{{ label }}</button>`,
}

function mountComponent(props: Record<string, unknown> = {}) {
  return mount(AdaptoPagination, {
    props,
    global: {
      provide: {
        fw: fwMock,
      },
      stubs: {
        AdaptoButton: AdaptoButtonStub,
      },
    },
  })
}

function buttons(wrapper: ReturnType<typeof mountComponent>) {
  return wrapper.findAllComponents({ name: 'AdaptoButton' })
}

describe('adpt-pagination', () => {
  it('renders correctly with default props', () => {
    const wrapper = mountComponent()
    const nav = wrapper.get('nav')

    expect(nav.attributes('role')).toBe('navigation')
    expect(nav.attributes('aria-label')).toBe('Paginación')
    expect(nav.classes()).toContain('fw-pagination')
    expect(wrapper.find('ul').classes()).toContain('fw-pagination__list')

    // length defaults to 0, showLastFirst defaults to false: only prev/next render.
    expect(buttons(wrapper)).toHaveLength(2)
  })

  it('applies a custom ariaLabel to the nav element', () => {
    const wrapper = mountComponent({ ariaLabel: 'Pagination controls', length: 3 })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Pagination controls')
  })

  it('renders one list item per page plus prev/next by default', () => {
    const wrapper = mountComponent({ length: 3, modelValue: 1 })
    const items = wrapper.findAll('li')

    // prev, page1, page2, page3, next
    expect(items).toHaveLength(5)
    expect(buttons(wrapper)).toHaveLength(5)
  })

  it('renders first/last controls only when showLastFirst is true', () => {
    const wrapper = mountComponent({ length: 3, modelValue: 2, showLastFirst: true })
    const items = wrapper.findAll('li')

    // first, prev, page1, page2, page3, next, last
    expect(items).toHaveLength(7)
    expect(buttons(wrapper)).toHaveLength(7)
  })

  it('marks the current page item with the active class and leaves the rest unmarked', () => {
    const wrapper = mountComponent({ length: 3, modelValue: 2 })
    const items = wrapper.findAll('li')
    // items[0] is the prev button, pages start at items[1]
    const [, page1, page2, page3] = items

    expect(page1.classes()).not.toContain('active')
    expect(page2.classes()).toContain('active')
    expect(page3.classes()).not.toContain('active')
  })

  it('labels each page button with its 1-based page number', () => {
    const wrapper = mountComponent({ length: 3, modelValue: 1 })
    const [, page1, page2, page3] = buttons(wrapper)

    expect(page1.props('label')).toBe('1')
    expect(page2.props('label')).toBe('2')
    expect(page3.props('label')).toBe('3')
  })

  describe('icon props forwarded to the prev/next/first/last buttons', () => {
    it('uses the default chevron icons', () => {
      const wrapper = mountComponent({ length: 3, modelValue: 2, showLastFirst: true })
      const [first, prev, , , , next, last] = buttons(wrapper)

      expect(first.props('icon')).toEqual({ name: 'chevron-first' })
      expect(prev.props('icon')).toEqual({ name: 'chevron-left' })
      expect(next.props('icon')).toEqual({ name: 'chevron-right' })
      expect(last.props('icon')).toEqual({ name: 'chevron-last' })
    })

    it('uses custom icon names when provided', () => {
      const wrapper = mountComponent({
        length: 3,
        modelValue: 2,
        showLastFirst: true,
        firstPageIcon: 'arrow-first',
        previousIcon: 'arrow-left',
        nextIcon: 'arrow-right',
        lastPageIcon: 'arrow-last',
      })
      const [first, prev, , , , next, last] = buttons(wrapper)

      expect(first.props('icon')).toEqual({ name: 'arrow-first' })
      expect(prev.props('icon')).toEqual({ name: 'arrow-left' })
      expect(next.props('icon')).toEqual({ name: 'arrow-right' })
      expect(last.props('icon')).toEqual({ name: 'arrow-last' })
    })

    it('hides the text label on prev/next/first/last buttons', () => {
      const wrapper = mountComponent({ length: 3, modelValue: 2, showLastFirst: true })
      const [first, prev, , , , next, last] = buttons(wrapper)

      expect(first.props('hideLabel')).toBe(true)
      expect(prev.props('hideLabel')).toBe(true)
      expect(next.props('hideLabel')).toBe(true)
      expect(last.props('hideLabel')).toBe(true)
    })
  })

  describe('color resolution', () => {
    it('gives the active page the activeColor and the rest the color prop', () => {
      const wrapper = mountComponent({
        length: 3,
        modelValue: 2,
        color: 'secondary-400',
        activeColor: 'secondary-500',
      })
      const [, page1, page2, page3] = buttons(wrapper)

      expect(page1.props('color')).toBe('secondary-400')
      expect(page2.props('color')).toBe('secondary-500')
      expect(page3.props('color')).toBe('secondary-400')
    })

    it('falls back to an "on-<color>" variant for inactive pages when color is falsy', () => {
      // NOTE: with color === '', `setButtonColor` (index.vue) evaluates
      // `props.color ? props.color : \`on-${props.color}\`` which, since props.color is
      // falsy, resolves to the literal string "on-" for every inactive page. This looks
      // like a latent bug (an empty color prop should probably fall back to a sensible
      // default token, not "on-"), so this test only documents current behavior.
      const wrapper = mountComponent({ length: 2, modelValue: 1, color: '' })
      const [, page1, page2] = buttons(wrapper)

      expect(page1.props('color')).toBe('secondary-500') // active page still uses activeColor
      expect(page2.props('color')).toBe('on-')
    })
  })

  describe('disabled state', () => {
    it('disables prev/first on the first page and next/last on the last page', () => {
      const wrapper = mountComponent({ length: 3, modelValue: 1, showLastFirst: true })
      const [first, prev, , , , next, last] = buttons(wrapper)

      expect(first.props('disabled')).toBe(true)
      expect(prev.props('disabled')).toBe(true)
      expect(next.props('disabled')).toBe(false)
      expect(last.props('disabled')).toBe(false)
    })

    it('disables next/last on the last page while prev/first stay enabled', () => {
      const wrapper = mountComponent({ length: 3, modelValue: 3, showLastFirst: true })
      const [first, prev, , , , next, last] = buttons(wrapper)

      expect(first.props('disabled')).toBe(false)
      expect(prev.props('disabled')).toBe(false)
      expect(next.props('disabled')).toBe(true)
      expect(last.props('disabled')).toBe(true)
    })

    it('disables every button, including page items, when disabled is true', () => {
      const wrapper = mountComponent({ length: 3, modelValue: 2, showLastFirst: true, disabled: true })

      for (const button of buttons(wrapper)) {
        expect(button.props('disabled')).toBe(true)
      }
    })

    it('does not disable boundary nav buttons by page position alone when disabled is false', () => {
      const wrapper = mountComponent({ length: 3, modelValue: 2 })
      const [, page1, page2, page3] = buttons(wrapper)

      // Page items only reflect the top-level `disabled` prop, not page position.
      expect(page1.props('disabled')).toBe(false)
      expect(page2.props('disabled')).toBe(false)
      expect(page3.props('disabled')).toBe(false)
    })
  })

  describe('emitted events', () => {
    it('emits update:modelValue with the clicked page number', async () => {
      const wrapper = mountComponent({ length: 3, modelValue: 1 })
      const [, , page2] = buttons(wrapper)

      await page2.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    })

    it('emits update:modelValue with the previous page on prev click', async () => {
      const wrapper = mountComponent({ length: 3, modelValue: 2 })
      const [prev] = buttons(wrapper)

      await prev.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    })

    it('does not emit on prev click when already on the first page', async () => {
      const wrapper = mountComponent({ length: 3, modelValue: 1 })
      const [prev] = buttons(wrapper)

      await prev.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits update:modelValue with the next page on next click', async () => {
      const wrapper = mountComponent({ length: 3, modelValue: 2 })
      const [, , , , next] = buttons(wrapper)

      await next.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
    })

    it('does not emit on next click when already on the last page', async () => {
      const wrapper = mountComponent({ length: 3, modelValue: 3 })
      const [, , , , next] = buttons(wrapper)

      await next.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits update:modelValue with page 1 on first-page click', async () => {
      const wrapper = mountComponent({ length: 5, modelValue: 4, showLastFirst: true })
      const [first] = buttons(wrapper)

      await first.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    })

    it('does not emit on first-page click when already on page 1', async () => {
      const wrapper = mountComponent({ length: 5, modelValue: 1, showLastFirst: true })
      const [first] = buttons(wrapper)

      await first.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits update:modelValue with the last page on last-page click', async () => {
      const wrapper = mountComponent({ length: 5, modelValue: 2, showLastFirst: true })
      // With showLastFirst the last control is always the final rendered button,
      // regardless of how many page items sit in between.
      const last = buttons(wrapper).at(-1)!

      await last.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toEqual([[5]])
    })

    it('does not emit on last-page click when already on the last page', async () => {
      const wrapper = mountComponent({ length: 5, modelValue: 5, showLastFirst: true })
      const last = buttons(wrapper).at(-1)!

      await last.vm.$emit('clicked')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
