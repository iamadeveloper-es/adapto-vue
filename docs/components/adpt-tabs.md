# Tabs

`adpt-tabs` es una navegación por pestañas y conmutador de contenido construido a partir de un
array `tabs` de elementos `{ label, value, icon?, disabled? }`. Admite cuatro variantes visuales
(incluido un indicador subrayado animado), cinco tamaños, radio de esquina por pestaña, estirado a
ancho completo, alineación, un divisor bajo la lista de pestañas, iconos por pestaña y estados
deshabilitados, además de navegación completa con las teclas de flecha. El contenido de cada panel
se aporta mediante slots de nombre dinámico, y cambiar de pestaña anima el panel en la dirección
del movimiento.

- **Nombre del componente:** `AdaptoTabs`
- **Fuente:** `src/lib/components/navigation/adpt-tabs/index.vue`
- **Estilos:** `src/lib/components/navigation/adpt-tabs/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoTabs` está
disponible de forma global. `modelValue` (`v-model`) guarda el `value` de la pestaña activa; si se
omite o no coincide con ninguna pestaña, el componente cae en la primera pestaña no deshabilitada.
El contenido de cada panel va en un slot de nombre dinámico que coincide con el `value` de esa
pestaña:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const activeTab = ref('overview')
const demoTabs = [
  { label: 'Resumen', value: 'overview' },
  { label: 'Actividad', value: 'activity' },
  { label: 'Ajustes', value: 'settings' },
]

const variantTabs = [
  { label: 'Uno', value: 'one' },
  { label: 'Dos', value: 'two' },
]

const iconTabs = [
  { label: 'Inicio', value: 'home', icon: { name: 'house' } },
  { label: 'Perfil', value: 'profile', icon: { name: 'user' } },
  { label: 'Bloqueado', value: 'locked', icon: { name: 'lock' }, disabled: true },
]
</script>

<div class="demo" style="display: block;">
  <AdaptoTabs v-model="activeTab" color="primary-500" :tabs="demoTabs">
    <template #overview>
      <p>Contenido del panel de resumen.</p>
    </template>
    <template #activity>
      <p>Contenido del panel de actividad.</p>
    </template>
    <template #settings>
      <p>Contenido del panel de ajustes.</p>
    </template>
  </AdaptoTabs>
</div>

```vue-html
<AdaptoTabs v-model="activeTab" color="primary-500" :tabs="tabs">
  <template #overview>
    <p>Contenido del panel de resumen.</p>
  </template>
  <template #activity>
    <p>Contenido del panel de actividad.</p>
  </template>
  <template #settings>
    <p>Contenido del panel de ajustes.</p>
  </template>
</AdaptoTabs>
```

```ts
import { ref } from 'vue'

const activeTab = ref('overview')
const tabs = [
  { label: 'Resumen', value: 'overview' },
  { label: 'Actividad', value: 'activity' },
  { label: 'Ajustes', value: 'settings' },
]
```

Si el slot de una pestaña se deja vacío, el panel muestra como texto plano el `label` de la pestaña
activa, algo útil para prototipar rápido antes de conectar el contenido real.

## Variantes

La prop `variant` controla el estilo visual de la lista de pestañas. Por defecto es `underlined`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs variant="outlined" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="soft" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="underlined" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs variant="outlined" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="soft" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="underlined" color="primary-500" :tabs="tabs" />
```

| Variante     | Descripción                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `outlined`   | La pestaña activa recibe un borde `thin solid currentColor`; las inactivas quedan sin borde.    |
| `fussy`      | La pestaña activa recibe borde **y** fondo tintado (`color-mix`).                              |
| `soft`       | La pestaña activa recibe fondo tintado, sin borde.                                              |
| `underlined` | Sin borde ni fondo por pestaña. Un único `<span>` indicador animado se desliza y redimensiona para situarse bajo la pestaña activa. **Por defecto.** |

Cualquier valor fuera de estos cuatro cae en `underlined`, ya que la búsqueda interna de clases usa
esa variante cuando la prop no se reconoce.

## Colores

La prop `color` acepta el nombre de un token del tema (primitivo, p. ej. `green-500`, o semántico,
p. ej. `primary-500`), resuelto vía `fw.cv()` y aplicado como estilo inline `color` de la lista de
pestañas, que las variantes anteriores reutilizan mediante `currentColor` para bordes, fondos
tintados y el indicador subrayado.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs variant="fussy" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" color="success-600" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" color="danger-600" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs variant="fussy" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" color="success-600" :tabs="tabs" />
<AdaptoTabs variant="fussy" color="danger-600" :tabs="tabs" />
```

