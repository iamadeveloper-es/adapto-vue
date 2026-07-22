import type { App } from 'vue'
import { initFramework } from '../core/init'
import type { FrameworkOptions } from '../core/types'

// Estilos globales
import tokensCSS from './styles/sass/tokens.scss?raw'
import main from './styles/sass/main.scss?raw'

//Estilos de Componentes
import button from './components/adpt-button/style.scss?raw'

export const AdaptoPlugin = {
  install(app: App, options: FrameworkOptions = {}) {
    const fw = initFramework({
      ...options,
      styles: [
        { id: 'tokens', css: tokensCSS },
        { id: 'main', css: main },
        { id: 'button', css: button },
        ...(options.styles ?? []),
      ],
    })

    app.provide('fw', fw)
  },
}
