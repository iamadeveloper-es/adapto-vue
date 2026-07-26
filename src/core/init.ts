import { injectCSS, injectTokens } from './inject-css.ts'
import { createUtils } from './create-utils.ts'
import type { FrameworkOptions, ThemeOptions, Tokens } from './types'
import { Atlas } from '@/core/themes/Atlas'

/**
 * Inicializa el framework a partir del tema base y de las overrides opcionales.
 * Los módulos CSS se reciben desde fuera para mantener el core desacoplado.
 */
export function initFramework(options: FrameworkOptions = {}) {
  const prefix = options.prefix || Atlas.prefix

  // Normaliza y combina los tokens primitivos, semánticos y de componentes.
  const configTokens = normalizeTokens(options.tokens, prefix)

  const styleModules = options.styles ?? []
  const tokensStyle = styleModules.find((style) => style.id === 'tokens')
  const componentStyles = styleModules.filter((style) => style.id !== 'tokens')

  // Inyecta los tokens resultantes como variables CSS en el documento.
  if (tokensStyle) {
    injectTokens(tokensStyle.css, prefix, configTokens)
  }

  // Carga los estilos globales entregados por la capa que consume el core.
  for (const style of componentStyles) {
    injectCSS(style.css, prefix, style.id)
  }

  return createUtils(prefix)
}

/**
 * Fusiona los tokens del tema base con los overrides del consumidor.
 */
export function normalizeTokens(
  tokens?: Partial<Tokens>,
  prefix = Atlas.prefix,
): Record<string, string> {
  // const primitiveTokens = { ...Atlas.tokens.primitive, ...(tokens?.primitive ?? {}) }
  const primitiveTokens = mergeTokens(Atlas, tokens, 'primitive')
  // const semanticTokens = { ...Atlas.tokens.semantic, ...(tokens?.semantic ?? {}) }
  const semanticTokens = mergeTokens(Atlas, tokens, 'semantic')

  // const componentTokens = { ...Atlas.tokens.component, ...(tokens?.component ?? {}) }
  const componentTokens = mergeTokens(Atlas, tokens, 'component')


  // Convierte los tres grupos de tokens a un formato utilizable por CSS.
  return {
    ...normalizePrimitiveTokens(primitiveTokens),
    ...normalizeSemanticTokens(semanticTokens, prefix),
    ...normalizeComponentTokens(componentTokens, prefix),
  }
}

// Mergea los tokens del Tema con los seleccionados por el usuario cuando inicial el plugin
function mergeTokens(theme: ThemeOptions, tokens: Partial<Tokens | undefined>, tokenType: 'primitive' | 'semantic' | 'component'){
  return Object.fromEntries(
    Object.entries({
      ...theme.tokens[tokenType],
      ...tokens?.[tokenType],
    }).map(([key, value]) => [
      key,
      {
        ...(theme.tokens[tokenType] as any)[key],
        ...(tokens?.[tokenType] as any)?.[key],
      },
    ])
  )
}

/**
 * Transforma los tokens primitivos anidados a un formato plano tipo "group-variant".
 */
export function normalizePrimitiveTokens(tokens: Tokens['primitive']): Record<string, string> {
  return Object.entries(tokens).reduce<Record<string, string>>((results, [group, values]) => {
    if (typeof values === 'string') {
      results[group] = values
      return results
    }

    for (const [variant, value] of Object.entries(values)) {
      results[`${group}-${variant}`] = value
    }

    return results
  }, {})
}

/**
 * Convierte referencias semánticas a variables CSS válidas con el prefijo del tema.
 */
export function normalizeSemanticTokens(
  tokens: Tokens['semantic'],
  prefix: string,
): Record<string, string> {
  return Object.entries(tokens).reduce<Record<string, string>>((results, [key, value]) => {
    const resolveReference = (ref: string) => {
      const cleanRef = ref.replace(/^pr\./, '').replace(/^sm\./, '')
      return cleanRef.replaceAll('.', '-')
    }

    if (typeof value === 'string') {
      const cssKey = resolveReference(value)
      results[key] = `var(--${prefix}-${cssKey})`
    } else if (Array.isArray(value)) {
      results[key] = value.map((item) => `var(--${prefix}-${resolveReference(item)})`).join(' ')
    } else {
      for (const [scale, ref] of Object.entries(value)) {
        const cssKey = resolveReference(ref)
        results[`${key}-${scale}`] = `var(--${prefix}-${cssKey})`
      }
    }
    return results
  }, {})
}

/**
 * Resuelve referencias de componentes a variables CSS o valores estáticos.
 */
export function normalizeComponentTokens(
  tokens: Tokens['component'],
  prefix: string,
): Record<string, string> {
  function resolveValue(value: string): string {
    if (value.startsWith('sm.')) {
      const cssKey = value.slice(3).replaceAll('.', '-')
      return `var(--${prefix}-${cssKey})`
    }
    if (value.startsWith('pr.')) {
      const cssKey = value.slice(3).replaceAll('.', '-')
      return `var(--${prefix}-${cssKey})`
    }
    if (value.startsWith('cs.')) {
      return value.slice(3)
    }
    return value
  }

  return Object.entries(tokens).reduce<Record<string, string>>((results, [component, props]) => {
    for (const [prop, value] of Object.entries(props)) {
      const tokenKey = `${component}-${prop}`
      results[tokenKey] = Array.isArray(value)
        ? value.map(resolveValue).join(' ')
        : resolveValue(value)
    }
    return results
  }, {})
}
