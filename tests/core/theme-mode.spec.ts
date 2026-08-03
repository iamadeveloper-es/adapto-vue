import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyThemeMode,
  getStoredThemeMode,
  getSystemThemeMode,
  storeThemeMode,
} from '@/core/theme-mode'

describe('applyThemeMode', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark-mode')
  })

  it('añade la clase de dark mode cuando el modo es dark', () => {
    applyThemeMode('dark', 'dark-mode')

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
  })

  it('quita la clase de dark mode cuando el modo es light', () => {
    document.documentElement.classList.add('dark-mode')

    applyThemeMode('light', 'dark-mode')

    expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
  })
})

describe('getSystemThemeMode', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('devuelve dark cuando el sistema prefiere dark', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('dark') }) as MediaQueryList)

    expect(getSystemThemeMode()).toBe('dark')
  })

  it('devuelve light cuando el sistema no prefiere dark', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }) as MediaQueryList)

    expect(getSystemThemeMode()).toBe('light')
  })
})

describe('getStoredThemeMode y storeThemeMode', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('devuelve null cuando no hay nada guardado', () => {
    expect(getStoredThemeMode('adapto')).toBeNull()
  })

  it('persiste y recupera el modo guardado para el prefijo dado', () => {
    storeThemeMode('dark', 'adapto')

    expect(getStoredThemeMode('adapto')).toBe('dark')
  })

  it('ignora valores corruptos guardados fuera de la librería', () => {
    localStorage.setItem('adapto-theme-mode-adapto', 'not-a-mode')

    expect(getStoredThemeMode('adapto')).toBeNull()
  })
})

describe('valores por defecto basados en el tema Atlas', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark-mode')
    localStorage.clear()
  })

  it('applyThemeMode usa el darkModeSelector de Atlas cuando no se indica uno', () => {
    applyThemeMode('dark')

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
  })

  it('storeThemeMode y getStoredThemeMode usan el prefix de Atlas cuando no se indica uno', () => {
    storeThemeMode('dark')

    expect(getStoredThemeMode()).toBe('dark')
  })
})
