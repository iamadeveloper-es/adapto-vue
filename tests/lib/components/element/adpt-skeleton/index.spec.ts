import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AdptSkeleton from '@/lib/components/element/adpt-skeleton/index.vue'

const fwMock = {
  cx: (name: string) => `fw-${name}`,
  cv: (name: string) => `var(--fw-${name})`,
}

describe('adpt-skeleton', () => {
  it('renders the default placeholder with the pulse animation and no custom size', () => {
    const wrapper = mount(AdptSkeleton, {
      global: { provide: { fw: fwMock } },
    })

    const bone = wrapper.get('[aria-hidden="true"]')

    expect(bone.classes()).toContain('fw-skeleton')
    expect(bone.classes()).toContain('fw-skeleton--pulse')
    expect(bone.attributes('style')).toBeUndefined()
  })

  it('applies width and height as inline styles', () => {
    const wrapper = mount(AdptSkeleton, {
      props: { width: 200, height: '2rem' },
      global: { provide: { fw: fwMock } },
    })

    const bone = wrapper.get('[aria-hidden="true"]')

    expect(bone.attributes('style')).toContain('width: 200px')
    expect(bone.attributes('style')).toContain('height: 2rem')
  })

  it('applies a predefined rounded level as a global utility class', () => {
    const wrapper = mount(AdptSkeleton, {
      props: { rounded: 'full' },
      global: { provide: { fw: fwMock } },
    })

    expect(wrapper.get('[aria-hidden="true"]').classes()).toContain('rounded--full')
  })

  it('lets a custom borderRadius take priority over the predefined rounded class', () => {
    const wrapper = mount(AdptSkeleton, {
      props: { rounded: 'full', borderRadius: '4px 0' },
      global: { provide: { fw: fwMock } },
    })

    const bone = wrapper.get('[aria-hidden="true"]')

    expect(bone.classes()).toContain('rounded--full')
    expect(bone.attributes('style')).toContain('border-radius: 4px 0')
  })

  it('resolves a custom color through the framework token helper', () => {
    const wrapper = mount(AdptSkeleton, {
      props: { color: 'color-primary-500' },
      global: { provide: { fw: fwMock } },
    })

    expect(wrapper.get('[aria-hidden="true"]').attributes('style')).toContain(
      'background-color: var(--fw-color-primary-500)',
    )
  })

  it.each(['pulse', 'wave'] as const)('applies the "%s" animation modifier class', (animation) => {
    const wrapper = mount(AdptSkeleton, {
      props: { animation },
      global: { provide: { fw: fwMock } },
    })

    expect(wrapper.get('[aria-hidden="true"]').classes()).toContain(`fw-skeleton--${animation}`)
  })

  it('renders without an animation modifier class when animation is "none"', () => {
    const wrapper = mount(AdptSkeleton, {
      props: { animation: 'none' },
      global: { provide: { fw: fwMock } },
    })

    const classes = wrapper.get('[aria-hidden="true"]').classes()

    expect(classes).not.toContain('fw-skeleton--pulse')
    expect(classes).not.toContain('fw-skeleton--wave')
  })

  it('announces the default accessible label without exposing the placeholder structure', () => {
    const wrapper = mount(AdptSkeleton, {
      global: { provide: { fw: fwMock } },
    })

    const status = wrapper.get('[role="status"]')

    expect(status.attributes('aria-live')).toBe('polite')
    expect(status.classes()).toContain('accesible-hidden')
    expect(status.text()).toBe('Cargando contenido')
    expect(wrapper.get('[aria-hidden="true"]').find('[role="status"]').exists()).toBe(false)
  })

  it('allows overriding the accessible label', () => {
    const wrapper = mount(AdptSkeleton, {
      props: { ariaLabel: 'Cargando perfil del usuario' },
      global: { provide: { fw: fwMock } },
    })

    expect(wrapper.get('[role="status"]').text()).toBe('Cargando perfil del usuario')
  })
})
