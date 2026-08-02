import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults, coverageConfigDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        enabled: true,
        // Por defecto vitest omite el reporte de coverage si algún test falla;
        // lo forzamos para que el umbral se evalúe siempre, no solo en runs en verde.
        reportOnFailure: true,
        include: ['src/lib/**/*.{ts,vue}', 'src/core/**/*.ts'],
        exclude: [...coverageConfigDefaults.exclude, '**/*.d.ts'],
        // El umbral negativo en 'lines' es el máximo de líneas sin cubrir permitido
        // en todo el proyecto (no un porcentaje); functions/branches/statements exigen 100%.
        thresholds: {
          lines: -10,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  }),
)
