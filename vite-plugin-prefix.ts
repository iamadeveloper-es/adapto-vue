import { readFileSync } from 'fs';
import type { Plugin } from 'vite';

export function prefixPlugin({ namespace = '__FW__' } = {}): Plugin {
  return {
    name: 'vite-plugin-prefix',
    enforce: 'pre',

    load(id: string) {
      if (!id.includes('?raw')) return;

      const cleanId = id.split('?')[0];
      if (!/\.(css|scss|sass)$/.test(cleanId)) return;

      const raw = readFileSync(cleanId, 'utf-8');

      const result = raw
        .replace(/\.(fw-)([\w-]+)/g, `.${namespace}-$2`)
        .replace(/--(fw-)([\w-]+)/g, `--${namespace}-$2`);

      return `export default ${JSON.stringify(result)}`;
    },
  };
}