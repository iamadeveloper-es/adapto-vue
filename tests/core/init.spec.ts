import { beforeEach, describe, expect, it } from 'vitest'
import {
  initFramework,
  normalizeComponentTokens,
  normalizePrimitiveTokens,
  normalizeSemanticTokens,
  normalizeTokens,
} from '@/core/init'
import { injectCSS, injectTokens } from '@/core/inject-css'

function createStyleModule(id: string, css = `:root { --adapto-test: value; }`) {
  return { id, css }
}

describe('normalización de tokens del core', () => {
  it('aplana los grupos de tokens primitivos en entradas tipo kebab-case', () => {
    const input = {
      white: {
        '500': '#ffffff',
      },
      black: {
        '500': '#000000',
      },
      green: {
        '100': '#d9feeab1',
        '500': '#8fefbaff',
      },
    }

    expect(normalizePrimitiveTokens(input)).toEqual({
      'white-500': '#ffffff',
      'black-500': '#000000',
      'green-100': '#d9feeab1',
      'green-500': '#8fefbaff',
    })
  })

  it('convierte los tokens semánticos en referencias a propiedades CSS', () => {
    const tokens = {
      primary: 'pr.green.100',
      accent: 'pr.white.500',
    }

    expect(normalizeSemanticTokens(tokens, 'adapto')).toEqual({
      primary: 'var(--adapto-green-100)',
      accent: 'var(--adapto-white-500)',
    })
  })

  it('resuelve las referencias de los tokens de componentes a variables CSS o valores estáticos', () => {
    const tokens = {
      btn: {
        bg: 'pr.green.100',
        padding: ['pr.size.md', 'cs.8px'],
        color: 'sm.on-primary.500',
      },
    }

    expect(normalizeComponentTokens(tokens, 'adapto')).toEqual({
      'btn-bg': 'var(--adapto-green-100)',
      'btn-padding': 'var(--adapto-size-md) 8px',
      'btn-color': 'var(--adapto-on-primary-500)',
    })
  })

  it('fusiona los tokens base con los overrides del consumidor mediante normalizeTokens', () => {
    const result = normalizeTokens(
      {
        primitive: {
          green: {
            100: '#123456',
          },
        },
        semantic: {
          primary: 'pr.green.100',
        },
        component: {},
      },
      'adapto',
    )

    expect(result['green-100']).toBe('#123456')
    expect(result.primary).toBe('var(--adapto-green-100)')
  })
})

describe('injectCSS e injectTokens', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('inyecta un bloque CSS una sola vez por id de módulo', () => {
    const css = '.test { color: red; }'

    injectCSS(css, 'adapto', 'main-dup-test')
    injectCSS(css, 'adapto', 'main-dup-test')

    const styles = document.querySelectorAll('style[data-fw="main-dup-test"]')
    expect(styles).toHaveLength(1)
  })

  it('inyecta un bloque de tokens con overrides mezclados', () => {
    injectTokens(':root { --adapto-base: #111111; }', 'adapto', {
      'color-primary': '#222222',
    })

    const style = document.querySelector('style[data-fw="tokens"]')
    expect(style?.textContent).toContain('--adapto-color-primary: #222222;')
    expect(style?.textContent).toContain('--adapto-base: #111111;')
  })

  it('añade un bloque de overrides de dark mode bajo el selector configurado', () => {
    injectTokens(
      ':root { --adapto-base: #111111; }',
      'adapto',
      { 'color-primary': '#222222' },
      { 'color-primary': '#333333' },
      'dark-mode',
    )

    const style = document.querySelector('style[data-fw="tokens"]')
    expect(style?.textContent).toContain('.dark-mode {')
    expect(style?.textContent).toContain('--adapto-color-primary: #333333;')
  })

  it('no añade el bloque de dark mode cuando no hay overrides', () => {
    injectTokens(':root { --adapto-base: #111111; }', 'adapto', {}, {}, 'dark-mode')

    const style = document.querySelector('style[data-fw="tokens"]')
    expect(style?.textContent).not.toContain('.dark-mode')
  })
})

describe('initFramework', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.documentElement.classList.remove('dark-mode')
    localStorage.clear()
  })

  it('inicializa el framework e inyecta los módulos de estilo recibidos desde el caller', () => {
    const styles = [
      createStyleModule('tokens', ':root { --adapto-base: #000000; }'),
      createStyleModule('main', '.demo { display: block; }'),
    ]

    const utils = initFramework({ styles })

    expect(utils.prefix).toBe('adapto')
    expect(document.querySelector('style[data-fw="tokens"]')).not.toBeNull()
    expect(document.querySelector('style[data-fw="main"]')).not.toBeNull()
  })

  it('usa un prefijo personalizado cuando se proporciona', () => {
    const utils = initFramework({
      prefix: 'custom',
      styles: [createStyleModule('tokens', ':root { --custom-base: #123456; }')],
    })

    expect(utils.prefix).toBe('custom')
    expect(document.querySelector('style[data-fw="tokens"]')?.textContent).toContain(
      '--custom-base: #123456;',
    )
  })

  it('inyecta el bloque de overrides de dark mode del tema base bajo el selector configurado', () => {
    initFramework({
      styles: [createStyleModule('tokens', ':root { --adapto-base: #000000; }')],
    })

    const style = document.querySelector('style[data-fw="tokens"]')
    expect(style?.textContent).toContain('.dark-mode {')
  })

  it('expone setMode/toggleMode/getInitialMode en los utils devueltos', () => {
    const utils = initFramework({
      styles: [createStyleModule('tokens', ':root { --adapto-base: #000000; }')],
    })

    expect(typeof utils.setMode).toBe('function')
    expect(typeof utils.toggleMode).toBe('function')
    expect(typeof utils.getInitialMode).toBe('function')
  })

  it('aplica el modo guardado por el consumidor como modo inicial', () => {
    localStorage.setItem('adapto-theme-mode-adapto', 'dark')

    initFramework({
      styles: [createStyleModule('tokens', ':root { --adapto-base: #000000; }')],
    })

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
  })
})
