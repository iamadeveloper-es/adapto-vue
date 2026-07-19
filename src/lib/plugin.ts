import type { App } from 'vue'
import { initFramework } from '../core/init'
import type { FrameworkOptions } from '../core/types'

import tokensCSS from '../styles/sass/tokens.scss?raw'
import main from '../styles/sass/main.scss?raw'

export const AdaptoPlugin = {
  install(app: App, options: FrameworkOptions = {}) {
    const fw = initFramework({
      ...options,
      styles: [
        { id: 'tokens', css: tokensCSS },
        { id: 'main', css: main },
        ...(options.styles ?? []),
      ],
    })

    app.provide('fw', fw)
  },
}
