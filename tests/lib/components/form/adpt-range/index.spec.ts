import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AdaptoRange from '@/lib/components/form/adpt-range/index.vue'

const fwMock = {
  prefix: 'fw',
  cx: (...names: string[]) => names.filter(Boolean).map((n) => `fw-${n}`).join(' '),
  cv: (name: string) => `var(--fw-${name})`,
  getVar: (name: string) => `var(--fw-${name})`,
}

function mountComponent(props: Record<string, unknown> = {}) {
  return mount(AdaptoRange, {
    props,
    global: {
      provide: {
        fw: fwMock,
      },
    },
  })
}

function mockTrackRect(width: number, left = 0) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width,
    left,
    top: 0,
    right: left + width,
    bottom: 0,
    height: 0,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect)
}

describe('adpt-range', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders correctly with default props', () => {
    const wrapper = mountComponent()
    const root = wrapper.get('.fw-range')
    const slider = wrapper.get('[role="slider"]')

    expect(root.classes()).toContain('fw-range')
    expect(root.classes()).not.toContain('fw-range--disabled')
    expect(wrapper.find('.fw-range__wrapper').exists()).toBe(true)
    expect(wrapper.find('.fw-range__track').exists()).toBe(true)
    expect(wrapper.find('.fw-range__fill').exists()).toBe(true)
    expect(wrapper.find('.fw-range__thumb').exists()).toBe(true)

    expect(slider.attributes('aria-valuemin')).toBe('0')
    expect(slider.attributes('aria-valuemax')).toBe('100')
    expect(slider.attributes('aria-valuenow')).toBe('0')
    expect(slider.attributes('aria-valuetext')).toBeUndefined()
    expect(slider.attributes('aria-label')).toBe('Range')
    expect(slider.attributes('aria-disabled')).toBeUndefined()
    expect(slider.attributes('aria-describedby')).toBeUndefined()
    expect(slider.attributes('tabindex')).toBe('0')

    expect(wrapper.find('.fw-range__value').exists()).toBe(false)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  describe('clamping of currentValue', () => {
    it('keeps a value within range rounded to the nearest step', () => {
      const wrapper = mountComponent({ modelValue: 57, step: 10, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      expect(slider.attributes('aria-valuenow')).toBe('60')
    })

    it('clamps a value below min up to min', () => {
      const wrapper = mountComponent({ modelValue: -50, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      expect(slider.attributes('aria-valuenow')).toBe('0')
    })

    it('clamps a value above max down to max', () => {
      const wrapper = mountComponent({ modelValue: 500, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      expect(slider.attributes('aria-valuenow')).toBe('100')
    })

    it('uses min as the effective value when modelValue is undefined', () => {
      const wrapper = mountComponent({ min: 20, max: 80 })
      const slider = wrapper.get('[role="slider"]')

      expect(slider.attributes('aria-valuenow')).toBe('20')
    })
  })

  describe('showValue', () => {
    it('does not render the value span by default', () => {
      const wrapper = mountComponent({ modelValue: 40 })

      expect(wrapper.find('.fw-range__value').exists()).toBe(false)
      expect(wrapper.get('[role="slider"]').attributes('aria-valuetext')).toBeUndefined()
    })

    it('renders the value span and aria-valuetext when showValue is true', () => {
      const wrapper = mountComponent({ modelValue: 40, showValue: true })
      const slider = wrapper.get('[role="slider"]')

      expect(wrapper.get('.fw-range__value').text()).toBe('40')
      expect(slider.attributes('aria-valuetext')).toBe('40')
    })
  })

  describe('validations', () => {
    it('does not render an alert message when validations is not set', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
      expect(wrapper.get('[role="slider"]').attributes('aria-describedby')).toBeUndefined()
    })

    it('renders the alert message linked via aria-describedby when validations is set', () => {
      const wrapper = mountComponent({ validations: 'Required field' })
      const slider = wrapper.get('[role="slider"]')
      const alert = wrapper.get('[role="alert"]')

      expect(alert.text()).toBe('Required field')
      const sliderId = slider.attributes('id')
      expect(alert.attributes('id')).toBe(`${sliderId}-error`)
      expect(slider.attributes('aria-describedby')).toBe(`${sliderId}-error`)
    })
  })

  describe('disabled state', () => {
    it('applies the disabled modifier class, tabindex -1 and aria-disabled', () => {
      const wrapper = mountComponent({ disabled: true })
      const root = wrapper.get('.fw-range')
      const slider = wrapper.get('[role="slider"]')

      expect(root.classes()).toContain('fw-range--disabled')
      expect(slider.attributes('tabindex')).toBe('-1')
      expect(slider.attributes('aria-disabled')).toBe('true')
    })

    it('ignores keydown interactions while disabled', async () => {
      const wrapper = mountComponent({ disabled: true, modelValue: 50 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('ignores pointerdown interactions while disabled', () => {
      mockTrackRect(200)
      const wrapper = mountComponent({ disabled: true, modelValue: 50 })
      const trackWrapper = wrapper.get('.fw-range__wrapper')

      trackWrapper.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, bubbles: true }))

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('trackColor / indicatorColor', () => {
    it('leaves inline colors undefined when not provided', () => {
      const wrapper = mountComponent()
      const track = wrapper.get('.fw-range__track')
      const fill = wrapper.get('.fw-range__fill')
      const thumb = wrapper.get('.fw-range__thumb')

      expect(track.attributes('style') ?? '').not.toContain('background-color')
      expect(fill.attributes('style') ?? '').not.toContain('background-color')
      expect(thumb.attributes('style') ?? '').not.toContain('color')
    })

    it('applies trackColor via fw.getVar to the track and fill background', () => {
      const wrapper = mountComponent({ trackColor: 'color-primary' })
      const track = wrapper.get('.fw-range__track')
      const fill = wrapper.get('.fw-range__fill')

      expect(track.attributes('style')).toContain('var(--fw-color-primary)')
      expect(fill.attributes('style')).toContain('var(--fw-color-primary)')
    })

    it('applies indicatorColor via fw.getVar to the thumb color', () => {
      const wrapper = mountComponent({ indicatorColor: 'color-secondary' })
      const thumb = wrapper.get('.fw-range__thumb')

      expect(thumb.attributes('style')).toContain('var(--fw-color-secondary)')
    })
  })

  describe('keyboard interaction', () => {
    it('increments the value by step on ArrowRight', async () => {
      const wrapper = mountComponent({ modelValue: 50, step: 10, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([60])
    })

    it('increments the value by step on ArrowUp', async () => {
      const wrapper = mountComponent({ modelValue: 50, step: 10, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowUp' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([60])
    })

    it('decrements the value by step on ArrowLeft', async () => {
      const wrapper = mountComponent({ modelValue: 50, step: 10, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowLeft' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([40])
    })

    it('decrements the value by step on ArrowDown', async () => {
      const wrapper = mountComponent({ modelValue: 50, step: 10, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([40])
    })

    it('jumps to min on Home', async () => {
      const wrapper = mountComponent({ modelValue: 50, min: 10, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'Home' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
    })

    it('jumps to max on End', async () => {
      const wrapper = mountComponent({ modelValue: 50, min: 0, max: 90 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'End' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([90])
    })

    it('does nothing on keys outside the handled set', async () => {
      const wrapper = mountComponent({ modelValue: 50, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('keydown', { key: 'a' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('calls preventDefault on handled keys', () => {
      const wrapper = mountComponent({ modelValue: 50, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
      const spy = vi.spyOn(event, 'preventDefault')

      slider.element.dispatchEvent(event)

      expect(spy).toHaveBeenCalled()
    })

    it('does not call preventDefault on unhandled keys', () => {
      const wrapper = mountComponent({ modelValue: 50, min: 0, max: 100 })
      const slider = wrapper.get('[role="slider"]')
      const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true })
      const spy = vi.spyOn(event, 'preventDefault')

      slider.element.dispatchEvent(event)

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('focus / blur', () => {
    it('emits onFocus and toggles the is-focused class', async () => {
      const wrapper = mountComponent()
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('focus')

      expect(wrapper.emitted('onFocus')).toHaveLength(1)
      expect(wrapper.emitted('onFocus')?.[0][0]).toBeInstanceOf(FocusEvent)
      expect(slider.classes()).toContain('is-focused')
    })

    it('emits onBlur and removes the is-focused class', async () => {
      const wrapper = mountComponent()
      const slider = wrapper.get('[role="slider"]')

      await slider.trigger('focus')
      await slider.trigger('blur')

      expect(wrapper.emitted('onBlur')).toHaveLength(1)
      expect(wrapper.emitted('onBlur')?.[0][0]).toBeInstanceOf(FocusEvent)
      expect(slider.classes()).not.toContain('is-focused')
    })
  })

  describe('pointer interaction', () => {
    it('computes the value from pointerdown position on the track', () => {
      mockTrackRect(200)
      const wrapper = mountComponent({ modelValue: 0, min: 0, max: 100, step: 1 })
      const trackWrapper = wrapper.get('.fw-range__wrapper')

      trackWrapper.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, bubbles: true }))

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([50])
    })

    it('resolves ratio to 0 when the track has no width', () => {
      // No se mockea getBoundingClientRect: jsdom devuelve un rect con width 0,
      // ejercitando la rama `rect.width <= 0 ? 0 : ...`.
      const wrapper = mountComponent({ modelValue: 50, min: 0, max: 100, step: 1 })
      const trackWrapper = wrapper.get('.fw-range__wrapper')

      trackWrapper.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, bubbles: true }))

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
    })

    it('updates the value on pointermove while dragging, and stops on pointerup', () => {
      mockTrackRect(200)
      const wrapper = mountComponent({ modelValue: 0, min: 0, max: 100, step: 1 })
      const trackWrapper = wrapper.get('.fw-range__wrapper')

      trackWrapper.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, bubbles: true }))
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 200 }))

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([100])

      window.dispatchEvent(new PointerEvent('pointerup'))

      const emittedBeforeExtraMove = wrapper.emitted('update:modelValue')?.length
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0 }))

      expect(wrapper.emitted('update:modelValue')?.length).toBe(emittedBeforeExtraMove)
    })

    it('ignores pointermove while not dragging', () => {
      mockTrackRect(200)
      const wrapper = mountComponent({ modelValue: 50, min: 0, max: 100, step: 1 })

      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 200 }))

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('removes the window pointermove/pointerup listeners on unmount', () => {
      mockTrackRect(200)
      const addSpy = vi.spyOn(window, 'addEventListener')
      const removeSpy = vi.spyOn(window, 'removeEventListener')
      const wrapper = mountComponent({ modelValue: 0, min: 0, max: 100, step: 1 })
      const trackWrapper = wrapper.get('.fw-range__wrapper')

      trackWrapper.element.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, bubbles: true }))

      expect(addSpy).toHaveBeenCalledWith('pointermove', expect.any(Function))
      expect(addSpy).toHaveBeenCalledWith('pointerup', expect.any(Function))

      wrapper.unmount()

      expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function))
      expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function))
    })
  })

  describe('percentage edge case', () => {
    it('falls back to 0% width when max <= min', () => {
      const wrapper = mountComponent({ modelValue: 50, min: 50, max: 50 })
      const fill = wrapper.get('.fw-range__fill')

      expect(fill.attributes('style')).toContain('width: 0%')
    })
  })
})
