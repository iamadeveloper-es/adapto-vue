export type Options = {
  prefix?: string
  name?: string
  id?: string
  darkModeSelector?: string
  loadStyles?: boolean
}

export type PrimitiveTokenValue = string | Record<string, string>
export type PrimitiveTokens = Record<string, PrimitiveTokenValue>

export type SemanticTokenValue = string | string[] | Record<string, string>
export type SemanticTokens = Record<string, SemanticTokenValue>

export type ComponentTokenValue = string | string[]
export type ComponentTokens = Record<string, Record<string, ComponentTokenValue>>

export type Tokens = {
  primitive: PrimitiveTokens
  semantic: SemanticTokens
  component: ComponentTokens
}

export type Modes = {
  light: {
    semantic: SemanticTokens
  }
  dark: {
    semantic: SemanticTokens
  }
}

export type ThemeOptions = {
  name: string
  id: string
  prefix: string
  darkModeSelector?: string
  loadStyles: boolean
  tokens: Tokens
  modes: Modes
}

export type StyleModule = {
  id: string
  css: string
}

// `Partial` es superficial: dejaría `tokens` exigiendo primitive+semantic+component
// completos, cuando `normalizeTokens` acepta overrides parciales. Se separa para que
// el consumidor pueda pasar solo el grupo que quiere sobrescribir.
export type FrameworkOptions = Partial<Omit<ThemeOptions, 'tokens'>> & {
  tokens?: Partial<Tokens>
  styles?: StyleModule[]
}
