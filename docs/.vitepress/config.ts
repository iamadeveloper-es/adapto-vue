import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { prefixPlugin } from '../../vite-plugin-prefix-scss'

export default defineConfig({
  lang: 'es-ES',
  title: 'Adapto UI',
  description: 'Documentación de la librería de componentes Adapto UI',

  themeConfig: {
    nav: [
      { text: 'Guía', link: '/guide/theming' },
      { text: 'Componentes', link: '/components/adpt-button' },
    ],

    // Los nombres de categoría (Element, Form, Navigation, Overlay) se dejan en
    // inglés a propósito: nombran las carpetas reales de src/lib/components/.
    sidebar: [
      {
        text: 'Guía',
        items: [{ text: 'Estilos y theming', link: '/guide/theming' }],
      },
      {
        text: 'Componentes',
        items: [
          { text: 'Element',
            items: [
              { text: 'Button', link: '/components/adpt-button' },
              { text: 'Chip', link: '/components/adpt-chip' },
              { text: 'Avatar', link: '/components/adpt-avatar' },
              { text: 'Icon', link: '/components/adpt-icon' },
              { text: 'Image', link: '/components/adpt-image' },
              { text: 'Card', link: '/components/adpt-card' },
              { text: 'Accordion', link: '/components/adpt-accordion' },
              { text: 'Accordion List', link: '/components/adpt-accordion-list' },
              { text: 'Skeleton', link: '/components/adpt-skeleton' },
            ]
          },
          { text: 'Form',
            items: [
              { text: 'Input Field', link: '/components/adpt-input-field' },
              { text: 'Textarea', link: '/components/adpt-textarea' },
              { text: 'Checkbox', link: '/components/adpt-checkbox' },
              { text: 'Radio', link: '/components/adpt-radio' },
              { text: 'Select', link: '/components/adpt-select' },
              { text: 'Range', link: '/components/adpt-range' },
            ]
          },
          { text: 'Navigation',
            items: [
              { text: 'Tabs', link: '/components/adpt-tabs' },
              { text: 'Pagination', link: '/components/adpt-pagination' },
            ]
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

    outline: { label: 'En esta página' },
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    darkModeSwitchLabel: 'Apariencia',
    lightModeSwitchTitle: 'Cambiar a modo claro',
    darkModeSwitchTitle: 'Cambiar a modo oscuro',
    sidebarMenuLabel: 'Menú',
    returnToTopLabel: 'Volver arriba',
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
