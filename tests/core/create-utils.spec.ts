import { beforeEach, describe, expect, it } from 'vitest'
import { createUtils } from '@/core/create-utils'

describe('createUtils', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark-mode')
    localStorage.clear()
  })

  it('genera clases con prefijo mediante cx', () => {
    const utils = createUtils('adapto', 'dark-mode')

    expect(utils.cx('btn', 'primary')).toBe('adapto-btn adapto-primary')
  })

  it('filtra valores falsy en cx', () => {
    const utils = createUtils('adapto', 'dark-mode')

    expect(utils.cx('btn', false, undefined, null)).toBe('adapto-btn')
  })

  it('genera una referencia var() mediante cv', () => {
    const utils = createUtils('adapto', 'dark-mode')

    expect(utils.cv('color-primary')).toBe('var(--adapto-color-primary)')
  })

  it('lee el valor computado de una custom property mediante getVar', () => {
    document.documentElement.style.setProperty('--adapto-color-primary', '#123456')
    const utils = createUtils('adapto', 'dark-mode')

    expect(utils.getVar('color-primary')).toBe('#123456')
  })

  it('setMode aplica la clase de dark mode y la persiste', () => {
    const utils = createUtils('adapto', 'dark-mode')

    utils.setMode('dark')

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
    expect(localStorage.getItem('adapto-theme-mode-adapto')).toBe('dark')
  })

  it('toggleMode pasa de light a dark', () => {
    const utils = createUtils('adapto', 'dark-mode')

    utils.toggleMode()

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
  })

  it('toggleMode pasa de dark a light', () => {
    const utils = createUtils('adapto', 'dark-mode')
    utils.setMode('dark')

    utils.toggleMode()

    expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
  })

  it('getInitialMode devuelve el modo guardado si existe', () => {
    localStorage.setItem('adapto-theme-mode-adapto', 'dark')
    const utils = createUtils('adapto', 'dark-mode')

    expect(utils.getInitialMode()).toBe('dark')
  })

  it('getInitialMode cae al modo del sistema si no hay nada guardado', () => {
    const utils = createUtils('adapto', 'dark-mode')

    expect(['light', 'dark']).toContain(utils.getInitialMode())
  })
})
