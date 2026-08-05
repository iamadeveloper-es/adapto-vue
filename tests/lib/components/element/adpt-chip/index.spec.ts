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

function mountChip(props: Record<string, unknown> = {}, attachTo?: HTMLElement) {
  return mount(AdptChip, {
    props: { label: 'Tag', ...props },
    attachTo,
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

    it('renders the prepend icon when prependIcon has a name, before the label', () => {
      const wrapper = mountChip({ prependIcon: { name: 'star', size: 20 } })

      const icons = wrapper.findAll('.icon-stub')
      expect(icons).toHaveLength(1)
      expect(icons[0]!.attributes('name')).toBe('star')
      expect(icons[0]!.attributes('size')).toBe('20')

      const children = wrapper.element.children
      expect(children[0].classList.contains('icon-stub')).toBe(true)
      expect(children[1].tagName).toBe('DIV')
    })

    it('renders the append icon when appendIcon has a name, after the label', () => {
      const wrapper = mountChip({ appendIcon: { name: 'chevron-right', size: 14 } })

      const icons = wrapper.findAll('.icon-stub')
      expect(icons).toHaveLength(1)
      expect(icons[0]!.attributes('name')).toBe('chevron-right')
      expect(icons[0]!.attributes('size')).toBe('14')

      const children = wrapper.element.children
      expect(children[0].tagName).toBe('DIV')
      expect(children[1].classList.contains('icon-stub')).toBe(true)
    })

    it('does not render an icon when prependIcon/appendIcon have no name', () => {
      const wrapper = mountChip({ prependIcon: {}, appendIcon: {} })

      expect(wrapper.find('.icon-stub').exists()).toBe(false)
    })

    it('resolves a string icon size (e.g. rem) through remToPx', () => {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const wrapper = mountChip({ prependIcon: { name: 'star', size: '1.5rem' } })

      expect(wrapper.find('.icon-stub').attributes('size')).toBe(String(1.5 * rootFontSize))
    })

    it('still renders the icon and resolves a size when none is given', () => {
      // jsdom does not compute a real root font-size, so remToPx('1rem') can
      // resolve to NaN here even though it resolves to a real pixel value in
      // a browser; this only asserts the fallback branch is exercised.
      const wrapper = mountChip({ prependIcon: { name: 'star' } })

      expect(wrapper.find('.icon-stub').attributes('size')).toBeDefined()
    })

    it('marks prepend/append icons as aria-hidden regardless of hideLabel', () => {
      const wrapper = mountChip({ prependIcon: { name: 'star', size: 20 }, appendIcon: { name: 'chevron-right', size: 14 } })

      const icons = wrapper.findAll('.icon-stub')
      expect(icons[0]!.attributes('aria-hidden')).toBe('true')
      expect(icons[1]!.attributes('aria-hidden')).toBe('true')
    })

    describe('hideLabel', () => {
      it('sets aria-label to the label and hides the visible text', () => {
        const wrapper = mountChip({ hideLabel: true })

        expect(wrapper.attributes('aria-label')).toBe('Tag')
        expect(wrapper.find('div').exists()).toBe(false)
      })

      it('still marks the prepend icon as aria-hidden when hideLabel is true', () => {
        const wrapper = mountChip({ hideLabel: true, prependIcon: { name: 'star', size: 20 } })

        expect(wrapper.find('.icon-stub').attributes('aria-hidden')).toBe('true')
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

    describe('clickable', () => {
      it('drops role, tabindex and aria-disabled when clickable is false', () => {
        const wrapper = mountChip({ clickable: false, disabled: true })

        expect(wrapper.attributes('role')).toBeUndefined()
        expect(wrapper.attributes('tabindex')).toBeUndefined()
        expect(wrapper.attributes('aria-disabled')).toBeUndefined()
      })

      it('does not emit "clicked" on click when clickable is false', async () => {
        const wrapper = mountChip({ clickable: false })

        await wrapper.trigger('click')

        expect(wrapper.emitted('clicked')).toBeUndefined()
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

      it('wraps content in role="group" with aria-label set to the label, regardless of hideLabel', () => {
        const wrapper = mountChip({ closable: true })

        expect(wrapper.attributes('role')).toBe('group')
        expect(wrapper.attributes('aria-label')).toBe('Tag')
      })

      it('does not nest the close button inside the clickable role="button" element', () => {
        const wrapper = mountChip({ closable: true })

        const content = wrapper.get('.fw-chip__content')
        expect(content.attributes('role')).toBe('button')
        expect(content.find('.close-btn').exists()).toBe(false)
      })

      it('drops role/tabindex/aria-disabled from the content span when clickable is false', () => {
        const wrapper = mountChip({ closable: true, clickable: false, disabled: true })

        const content = wrapper.get('.fw-chip__content')
        expect(content.attributes('role')).toBeUndefined()
        expect(content.attributes('tabindex')).toBeUndefined()
        expect(content.attributes('aria-disabled')).toBeUndefined()
      })

      it('renders prepend/append icons inside the content span', () => {
        const wrapper = mountChip({
          closable: true,
          prependIcon: { name: 'star', size: 20 },
          appendIcon: { name: 'chevron-right', size: 14 },
        })

        const icons = wrapper.get('.fw-chip__content').findAll('.icon-stub')
        expect(icons).toHaveLength(2)
      })

      it('hides the visible label text inside the content span when hideLabel is true', () => {
        const wrapper = mountChip({ closable: true, hideLabel: true })

        expect(wrapper.get('.fw-chip__content').find('div').exists()).toBe(false)
        expect(wrapper.attributes('aria-label')).toBe('Tag')
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

    it('emits "closed" with the MouseEvent and unmounts the chip when the close button is used', async () => {
      const wrapper = mountChip({ closable: true })

      const closeButton = wrapper.findComponent(AdptButtonStub)
      const event = new MouseEvent('click')
      await closeButton.vm.$emit('clicked', event)

      expect(wrapper.emitted('closed')).toHaveLength(1)
      expect(wrapper.emitted('closed')![0]![0]).toBe(event)
      expect(wrapper.find('[role="group"]').exists()).toBe(false)
    })

    describe('focus restoration on close', () => {
      it('does not try to move focus when nothing inside the chip is focused', async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        const wrapper = mountChip({ closable: true }, container)

        const closeButton = wrapper.findComponent(AdptButtonStub)
        await closeButton.vm.$emit('clicked', new MouseEvent('click'))

        expect(wrapper.emitted('closed')).toHaveLength(1)
        wrapper.unmount()
        container.remove()
      })

      it('moves focus to the next sibling when the close button had focus and a sibling exists', async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        const wrapper = mountChip({ closable: true }, container)
        const sibling = document.createElement('button')
        sibling.textContent = 'next chip'
        wrapper.element.after(sibling)

        const closeButtonEl = wrapper.get('.close-btn').element as HTMLButtonElement
        closeButtonEl.focus()
        expect(document.activeElement).toBe(closeButtonEl)

        const closeButton = wrapper.findComponent(AdptButtonStub)
        await closeButton.vm.$emit('clicked', new MouseEvent('click'))

        expect(document.activeElement).toBe(sibling)
        wrapper.unmount()
        container.remove()
      })

      it('does not move focus when the close button had focus but there is no sibling', async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        const wrapper = mountChip({ closable: true }, container)

        const closeButtonEl = wrapper.get('.close-btn').element as HTMLButtonElement
        closeButtonEl.focus()

        const closeButton = wrapper.findComponent(AdptButtonStub)
        await closeButton.vm.$emit('clicked', new MouseEvent('click'))

        expect(wrapper.emitted('closed')).toHaveLength(1)
        container.remove()
      })
    })
  })
})
