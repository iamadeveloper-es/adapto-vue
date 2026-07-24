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
        items: [{ text: 'Button', link: '/components/adpt-button' }],
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
