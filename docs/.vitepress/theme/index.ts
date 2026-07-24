import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { AdaptoPlugin } from '../../../src/lib/plugin'
import AdaptoButton from '../../../src/lib/components/element/adpt-button/index.vue'
import AdaptoIcon from '../../../src/lib/components/element/adpt-icon/index.vue'
import './demo.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AdaptoPlugin)
    app.component('AdaptoButton', AdaptoButton)
    app.component('AdaptoIcon', AdaptoIcon)
  },
} satisfies Theme
