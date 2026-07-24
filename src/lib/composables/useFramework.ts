import { inject } from 'vue';
import type { createUtils } from '@/core/create-utils';

export type Framework = ReturnType<typeof createUtils>;

export function useFramework(): Framework {
  const fw = inject<Framework>('fw');
  if (!fw) throw new Error('useFramework() requiere FrameworkPlugin instalado');
  return fw;
}