Si `color` se deja vacío (el valor por defecto), se resuelve al token del tema `primary-700`:
`getColor` es `props.color ? fw.cv(props.color) : fw.cv('primary-700')`.

## Tamaños

La prop `size` controla el padding y el tamaño de fuente de cada pestaña. Por defecto es `xs`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs size="xs" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="sm" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="md" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="lg" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs size="xl" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs size="xs" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="sm" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="md" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="lg" color="primary-500" :tabs="tabs" />
<AdaptoTabs size="xl" color="primary-500" :tabs="tabs" />
```

## Radio

La prop `radius` mapea a las clases utilitarias compartidas `.rounded--*` y se aplica a cada
pestaña individual. Por defecto es `sm`. Se aprecia sobre todo en las variantes
`outlined`/`fussy`/`soft`, ya que las pestañas `underlined` no tienen borde ni fondo propios que
redondear.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs variant="fussy" radius="xs" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" radius="md" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs variant="fussy" radius="full" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs variant="fussy" radius="xs" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" radius="md" color="primary-500" :tabs="tabs" />
<AdaptoTabs variant="fussy" radius="full" color="primary-500" :tabs="tabs" />
```

## Alineación

`tabsAlign` posiciona la lista de pestañas dentro de su contenedor (`justify-content` en la lista).
No tiene valor por defecto: omitirla deja la alineación `flex` de inicio que aplica el navegador.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoTabs tabs-align="start" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs tabs-align="center" color="primary-500" :tabs="variantTabs" />
  <AdaptoTabs tabs-align="end" color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs tabs-align="start" color="primary-500" :tabs="tabs" />
<AdaptoTabs tabs-align="center" color="primary-500" :tabs="tabs" />
<AdaptoTabs tabs-align="end" color="primary-500" :tabs="tabs" />
```

## Ancho completo y divisor

`fullWidth` estira la lista de pestañas al ancho del contenedor, repartiendo el espacio por igual
entre las pestañas. `divider` dibuja una línea fina bajo la lista de pestañas, con independencia de
la variante.

<div class="demo" style="display: block;">
  <AdaptoTabs full-width divider color="primary-500" :tabs="variantTabs" />
</div>

```vue-html
<AdaptoTabs full-width divider color="primary-500" :tabs="tabs" />
```

## Iconos y pestañas deshabilitadas

Cada elemento de `tabs` puede llevar su propio `icon` (reenviado a `AdaptoIcon` y marcado como
`aria-hidden="true"`) y su bandera `disabled`. Las pestañas deshabilitadas se renderizan con
`opacity: .5`, reciben `cursor: not-allowed`, no pueden pulsarse ni enfocarse con el puntero y la
navegación por teclado las salta.

<div class="demo" style="display: block;">
  <AdaptoTabs color="primary-500" :tabs="iconTabs" />
</div>

```vue-html
<AdaptoTabs
  color="primary-500"
  :tabs="[
    { label: 'Inicio', value: 'home', icon: { name: 'house' } },
    { label: 'Perfil', value: 'profile', icon: { name: 'user' } },
    { label: 'Bloqueado', value: 'locked', icon: { name: 'lock' }, disabled: true },
  ]"
