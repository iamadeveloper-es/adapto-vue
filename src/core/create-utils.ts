export function createUtils(prefix: string) {

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
  };
}