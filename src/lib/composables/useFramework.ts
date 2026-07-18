import { inject } from 'vue';
// import type { FrameworkUtils } from '../types/index.ts';

export function useFramework(): any {
  const fw = inject<any>('fw');
  if (!fw) throw new Error('useFramework() requiere FrameworkPlugin instalado');
  return fw;
}
