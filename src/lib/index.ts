export { AdaptoPlugin } from './plugin.ts';

//- Theme mode
export {
  applyThemeMode,
  getStoredThemeMode,
  getSystemThemeMode,
  storeThemeMode,
} from '../core/theme-mode.ts';
export type { ThemeMode } from '../core/types';

/*
 * Cada componente inyecta su propio CSS al renderizarse, así que un consumidor
 * que solo importe algunos de estos se lleva únicamente sus estilos.
 */

//- Element
export { default as AdaptoAccordion } from './components/element/adpt-accordion/index.vue';
export { default as AdaptoAccordionList } from './components/element/adpt-accordion-list/index.vue';
export { default as AdaptoAvatar } from './components/element/adpt-avatar/index.vue';
export { default as AdaptoButton } from './components/element/adpt-button/index.vue';
export { default as AdaptoCalendar } from './components/element/adpt-calendar/index.vue';
export { default as AdaptoCard } from './components/element/adpt-card/index.vue';
export { default as AdaptoIcon } from './components/element/adpt-icon/index.vue';

//- Overlay
export { default as AdaptoDialog } from './components/overlay/adpt-dialog/index.vue';
export { default as AdaptoTooltip } from './components/overlay/adpt-tooltip/index.vue';

//- Form
export { default as AdaptoCheckbox } from './components/form/adpt-checkbox/index.vue';
export { default as AdaptoInputField } from './components/form/adpt-input-field/index.vue';
export { default as AdaptoRadio } from './components/form/adpt-radio/index.vue';
export { default as AdaptoSelect } from './components/form/adpt-select/index.vue';
export { default as AdaptoTextarea } from './components/form/adpt-textarea/index.vue';
