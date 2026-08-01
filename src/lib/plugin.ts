import type { App } from 'vue'
import { initFramework } from '../core/init'
import type { FrameworkOptions } from '../core/types'
import rippleDirective from './directives/ripple-effect'
import { vClickOutside } from './directives/v-click-outside'

/* Estilos globales */
import tokensCSS from './styles/sass/tokens.scss?raw'
import main from './styles/sass/main.scss?raw'

/*
 * Los estilos de cada componente ya no se registran aquí: cada componente
 * importa su propio `style.scss` y lo inyecta con `useStyle()` al renderizarse.
 * Así el bundler descarta el CSS de los componentes que no se usan.
 */

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

    app.directive('ripple', rippleDirective)
    app.directive('click-outside', vClickOutside)
  },
}
