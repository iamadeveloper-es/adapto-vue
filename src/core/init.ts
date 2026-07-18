import { injectCSS, injectTokens } from './inject-css.ts';
import { createUtils } from './create-utils.ts';

import tokensCSS from '../styles/sass/tokens.scss?raw';
// import buttonCSS from '../styles/button.scss?raw';
import main from '../styles/sass/main.scss?raw';

export interface FrameworkOptions {
  prefix?: string;
  tokens?: Record<string, string>;
}

export function initFramework({ prefix = 'app', tokens = {} }: FrameworkOptions = {}) {
  // Tokens: merge de defaults + overrides del consumidor → 1 solo <style>
  injectTokens(tokensCSS, prefix, tokens);

  // Resto de módulos CSS
  // injectCSS(buttonCSS, prefix, 'button');
  console.log(tokens)
  injectCSS(main, prefix, 'main');

  return createUtils(prefix);
}
