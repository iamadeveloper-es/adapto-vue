const injected = new Set<string>();

/**
 * Inyecta un bloque de estilos CSS en el documento y evita duplicarlo.
 */
export function injectCSS(rawCSS: string, prefix: string, moduleId: string): void {
  if (typeof document === 'undefined') return;

  // El prefijo forma parte de la clave: dos apps con prefijos distintos en la
  // misma página necesitan cada una su propio bloque de estilos.
  const key = `${prefix}:${moduleId}`;
  if (injected.has(key)) return;

  const style = document.createElement('style');
  style.setAttribute('data-fw', moduleId);
  style.textContent = rawCSS.replaceAll('__FW__', prefix);
  document.head.appendChild(style);

  injected.add(key);
}

/**
 * Parsea las custom properties de un bloque :root { } en un objeto.
 * "--fw-color-primary: #3b82f6" → { 'color-primary': '#3b82f6' }
 */
function parseTokens(css: string, prefix: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const re = new RegExp(`--${prefix}-([\\w-]+):\\s*([^;]+);`, 'g');
  let match;
  while ((match = re.exec(css)) !== null) {
    const [, key, value] = match;
    if (key === undefined || value === undefined) continue;
    tokens[key] = value.trim();
  }
  return tokens;
}

/**
 * Serializa un mapa de tokens ya resueltos como declaraciones de custom property.
 */
function renderVars(prefix: string, tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([key, value]) => `  --${prefix}-${key}: ${value};`)
    .join('\n');
}

/**
 * Inyecta los tokens mergeando los valores por defecto con los overrides del consumidor.
 * Genera un bloque :root con las variables resueltas y, si se reciben overrides de dark
 * mode, un segundo bloque bajo el selector de dark mode con las variables que cambian.
 */
export function injectTokens(
  rawCSS: string,
  prefix: string,
  overrides: Record<string, string> = {},
  darkOverrides?: Record<string, string>,
  darkModeSelector?: string,
): void {
  if (typeof document === 'undefined') return;

  // El CSS raw aún tiene __FW__, lo reemplazamos antes de parsear
  const resolvedCSS = rawCSS.replaceAll('__FW__', prefix);
  const defaults = parseTokens(resolvedCSS, prefix);

  const merged = { ...defaults, ...overrides };

  let css = `:root {\n${renderVars(prefix, merged)}\n}`;

  if (darkModeSelector && darkOverrides && Object.keys(darkOverrides).length > 0) {
    css += `\n\n.${darkModeSelector} {\n${renderVars(prefix, darkOverrides)}\n}`;
  }

  const style = document.createElement('style');
  style.setAttribute('data-fw', 'tokens');
  style.textContent = css;
  document.head.appendChild(style);

  injected.add('tokens');
}
