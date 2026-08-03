import {
  applyThemeMode,
  getStoredThemeMode,
  getSystemThemeMode,
  storeThemeMode,
} from './theme-mode'
import type { ThemeMode } from './types'

export function createUtils(prefix: string, darkModeSelector: string) {

  return {
    prefix,

    /** Genera nombre de clase con prefijo: cx('btn') → 'cacao-btn' */
    cx(...names: any[]) {
      return names
        .filter(Boolean)
        .map(n => `${prefix}-${n}`)
        .join(' ');
    },

    /** Referencia a CSS custom property: cv('color-primary') → 'var(--cacao-color-primary)' */
    cv(name: any) {
      return `var(--${prefix}-${name})`;
    },

    /** Lee el valor computado de una custom property del :root */
    getVar(name: any) {
      if (typeof document === 'undefined') return '';
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--${prefix}-${name}`)
        .trim();
    },

    /** Aplica un modo de color concreto y lo persiste para futuras cargas */
    setMode(mode: ThemeMode) {
      applyThemeMode(mode, darkModeSelector);
      storeThemeMode(mode, prefix);
    },

    /** Alterna entre light y dark a partir de la clase actualmente aplicada */
    toggleMode() {
      const isDark =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains(darkModeSelector);
      this.setMode(isDark ? 'light' : 'dark');
    },

    /** Modo con el que arrancar: el guardado por el consumidor o, si no hay, el del sistema */
    getInitialMode(): ThemeMode {
      return getStoredThemeMode(prefix) ?? getSystemThemeMode();
    },
  };
}