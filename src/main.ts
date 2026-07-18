import { createApp } from 'vue'
import App from './App.vue'
import { AdaptoPlugin } from './lib/index'

const AdaptoOptions = {
  prefix: 'cacao',
  tokens: {
    'primary-color': '#9f5eaf',
    'secondary-color': '#00ff00',
  },
}

createApp(App)
  .use(AdaptoPlugin, AdaptoOptions)
  .mount('#app')
