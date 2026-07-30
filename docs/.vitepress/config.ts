import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { prefixPlugin } from '../../vite-plugin-prefix-scss'

export default defineConfig({
  title: 'Adapto UI',
  description: 'Component library documentation for Adapto UI',

  themeConfig: {
    nav: [{ text: 'Components', link: '/components/adpt-button' }],

    sidebar: [
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/adpt-button' },
          { text: 'Icon', link: '/components/adpt-icon' },
          { text: 'Card', link: '/components/adpt-card' },
          { text: 'Input Field', link: '/components/adpt-input-field' },
          { text: 'Textarea', link: '/components/adpt-textarea' },
          { text: 'Dialog', link: '/components/adpt-dialog' },
        ],
      },
    ],
  },

  vite: {
    plugins: [prefixPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
  },
})
