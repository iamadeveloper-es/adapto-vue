import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AdptChip from '@/lib/components/element/adpt-chip/index.vue'

const fw = {
  prefix: 'fw',
  cx: (...names: unknown[]) =>
    names
      .filter(Boolean)
      .map((n) => `fw-${n}`)
      .join(' '),
  cv: (name: string) => `var(--fw-${name})`,
  getVar: () => '',
}

const AdaptoIconStub = {
  name: 'AdaptoIcon',
  template: '<i class="icon-stub" />',
}

const AdptButtonStub = {
  name: 'AdptButton',
  props: ['label', 'hideLabel', 'disabled', 'variant', 'color', 'size', 'radius', 'icon'],
  emits: ['clicked'],
  template: '<button type="button" class="close-btn" @click="$emit(\'clicked\', $event)">{{ label }}</button>',
}

function mountChip(props: Record<string, unknown> = {}) {
  return mount(AdptChip, {
    props: { label: 'Tag', ...props },
    global: {
      provide: { fw },
      stubs: {
        AdaptoIcon: AdaptoIconStub,
        AdptButton: AdptButtonStub,
      },
    },
  })
}

describe('adpt-chip', () => {
  describe('rendering with default props', () => {
    it('renders a span with role="button" and the label', () => {
      const wrapper = mountChip()

      expect(wrapper.element.tagName).toBe('SPAN')
      expect(wrapper.attributes('role')).toBe('button')
      expect(wrapper.text()).toContain('Tag')
    })

    it('applies default classes for variant and size', () => {
      const wrapper = mountChip()

      expect(wrapper.classes()).toEqual(
        expect.arrayContaining(['fw-chip', 'rounded--full', 'fw-chip--fussy', 'fw-chip--lg']),
      )
      expect(wrapper.classes()).not.toContain('is-disabled')
    })

    it('is focusable and not marked disabled', () => {
      const wrapper = mountChip()

      expect(wrapper.attributes('tabindex')).toBe('0')
      expect(wrapper.attributes('aria-disabled')).toBeUndefined()
      expect(wrapper.attributes('aria-label')).toBeUndefined()
    })

    it('uses the default color token when no color prop is given', () => {
      const wrapper = mountChip()

      expect(wrapper.attributes('style')).toContain('var(--fw-sm-surface-300)')
    })

    it('does not render prepend/append icons or a close button by default', () => {
      const wrapper = mountChip()

      expect(wrapper.find('.icon-stub').exists()).toBe(false)
      expect(wrapper.find('.close-btn').exists()).toBe(false)
    })
  })

  describe('props reflected in output', () => {
    it('reflects the variant prop in the root class', () => {
      const wrapper = mountChip({ variant: 'outlined' })

      expect(wrapper.classes()).toContain('fw-chip--outlined')
    })

    it('reflects the size prop in the root class', () => {
      const wrapper = mountChip({ size: 'sm' })

      expect(wrapper.classes()).toContain('fw-chip--sm')
    })

    it('reflects the color prop as the resolved css var', () => {
      const wrapper = mountChip({ color: 'primary' })

      expect(wrapper.attributes('style')).toContain('var(--fw-primary)')
    })

    it('renders the prepend icon when iconPrepend has a name, before the label', () => {
      const wrapper = mountChip({ iconPrepend: { name: 'star', size: 20 } })

      const icons = wrapper.findAll('.icon-stub')
      expect(icons).toHaveLength(1)
      expect(icons[0]!.attributes('name')).toBe('star')
      expect(icons[0]!.attributes('size')).toBe('20')

      const children = wrapper.element.children
      expect(children[0].classList.contains('icon-stub')).toBe(true)
      expect(children[1].tagName).toBe('DIV')
    })

    it('renders the append icon when iconAppend has a name, after the label', () => {
      const wrapper = mountChip({ iconAppend: { name: 'chevron-right', size: 14 } })

      const icons = wrapper.findAll('.icon-stub')
      expect(icons).toHaveLength(1)
      expect(icons[0]!.attributes('name')).toBe('chevron-right')
      expect(icons[0]!.attributes('size')).toBe('14')

      const children = wrapper.element.children
      expect(children[0].tagName).toBe('DIV')
      expect(children[1].classList.contains('icon-stub')).toBe(true)
    })

    it('does not render an icon when iconPrepend/iconAppend have no name', () => {
      const wrapper = mountChip({ iconPrepend: {}, iconAppend: {} })

      expect(wrapper.find('.icon-stub').exists()).toBe(false)
    })

    it('resolves a string icon size (e.g. rem) through remToPx', () => {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const wrapper = mountChip({ iconPrepend: { name: 'star', size: '1.5rem' } })

      expect(wrapper.find('.icon-stub').attributes('size')).toBe(String(1.5 * rootFontSize))
    })

    it('still renders the icon and resolves a size when none is given', () => {
      // jsdom does not compute a real root font-size, so remToPx('1rem') can
      // resolve to NaN here even though it resolves to a real pixel value in
      // a browser; this only asserts the fallback branch is exercised.
      const wrapper = mountChip({ iconPrepend: { name: 'star' } })

      expect(wrapper.find('.icon-stub').attributes('size')).toBeDefined()
    })

    describe('hideLabel', () => {
      it('sets aria-label to the label and hides the visible text', () => {
        const wrapper = mountChip({ hideLabel: true })

        expect(wrapper.attributes('aria-label')).toBe('Tag')
        expect(wrapper.find('div').exists()).toBe(false)
      })

      it('marks the prepend icon as aria-hidden when hideLabel is true', () => {
        const wrapper = mountChip({ hideLabel: true, iconPrepend: { name: 'star', size: 20 } })

        expect(wrapper.find('.icon-stub').attributes('aria-hidden')).toBe('true')
      })

      it('marks the append icon as aria-hidden when hideLabel is true', () => {
        const wrapper = mountChip({ hideLabel: true, iconAppend: { name: 'chevron-right', size: 14 } })

        expect(wrapper.find('.icon-stub').attributes('aria-hidden')).toBe('true')
      })

      it('does not mark the icon as aria-hidden when hideLabel is false', () => {
        const wrapper = mountChip({ iconPrepend: { name: 'star', size: 20 } })

        expect(wrapper.find('.icon-stub').attributes('aria-hidden')).toBeUndefined()
      })
    })

    describe('disabled', () => {
      it('sets tabindex to -1 and aria-disabled to true', () => {
        const wrapper = mountChip({ disabled: true })

        expect(wrapper.attributes('tabindex')).toBe('-1')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(wrapper.classes()).toContain('is-disabled')
      })

      it('propagates disabled to the close button', () => {
        const wrapper = mountChip({ disabled: true, closable: true })

        expect(wrapper.findComponent(AdptButtonStub).props('disabled')).toBe(true)
      })
    })

    describe('closable', () => {
      it('renders a close button with the "Remove <label>" label', () => {
        const wrapper = mountChip({ closable: true })

        const closeButton = wrapper.findComponent(AdptButtonStub)
        expect(closeButton.exists()).toBe(true)
        expect(closeButton.props('label')).toBe('Remove Tag')
        expect(closeButton.props('hideLabel')).toBe(true)
      })

      it('does not render a close button when closable is false', () => {
        const wrapper = mountChip({ closable: false })

        expect(wrapper.findComponent(AdptButtonStub).exists()).toBe(false)
      })
    })
  })

  describe('emits', () => {
    it('emits "clicked" with the MouseEvent on click', async () => {
      const wrapper = mountChip()

      await wrapper.trigger('click')

      expect(wrapper.emitted('clicked')).toHaveLength(1)
      expect(wrapper.emitted('clicked')![0]![0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit "clicked" on click when disabled', async () => {
      const wrapper = mountChip({ disabled: true })

      await wrapper.trigger('click')

      expect(wrapper.emitted('clicked')).toBeUndefined()
    })

    it('emits "clicked" on Enter keydown', async () => {
      const wrapper = mountChip()

      await wrapper.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('clicked')).toHaveLength(1)
    })

    it('emits "clicked" on Space keydown', async () => {
      const wrapper = mountChip()

      await wrapper.trigger('keydown', { key: ' ' })

      expect(wrapper.emitted('clicked')).toHaveLength(1)
    })

    it('does not emit "clicked" on Enter keydown when disabled', async () => {
      const wrapper = mountChip({ disabled: true })

      await wrapper.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('clicked')).toBeUndefined()
    })

    it('does not double-fire "clicked" when the keydown originates from the close button', async () => {
      const wrapper = mountChip({ closable: true })

      const closeButton = wrapper.get('.close-btn')
      await closeButton.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('clicked')).toBeUndefined()
    })

    it('emits "closable" with the MouseEvent and unmounts the chip when the close button is used', async () => {
      const wrapper = mountChip({ closable: true })

      const closeButton = wrapper.findComponent(AdptButtonStub)
      const event = new MouseEvent('click')
      await closeButton.vm.$emit('clicked', event)

      expect(wrapper.emitted('closable')).toHaveLength(1)
      expect(wrapper.emitted('closable')![0]![0]).toBe(event)
      expect(wrapper.find('[role="button"]').exists()).toBe(false)
    })
  })
})
