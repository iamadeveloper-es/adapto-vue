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
    tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

/**
 * Inyecta los tokens mergeando los valores por defecto con los overrides del consumidor.
 * Genera un único bloque :root con todas las variables resueltas.
 */
export function injectTokens(
  rawCSS: string,
  prefix: string,
  overrides: Record<string, string> = {},
): void {
  if (typeof document === 'undefined') return;

  // El CSS raw aún tiene __FW__, lo reemplazamos antes de parsear
  const resolvedCSS = rawCSS.replaceAll('__FW__', prefix);
  const defaults = parseTokens(resolvedCSS, prefix);
  
  const merged = { ...defaults, ...overrides };

  const vars = Object.entries(merged)
    .map(([key, value]) => `  --${prefix}-${key}: ${value};`)
    .join('\n');

  const style = document.createElement('style');
  style.setAttribute('data-fw', 'tokens');
  style.textContent = `:root {\n${vars}\n}`;
  document.head.appendChild(style);

  injected.add('tokens');
}
