import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AdaptoProgressCircular from '@/lib/components/element/adpt-progress-circular/index.vue'

const fwMock = {
  prefix: 'fw',
  cx: (...names: string[]) => names.filter(Boolean).map((n) => `fw-${n}`).join(' '),
  cv: (name: string) => `var(--fw-${name})`,
  getVar: () => '',
}

function mountComponent(props: Record<string, unknown> = {}) {
  return mount(AdaptoProgressCircular, {
    props,
    global: {
      provide: {
        fw: fwMock,
      },
    },
  })
}

describe('adpt-progress-circular', () => {
  it('renders correctly with default props', () => {
    const wrapper = mountComponent()
    const root = wrapper.get('[role="progressbar"]')

    expect(root.classes()).toContain('fw-progress-circular')
    expect(root.classes()).toContain('fw-progress-circular--md')
    expect(root.classes()).not.toContain('fw-progress-circular--indeterminate')
    expect(root.attributes('aria-valuemin')).toBe('0')
    expect(root.attributes('aria-valuemax')).toBe('100')
    expect(root.attributes('aria-valuenow')).toBe('0')
    expect(root.attributes('aria-label')).toBe('Progreso de la operación')

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('.fw-progress-circular__track').exists()).toBe(true)
    expect(wrapper.find('.fw-progress-circular__value').exists()).toBe(true)
    expect(wrapper.find('.fw-progress-circular__label').exists()).toBe(false)
  })

  it.each([
    ['xs'],
    ['sm'],
    ['md'],
    ['lg'],
    ['xl'],
  ])('reflects the %s size variant in the root class', (size) => {
    const wrapper = mountComponent({ size })
    const root = wrapper.get('[role="progressbar"]')

    expect(root.classes()).toContain(`fw-progress-circular--${size}`)
  })

  it('clamps negative modelValue values down to 0', () => {
    const wrapper = mountComponent({ modelValue: -20, showLabel: true })
    const root = wrapper.get('[role="progressbar"]')

    expect(root.attributes('aria-valuenow')).toBe('0')
    expect(wrapper.get('.fw-progress-circular__label').text()).toBe('0%')
  })

  it('clamps modelValue values above 100 down to 100', () => {
    const wrapper = mountComponent({ modelValue: 150, showLabel: true })
    const root = wrapper.get('[role="progressbar"]')

    expect(root.attributes('aria-valuenow')).toBe('100')
    expect(wrapper.get('.fw-progress-circular__label').text()).toBe('100%')
  })

  it('clamps a NaN modelValue down to 0', () => {
    const wrapper = mountComponent({ modelValue: Number.NaN, showLabel: true })
    const root = wrapper.get('[role="progressbar"]')

    expect(root.attributes('aria-valuenow')).toBe('0')
    expect(wrapper.get('.fw-progress-circular__label').text()).toBe('0%')
  })

  it('reflects a valid in-range modelValue', () => {
    const wrapper = mountComponent({ modelValue: 42, showLabel: true })
    const root = wrapper.get('[role="progressbar"]')

    expect(root.attributes('aria-valuenow')).toBe('42')
    expect(wrapper.get('.fw-progress-circular__label').text()).toBe('42%')
  })

  it('omits aria-valuenow and the indeterminate modifier class when indeterminate', () => {
    const wrapper = mountComponent({ indeterminate: true, modelValue: 50, showLabel: true })
    const root = wrapper.get('[role="progressbar"]')

    expect(root.attributes('aria-valuenow')).toBeUndefined()
    expect(root.classes()).toContain('fw-progress-circular--indeterminate')
  })

  it('never shows the label while indeterminate, even when showLabel is true', () => {
    const wrapper = mountComponent({ indeterminate: true, showLabel: true, modelValue: 50 })

    expect(wrapper.find('.fw-progress-circular__label').exists()).toBe(false)
  })

  it('shows the label with the clamped value only when showLabel is true', () => {
    const withoutLabel = mountComponent({ modelValue: 75 })
    expect(withoutLabel.find('.fw-progress-circular__label').exists()).toBe(false)

    const withLabel = mountComponent({ modelValue: 75, showLabel: true })
    expect(withLabel.get('.fw-progress-circular__label').text()).toBe('75%')
  })

  it('uses a custom aria-label when provided', () => {
    const wrapper = mountComponent({ ariaLabel: 'Subiendo archivo' })
    const root = wrapper.get('[role="progressbar"]')

    expect(root.attributes('aria-label')).toBe('Subiendo archivo')
  })

  it('applies the color prop as the stroke of the value circle via fw.cv', () => {
    const wrapper = mountComponent({ color: 'color-success' })
    const valueCircle = wrapper.get('.fw-progress-circular__value')

    expect(valueCircle.attributes('style')).toContain('var(--fw-color-success)')
  })

  it('leaves the value circle without an inline stroke style when color is not set', () => {
    const wrapper = mountComponent()
    const valueCircle = wrapper.get('.fw-progress-circular__value')

    expect(valueCircle.attributes('style')).toBeUndefined()
  })

  it('uses a different stroke-dashoffset for indeterminate vs. determinate states', () => {
    const determinate = mountComponent({ modelValue: 50 })
    const indeterminate = mountComponent({ indeterminate: true, modelValue: 50 })

    const determinateOffset = determinate.get('.fw-progress-circular__value').attributes('stroke-dashoffset')
    const indeterminateOffset = indeterminate.get('.fw-progress-circular__value').attributes('stroke-dashoffset')

    expect(determinateOffset).toBeDefined()
    expect(indeterminateOffset).toBeDefined()
    expect(determinateOffset).not.toBe(indeterminateOffset)
  })

  it('marks the svg as aria-hidden so assistive tech relies on the role="progressbar" wrapper', () => {
    const wrapper = mountComponent()

    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })
})