/>
```

## Navegación por teclado

Una vez enfocada una pestaña, las teclas de flecha mueven a la vez el foco y la selección (esto
sigue el patrón de pestañas de «activación automática» de
[WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): solo la pestaña activa tiene
`tabindex="0"`, y todas las demás `tabindex="-1"`):

- **`Flecha derecha`** — pasa a la siguiente pestaña no deshabilitada, volviendo a la primera al
  llegar al final.
- **`Flecha izquierda`** — pasa a la anterior pestaña no deshabilitada, volviendo a la última al
  llegar al principio.
- **`Inicio`** — salta a la primera pestaña no deshabilitada.
- **`Fin`** — salta a la última pestaña no deshabilitada.

## Transiciones de panel

Cambiar de pestaña activa anima el contenido saliente y el entrante en la dirección del movimiento,
en lugar de hacer un fundido cruzado: el panel se desliza como si el contenido nuevo empujara al
antiguo fuera de la vista. Si la pestaña recién activada está a la **izquierda** de la anterior (un
índice menor en `tabs`), el panel entrante se desliza desde la izquierda empujando al saliente hacia
la derecha. Si está a la **derecha**, el panel entrante se desliza desde la derecha empujando al
saliente hacia la izquierda. Esto da al cambio de pestaña una sensación de dirección espacial acorde
con dónde se ha hecho clic o navegado.

## Props

| Prop             | Tipo                                                       | Por defecto    | Descripción                                                                 |
| ----------------- | ------------------------------------------------------------ | --------------- | ----------------------------------------------------------------------------- |
| `tabs`            | `TabItem[]` (`{ label, value, icon?, disabled? }`)            | **obligatoria** | Los elementos de pestaña a renderizar, en orden.                             |
| `modelValue`      | `string \| number`                                            | `undefined`     | `value` de la pestaña activa (`v-model`). Cae en la primera pestaña no deshabilitada si falta o no es válido. |
| `variant`         | `'outlined' \| 'fussy' \| 'soft' \| 'underlined'`             | `'underlined'`  | Estilo visual de la lista de pestañas. Los valores no reconocidos caen en `underlined`. |
| `color`           | `string`                                                      | `''`            | Nombre de token del tema resuelto vía `fw.cv()`, aplicado como `currentColor` (cae en `primary-700` si está vacío). |
| `size`            | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                        | `'xs'`          | Controla el padding y el tamaño de fuente de cada pestaña.                   |
| `radius`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`              | `'sm'`          | Radio de esquina aplicado a cada pestaña individual, vía `.rounded--*`.      |
| `fullWidth`       | `boolean`                                                     | `false`         | Estira la lista de pestañas a todo el ancho del contenedor, repartiendo el espacio por igual. |
| `label`           | `string`                                                      | `'Tabs'`        | `aria-label` del contenedor con `role="tablist"`.                            |
| `disableRipple`   | `boolean`                                                     | `false`         | Desactiva el feedback de clic de `v-ripple` en los botones de pestaña.       |
| `tabsAlign`       | `'start' \| 'center' \| 'end'`                                | `undefined`     | Alineación horizontal (`justify-content`) de la lista dentro de su contenedor. |
| `divider`         | `boolean`                                                     | `false`         | Renderiza una línea fina bajo la lista de pestañas.                          |

## Emits

| Evento              | Payload            | Descripción                                                              |
| -------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `update:modelValue`  | `tab.value`         | Se emite al activar una pestaña no deshabilitada, por clic o mediante navegación con flechas/Inicio/Fin. |

## Slots

| Slot                    | Descripción                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `[tab.value]` (dinámico) | Un slot por pestaña, nombrado según el `value` de esa pestaña. Recibe la prop de scope `{ tab: activeTab }`. Renderiza el contenido del panel correspondiente. |
| *(ninguno pasado)*       | Si el slot correspondiente está vacío o ausente, el panel muestra `activeTab?.label` como texto plano. |

## Accesibilidad

- La lista de pestañas tiene un `role="tablist"` estático con `aria-label` enlazado a la prop
  `label`; cada botón lleva `role="tab"`.
- `aria-selected` refleja si cada pestaña es la activa, y `aria-controls` apunta al `id` del panel
  correspondiente.
- Solo la pestaña activa tiene `tabindex="0"`; el resto tiene `tabindex="-1"`. Es el patrón estándar
  de roving tabindex para listas de pestañas: `Tab` entra y sale del tablist como una única parada,
  mientras que las flechas se mueven entre pestañas.
- El panel tiene `role="tabpanel"`, `tabindex="0"` y un `aria-labelledby` que apunta de vuelta al
  `id` de la pestaña activa.
- Los iconos por pestaña y el indicador subrayado se marcan como `aria-hidden="true"` para que las
  tecnologías de asistencia se apoyen en el texto visible y accesible de la pestaña.
- Las pestañas deshabilitadas usan el atributo nativo `disabled` en el `<button>`, así que quedan
  excluidas automáticamente del orden de tabulación y se anuncian como no disponibles.
