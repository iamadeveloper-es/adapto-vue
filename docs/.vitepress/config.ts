import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { prefixPlugin } from '../../vite-plugin-prefix-scss'

export default defineConfig({
  title: 'Adapto UI',
  description: 'Component library documentation for Adapto UI',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/theming' },
      { text: 'Components', link: '/components/adpt-button' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Styling & Theming', link: '/guide/theming' }],
      },
      {
        text: 'Components',
        items: [
          { text: 'Element',
            items: [
              { text: 'Button', link: '/components/adpt-button' },
              { text: 'Avatar', link: '/components/adpt-avatar' },
              { text: 'Icon', link: '/components/adpt-icon' },
              { text: 'Card', link: '/components/adpt-card' },
              { text: 'Accordion', link: '/components/adpt-accordion' },
              { text: 'Accordion List', link: '/components/adpt-accordion-list' },
            ]
          },
          { text: 'Form',
            items: [
              { text: 'Input Field', link: '/components/adpt-input-field' },
              { text: 'Textarea', link: '/components/adpt-textarea' },
              { text: 'Checkbox', link: '/components/adpt-checkbox' },
              { text: 'Radio', link: '/components/adpt-radio' },
              { text: 'Select', link: '/components/adpt-select' },
            ]
          },
          { text: 'Navigation',
            items: []
          },
          { text: 'Overlay',
            items: [
              { text: 'Dialog', link: '/components/adpt-dialog' },
              { text: 'Tooltip', link: '/components/adpt-tooltip' }
            ]
          }
        ]
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
