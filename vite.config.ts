import { fileURLToPath, URL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// import { prefixPlugin } from './vite-plugin-prefix'
import { prefixPlugin } from './vite-plugin-prefix-scss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    prefixPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, './src/lib/index.ts'),
      name: 'Adapto-ui',
      // the proper extensions will be added
      fileName: 'adapto-ui',
    },
    rollupOptions: {
      // Los peers no se empaquetan: inlinar Vue duplicaría la instancia y
      // rompería provide/inject (useFramework) en la app del consumidor.
      // Los subpaths (dayjs/plugin/*, dayjs/locale/*) también: son UMD y, si
      // se empaquetan, emiten un `require()` que revienta en el navegador.
      external: (id: string) =>
        id === 'vue' || id === 'lucide-vue-next' || id === 'dayjs' || id.startsWith('dayjs/'),
      output: {
        globals: {
          vue: 'Vue',
          'lucide-vue-next': 'LucideVueNext',
          dayjs: 'dayjs',
          'dayjs/plugin/weekday': 'dayjs_plugin_weekday',
          'dayjs/plugin/localeData': 'dayjs_plugin_localeData',
          'dayjs/locale/es': 'dayjs_locale_es',
        },
      },
    },
  }
})
