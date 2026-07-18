import type { App } from 'vue';
import { initFramework, type FrameworkOptions } from '../core/init';


export const AdaptoPlugin = {
  install(app: App, options: FrameworkOptions = {}) {
    const fw = initFramework(options);
    app.provide('fw', fw);
  },
};
