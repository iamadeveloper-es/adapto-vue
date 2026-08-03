import type { ThemeMode } from './types'
import { Atlas } from './themes/Atlas'

const STORAGE_KEY_PREFIX = 'adapto-theme-mode'

/**
 * Añade o quita la clase de dark mode en <html> según el modo indicado.
 * `darkModeSelector` solo hace falta indicarlo si se instaló la librería con
 * un `darkModeSelector` distinto al del tema por defecto.
 */
export function applyThemeMode(
  mode: ThemeMode,
  darkModeSelector: string = Atlas.darkModeSelector || 'dark-mode',
): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle(darkModeSelector, mode === 'dark')
}

/**
 * Lee la preferencia de color del sistema operativo.
 */
export function getSystemThemeMode(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Recupera el modo guardado por el consumidor en una carga anterior, si existe.
 * `prefix` solo hace falta indicarlo si se instaló la librería con un `prefix`
 * distinto al del tema por defecto.
 */
export function getStoredThemeMode(prefix: string = Atlas.prefix): ThemeMode | null {
  if (typeof localStorage === 'undefined') return null
  const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${prefix}`)
  return stored === 'light' || stored === 'dark' ? stored : null
}

/**
 * Persiste el modo elegido para que se respete en futuras cargas.
 * `prefix` solo hace falta indicarlo si se instaló la librería con un `prefix`
 * distinto al del tema por defecto.
 */
export function storeThemeMode(mode: ThemeMode, prefix: string = Atlas.prefix): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(`${STORAGE_KEY_PREFIX}-${prefix}`, mode)
}
