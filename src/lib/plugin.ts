import type { App } from 'vue'
import { initFramework } from '../core/init'
import type { FrameworkOptions } from '../core/types'
import rippleDirective from './directives/ripple-effect';
import { vClickOutside } from './directives/v-click-outside';

// Estilos globales
import tokensCSS from './styles/sass/tokens.scss?raw'
import main from './styles/sass/main.scss?raw'

//Estilos de Componentes
import button from './components/adpt-button/style.scss?raw'
import dialog from './components/adpt-dialog/style.scss?raw'
import tooltip from './components/adpt-tooltip/style.scss?raw'

export const AdaptoPlugin = {
  install(app: App, options: FrameworkOptions = {}) {
    const fw = initFramework({
      ...options,
      styles: [
        { id: 'tokens', css: tokensCSS },
        { id: 'main', css: main },
        { id: 'button', css: button },
        { id: 'dialog', css: dialog },
        { id: 'tooltip', css: tooltip },
        ...(options.styles ?? []),
      ],
    })

    app.provide('fw', fw)

    app.directive('ripple', rippleDirective);
    app.directive('click-outside', vClickOutside);
  }

}
