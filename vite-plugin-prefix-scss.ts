import { readFileSync } from 'fs';
import { compileString } from 'sass'; // ← sass compila a CSS antes de transformar
import type { Plugin } from 'vite';

export function prefixPlugin({ namespace = '__FW__' } = {}): Plugin {
  return {
    name: 'vite-plugin-prefix',
    enforce: 'pre',

    load(id: string) {
      if (!id.includes('?raw')) return;

      const cleanId = id.split('?')[0];
      console.log('[prefix-plugin] cleanId:', cleanId);
      const isCSS  = /\.css$/.test(cleanId);
      const isSCSS = /\.scss$/.test(cleanId);

      if (!isCSS && !isSCSS) return;

      const raw = readFileSync(cleanId, 'utf-8');

      // Si es SCSS lo compilamos a CSS primero
      const css = isSCSS
        ? compileString(raw, { loadPaths: [cleanId.replace(/\/[^/]+$/, '')] }).css
        : raw;

      const result = css
        .replace(/\.(fw-)([\w-]+)/g, `.${namespace}-$2`)
        .replace(/--(fw-)([\w-]+)/g, `--${namespace}-$2`);

      return `export default ${JSON.stringify(result)}`;
    },
  };
}
