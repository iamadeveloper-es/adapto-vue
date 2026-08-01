import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { AdaptoPlugin } from '../../../src/lib/plugin'
import AdaptoButton from '../../../src/lib/components/element/adpt-button/index.vue'
import AdaptoIcon from '../../../src/lib/components/element/adpt-icon/index.vue'
import AdaptoCard from '../../../src/lib/components/element/adpt-card/index.vue'
import AdaptoAccordion from '../../../src/lib/components/element/adpt-accordion/index.vue'
import AdaptoAccordionList from '../../../src/lib/components/element/adpt-accordion-list/index.vue'
import AdaptoInputField from '../../../src/lib/components/form/adpt-input-field/index.vue'
import AdaptoTextarea from '../../../src/lib/components/form/adpt-textarea/index.vue'
import AdaptoCheckbox from '../../../src/lib/components/form/adpt-checkbox/index.vue'
import AdaptoRadio from '../../../src/lib/components/form/adpt-radio/index.vue'
import AdaptoDialog from '../../../src/lib/components/overlay/adpt-dialog/index.vue'
import AdaptoTooltip from '../../../src/lib/components/overlay/adpt-tooltip/index.vue'
import './demo.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AdaptoPlugin)
    app.component('AdaptoButton', AdaptoButton)
    app.component('AdaptoIcon', AdaptoIcon)
    app.component('AdaptoCard', AdaptoCard)
    app.component('AdaptoAccordion', AdaptoAccordion)
    app.component('AdaptoAccordionList', AdaptoAccordionList)
    app.component('AdaptoInputField', AdaptoInputField)
    app.component('AdaptoTextarea', AdaptoTextarea)
    app.component('AdaptoCheckbox', AdaptoCheckbox)
    app.component('AdaptoRadio', AdaptoRadio)
    app.component('AdaptoDialog', AdaptoDialog)
    app.component('AdaptoTooltip', AdaptoTooltip)
  },
} satisfies Theme
