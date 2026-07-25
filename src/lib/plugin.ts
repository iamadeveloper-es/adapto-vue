import type { App } from 'vue'
import { initFramework } from '../core/init'
import type { FrameworkOptions } from '../core/types'
import rippleDirective from './directives/ripple-effect';
import { vClickOutside } from './directives/v-click-outside';

/* Estilos globales */
import tokensCSS from './styles/sass/tokens.scss?raw'
import main from './styles/sass/main.scss?raw'

/* Estilos de Componentes */

//- Element
import button from './components/element/adpt-button/style.scss?raw'
import avatar from './components/element/adpt-avatar/style.scss?raw'

//- Overlay
import dialog from './components/overlay/adpt-dialog/style.scss?raw'
import tooltip from './components/overlay/adpt-tooltip/style.scss?raw'

//- Form
import inputField from './components/form/adpt-input-field/style.scss?raw'
import textarea from './components/form/adpt-textarea/style.scss?raw'

export const AdaptoPlugin = {
  install(app: App, options: FrameworkOptions = {}) {
    const fw = initFramework({
      ...options,
      styles: [
        { id: 'tokens', css: tokensCSS },
        { id: 'main', css: main },
        { id: 'button', css: button },
        { id: 'avatar', css: avatar },
        { id: 'dialog', css: dialog },
        { id: 'tooltip', css: tooltip },
        { id: 'input-field', css: inputField },
        { id: 'textarea', css: textarea },
        ...(options.styles ?? []),
      ],
    })

    app.provide('fw', fw)

    app.directive('ripple', rippleDirective);
    app.directive('click-outside', vClickOutside);
  }

}
