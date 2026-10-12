# Pagination

`adpt-pagination` es un control de paginación numerada construido sobre `AdaptoButton`: renderiza
un botón por página dentro de un `<nav>`, con botones opcionales de "primera página"/"última
página" además de los de anterior/siguiente. Gestiona su página activa mediante `v-model` y
deshabilita automáticamente los controles de navegación al llegar a los extremos.

- **Nombre del componente:** `AdaptoPagination`
- **Fuente:** `src/lib/components/navigation/adpt-pagination/index.vue`
- **Estilos:** `src/lib/components/navigation/adpt-pagination/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoPagination`
está disponible de forma global. `modelValue` (`v-model`) guarda el número de página activa
(1-based); `length` es obligatoria e indica el número total de páginas:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const pageBasic = ref(1)
const pageEdges = ref(3)
const pageVariant = ref(2)
const pageColor = ref(2)
const pageSize = ref(2)
const pageIcons = ref(2)
</script>

<div class="demo">
  <AdaptoPagination v-model="pageBasic" :length="5" color="primary-400" active-color="primary-500" />
</div>

```vue-html
<AdaptoPagination v-model="page" :length="5" color="primary-400" active-color="primary-500" />
```

```ts
import { ref } from 'vue'

const page = ref(1)
```

Cada botón de página se renderiza con `AdaptoButton` y emite `update:modelValue` con el número de
página pulsado; los botones de anterior/siguiente (y, si están activos, primera/última) emiten el
mismo evento con la página de destino, pero solo cuando moverse tiene sentido (ver
[Estados](#estados) más abajo).

## Primera y última página

La prop `showLastFirst` añade controles para saltar directamente a la primera y a la última
página, situados antes del botón "anterior" y después del botón "siguiente" respectivamente. Por
defecto es `false`, es decir, solo se renderizan anterior/siguiente más los botones de página.

<div class="demo">
  <AdaptoPagination v-model="pageEdges" :length="6" show-last-first color="primary-400" active-color="primary-500" />
</div>

```vue-html
<AdaptoPagination v-model="page" :length="6" show-last-first color="primary-400" active-color="primary-500" />
```

## Variante de los botones

La prop `itemsVariant` se reenvía directamente a la prop `variant` de cada `AdaptoButton` interno
(página, anterior/siguiente y primera/última). Acepta los mismos valores que
[`adpt-button`](./adpt-button.md#variantes): `'outlined' | 'fussy' | 'soft' | 'soul' | 'link'`. Por
defecto es `'soul'`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoPagination v-model="pageVariant" :length="4" items-variant="outlined" color="primary-400" active-color="primary-500" />
  <AdaptoPagination v-model="pageVariant" :length="4" items-variant="fussy" color="primary-400" active-color="primary-500" />
  <AdaptoPagination v-model="pageVariant" :length="4" items-variant="soft" color="primary-400" active-color="primary-500" />
  <AdaptoPagination v-model="pageVariant" :length="4" items-variant="soul" color="primary-400" active-color="primary-500" />
</div>

```vue-html
<AdaptoPagination v-model="page" :length="4" items-variant="outlined" color="primary-400" active-color="primary-500" />
<AdaptoPagination v-model="page" :length="4" items-variant="fussy" color="primary-400" active-color="primary-500" />
<AdaptoPagination v-model="page" :length="4" items-variant="soft" color="primary-400" active-color="primary-500" />
<AdaptoPagination v-model="page" :length="4" items-variant="soul" color="primary-400" active-color="primary-500" />
```

## Colores

Las props `color` y `activeColor` aceptan el nombre de un token del tema (primitivo, p. ej.
`green-500`, o semántico, p. ej. `primary-500`), igual que la prop `color` de
[`adpt-button`](./adpt-button.md#colores). Por defecto son `'secondary-400'` y `'secondary-500'`.
Internamente, cada botón de página recibe `activeColor` cuando es la página activa, y `color` para
el resto:

<div class="demo">
  <AdaptoPagination v-model="pageColor" :length="4" color="success-400" active-color="success-700" />
</div>

```vue-html
<AdaptoPagination v-model="page" :length="4" color="success-400" active-color="success-700" />
```

::: warning Color vacío
Si `color` se deja vacío, las páginas inactivas no caen en un valor por defecto razonable: la
resolución interna (`props.color ? props.color : \`on-${props.color}\``) evalúa la rama `else`
pero vuelve a leer `props.color`, que sigue vacío, y resuelve al nombre de token literal `"on-"`.
Pasa siempre un `color` explícito para evitar este caso.
:::

Los botones de anterior/siguiente/primera/última siempre usan `color`, nunca `activeColor`.

## Tamaños

La prop `size` se reenvía a cada `AdaptoButton` interno y acepta los mismos valores que
[`adpt-button`](./adpt-button.md#tamanos): `'xs' | 'sm' | 'md' | 'lg' | 'xl'`. Por defecto es
`'xs'`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoPagination v-model="pageSize" :length="4" size="xs" color="primary-400" active-color="primary-500" />
  <AdaptoPagination v-model="pageSize" :length="4" size="sm" color="primary-400" active-color="primary-500" />
  <AdaptoPagination v-model="pageSize" :length="4" size="md" color="primary-400" active-color="primary-500" />
  <AdaptoPagination v-model="pageSize" :length="4" size="lg" color="primary-400" active-color="primary-500" />
</div>

```vue-html
<AdaptoPagination v-model="page" :length="4" size="xs" color="primary-400" active-color="primary-500" />
<AdaptoPagination v-model="page" :length="4" size="sm" color="primary-400" active-color="primary-500" />
<AdaptoPagination v-model="page" :length="4" size="md" color="primary-400" active-color="primary-500" />
<AdaptoPagination v-model="page" :length="4" size="lg" color="primary-400" active-color="primary-500" />
```

## Iconos de navegación

Las props `firstPageIcon`, `previousIcon`, `nextIcon` y `lastPageIcon` fijan el nombre de icono
(lucide, vía `AdaptoButton`/`AdaptoIcon`) usado por cada control de navegación. Los valores por
defecto son `'chevron-first'`, `'chevron-left'`, `'chevron-right'` y `'chevron-last'`.

<div class="demo">
  <AdaptoPagination
    v-model="pageIcons"
    :length="4"
    show-last-first
    first-page-icon="arrow-left-to-line"
    previous-icon="arrow-left"
    next-icon="arrow-right"
    last-page-icon="arrow-right-to-line"
    color="primary-400"
    active-color="primary-500"
  />
</div>

```vue-html
<AdaptoPagination
  v-model="page"
  :length="4"
  show-last-first
  first-page-icon="arrow-left-to-line"
  previous-icon="arrow-left"
  next-icon="arrow-right"
  last-page-icon="arrow-right-to-line"
  color="primary-400"
  active-color="primary-500"
/>
```

Todos los botones de navegación (primera, anterior, siguiente, última) se renderizan con
`hideLabel` activado: son siempre botones solo-icono, con el icono correspondiente marcado como
`aria-hidden` por `AdaptoButton` (ver [Botón solo icono](./adpt-button.md#boton-solo-icono)).

## Estados

La prop `disabled` deshabilita **todos** los botones del componente, incluidos los de página. Al
margen de `disabled`, los controles de navegación también se deshabilitan solos por posición:
"anterior" y "primera" cuando `modelValue` es `1`, y "siguiente" y "última" cuando `modelValue` es
igual a `length`. Los botones de página individuales **no** se deshabilitan por su posición, solo
por la prop `disabled` de nivel superior.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoPagination :model-value="1" :length="4" show-last-first color="primary-400" active-color="primary-500" />
  <AdaptoPagination :model-value="2" :length="4" show-last-first disabled color="primary-400" active-color="primary-500" />
</div>

```vue-html
<!-- primera página: "primera" y "anterior" quedan deshabilitados por posición -->
<AdaptoPagination :model-value="1" :length="4" show-last-first color="primary-400" active-color="primary-500" />

<!-- disabled deshabilita absolutamente todos los botones -->
<AdaptoPagination :model-value="2" :length="4" show-last-first disabled color="primary-400" active-color="primary-500" />
```

## Limitación conocida: `totalVisible`

El componente declara una prop `totalVisible` pensada para limitar cuántos números de página se
muestran a la vez (con elipsis en los extremos), pero esa lógica de ventana/elipsis está comentada
en el código fuente y no se ejecuta. En el estado actual, `adpt-pagination` siempre renderiza **un
botón por cada página de `length`**, sin importar el valor de `totalVisible`; con un `length`
grande esto produce una lista de botones igualmente grande.

## Props

| Prop            | Tipo     | Por defecto       | Descripción                                                                                   |
| --------------- | -------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `modelValue`    | `number` | `0`                | Página activa (1-based). Pensada para usarse con `v-model`.                                     |
| `length`        | `number` | `0` (**requerida**) | Número total de páginas. Determina cuántos botones de página se renderizan.                    |
| `disabled`      | `boolean`| `false`            | Deshabilita todos los botones del componente (navegación y páginas).                            |
| `ariaLabel`     | `string` | `'Paginación'`     | `aria-label` del `<nav>` raíz.                                                                   |
| `showLastFirst` | `boolean`| `false`            | Muestra los botones de "primera página" y "última página" además de anterior/siguiente.         |
| `totalVisible`  | `number` | `0`                | Declarada pero sin efecto: la lógica de ventana/elipsis asociada está comentada en el código fuente y nunca se ejecuta (ver [limitación conocida](#limitacion-conocida-totalvisible)). |
| `itemsVariant`  | `string` | `'soul'`           | Se reenvía como `variant` a cada `AdaptoButton` interno (página y navegación).                  |
| `color`         | `string` | `'secondary-400'`  | Token de color usado por los botones de navegación y por las páginas inactivas.                 |
| `activeColor`   | `string` | `'secondary-500'`  | Token de color usado por el botón de la página activa.                                          |
| `size`          | `string` | `'xs'`             | Se reenvía como `size` a cada `AdaptoButton` interno.                                            |
| `firstPageIcon` | `string` | `'chevron-first'`  | Nombre de icono del botón "primera página" (solo visible con `showLastFirst`).                  |
| `lastPageIcon`  | `string` | `'chevron-last'`   | Nombre de icono del botón "última página" (solo visible con `showLastFirst`).                   |
| `previousIcon`  | `string` | `'chevron-left'`   | Nombre de icono del botón "anterior".                                                            |
| `nextIcon`      | `string` | `'chevron-right'`  | Nombre de icono del botón "siguiente".                                                           |

## Emits

| Evento              | Payload  | Descripción                                                                                   |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `update:modelValue`  | `number` | Se emite con la página de destino al pulsar un número de página, anterior/siguiente o primera/última — salvo que el destino coincida con la página activa o se salga de los límites (`1`..`length`), en cuyo caso no se emite nada. |

::: info Evento declarado sin uso
El componente también declara `updateValue` en `defineEmits`, pero ninguna ruta del código lo
emite: la llamada correspondiente está comentada junto a la lógica de `update:modelValue`. No
cuentes con que `updateValue` se dispare nunca.
:::

## Slots

`adpt-pagination` no expone slots: la estructura de la lista de botones es siempre el marcado
interno del componente.

## Accesibilidad

- El elemento raíz es un `<nav role="navigation">` con `aria-label` configurable vía la prop
  `ariaLabel` (por defecto `'Paginación'`).
- Los botones de página son botones de texto normales (número visible); los de
  navegación/primera/última se renderizan con `hideLabel`, por lo que dependen del `aria-label`
  que `AdaptoButton` deriva de su propio `label` interno y del icono marcado `aria-hidden`.
- Los botones de navegación se deshabilitan de forma nativa (`disabled`) en los extremos de la
  paginación, lo que los retira del orden de tabulación activo y evita que los lectores de
  pantalla los anuncien como interactivos.
- **Limitación actual:** la página activa solo se distingue visualmente mediante la clase
  `active` en su `<li>`; el componente no fija `aria-current="page"` en el elemento activo, así
  que las tecnologías de asistencia no reciben una señal semántica de cuál es la página
  seleccionada.
