import { injectCSS } from '@/core/inject-css'
import { useFramework } from './useFramework'

/**
 * Injects a component's stylesheet the first time that component renders.
 *
 * Keeping the import next to the component (instead of in the plugin) lets the
 * bundler drop both the module and its CSS when the component is never used.
 * Injection is idempotent, so calling it once per instance is cheap.
 */
export function useStyle(moduleId: string, css: string): void {
  const fw = useFramework()
  injectCSS(css, fw.prefix, moduleId)
}
