import { createApp } from 'vue'
import App from './App.vue'
import { AdaptoPlugin } from './lib/index'

const AdaptoOptions = {
  prefix: 'cacao',
  tokens: {
    primitive: {
      green: {
        100: '#50cb2ab1',
        500: 'rgb(119, 234, 171)'
      },
      blue: {
        500: 'rgb(23, 70, 146)',
        700: 'rgb(61, 85, 164)'
      },
    }
  },
}

createApp(App)
  .use(AdaptoPlugin, AdaptoOptions)
  .mount('#app')
