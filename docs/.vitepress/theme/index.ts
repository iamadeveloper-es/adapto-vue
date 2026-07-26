import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { AdaptoPlugin } from '../../../src/lib/plugin'
import AdaptoButton from '../../../src/lib/components/element/adpt-button/index.vue'
import AdaptoIcon from '../../../src/lib/components/element/adpt-icon/index.vue'
import AdaptoCard from '../../../src/lib/components/element/adpt-card/index.vue'
import AdaptoInputField from '../../../src/lib/components/form/adpt-input-field/index.vue'
import AdaptoTextarea from '../../../src/lib/components/form/adpt-textarea/index.vue'
import './demo.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AdaptoPlugin)
    app.component('AdaptoButton', AdaptoButton)
    app.component('AdaptoIcon', AdaptoIcon)
    app.component('AdaptoCard', AdaptoCard)
    app.component('AdaptoInputField', AdaptoInputField)
    app.component('AdaptoTextarea', AdaptoTextarea)
  },
} satisfies Theme
