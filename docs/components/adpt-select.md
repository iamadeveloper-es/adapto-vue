# Select

`adpt-select` es un combobox/listbox propio construido a partir de un `<button>` y un popup
`role="listbox"` (sin `<select>` nativo de por medio). Admite cuatro variantes visuales, navegación
completa por teclado (flechas, Inicio/Fin, búsqueda por escritura), cierre al hacer clic fuera y
una transición animada de apertura y cierre.

- **Nombre del componente:** `AdaptoSelect`
- **Fuente:** `src/lib/components/form/adpt-select/index.vue`
- **Estilos:** `src/lib/components/form/adpt-select/style.scss` (inyectados en el primer render vía
  `useStyle`, no registrados en `AdaptoPlugin`)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoSelect` está
disponible de forma global. `options` es obligatoria; `modelValue` controla el elemento
seleccionado mediante `v-model`.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const fruit = ref()
const fruitOptions = [
  { label: 'Manzana', value: 'apple' },
  { label: 'Plátano', value: 'banana' },
  { label: 'Cereza', value: 'cherry' },
  { label: 'Pitaya', value: 'dragon-fruit' },
]
</script>

<div class="demo">
  <AdaptoSelect v-model="fruit" :options="fruitOptions" color="primary-700" />
  <span>modelValue: {{ fruit }}</span>
</div>

```vue-html
<AdaptoSelect v-model="fruit" :options="fruitOptions" color="primary-700" />
```

```ts
const fruit = ref()
const fruitOptions = [
  { label: 'Manzana', value: 'apple' },
  { label: 'Plátano', value: 'banana' },
  { label: 'Cereza', value: 'cherry' },
  { label: 'Pitaya', value: 'dragon-fruit' },
]
```

Mientras `modelValue` está vacío o sin definir, el botón muestra el texto de marcador de posición
`Selecciona una opción`. Una vez fijado un valor, muestra `selectedItem.label`: la etiqueta de la
opción cuyo `value` coincide con `modelValue`.

## Variantes

La prop `variant` controla el estilo visual del botón del combobox y del listbox. Por defecto es
`outlined`.

<div class="demo">
  <AdaptoSelect variant="outlined" color="primary-700" :options="fruitOptions" />
  <AdaptoSelect variant="fussy" color="primary-700" :options="fruitOptions" />
  <AdaptoSelect variant="soft" color="primary-700" :options="fruitOptions" />
  <AdaptoSelect variant="underlined" color="primary-700" :options="fruitOptions" />
</div>

```vue-html
<AdaptoSelect variant="outlined" color="primary-700" :options="fruitOptions" />
<AdaptoSelect variant="fussy" color="primary-700" :options="fruitOptions" />
<AdaptoSelect variant="soft" color="primary-700" :options="fruitOptions" />
<AdaptoSelect variant="underlined" color="primary-700" :options="fruitOptions" />
```

| Variante     | Descripción                                                                              |
| ------------ | ----------------------------------------------------------------------------------------- |
| `outlined`   | Fondo transparente con un borde en `currentColor`. **Por defecto.**                       |
| `fussy`      | Borde **y** fondo tintado (`color-mix`): la variante visualmente más prominente.          |
| `soft`       | Fondo tintado, sin borde.                                                                 |
| `underlined` | Fondo casi transparente con solo borde inferior y esquinas superiores rectas.             |

Si se pasa a `variant` un valor fuera de este conjunto, `normalizedVariant` cae en la cadena
literal `'outlined'` en lugar de en una clase `fw-select--outlined`, lo que significa que en ese
caso límite no se aplica ninguna clase de variante. En la práctica, el propio `validator` de la
prop ya restringe la entrada a los cuatro valores válidos, así que esto solo importa si se salta la
comprobación de tipos.

## Colores

La prop `color` acepta el nombre de un token del tema (primitivo, p. ej. `green-500`, o semántico,
p. ej. `primary-700`) tal y como se expone en las custom properties CSS que genera el tema, es
decir `--adapto-<color>`. Define el color de texto del select (`currentColor`), que las variantes
anteriores reutilizan para bordes y fondos tintados. Por defecto es `primary-700`.

<div class="demo">
  <AdaptoSelect variant="fussy" color="primary-700" :options="fruitOptions" />
  <AdaptoSelect variant="fussy" color="success-600" :options="fruitOptions" />
  <AdaptoSelect variant="fussy" color="warning-600" :options="fruitOptions" />
  <AdaptoSelect variant="fussy" color="danger-600" :options="fruitOptions" />
</div>

```vue-html
<AdaptoSelect variant="fussy" color="primary-700" :options="fruitOptions" />
<AdaptoSelect variant="fussy" color="success-600" :options="fruitOptions" />
<AdaptoSelect variant="fussy" color="warning-600" :options="fruitOptions" />
<AdaptoSelect variant="fussy" color="danger-600" :options="fruitOptions" />
```

## Icono

La prop `icon` (`{ name, size? }`, correspondiente al tipo `Icon`) controla el chevron final
renderizado vía `AdaptoIcon`. Por defecto es `{ name: 'chevron-down' }`. Si se omite `size`, se
calcula a partir de la variable CSS `--fw-select-font-size` del select (con `1rem` de respaldo) más
2px.

<div class="demo">
  <AdaptoSelect color="primary-700" :options="fruitOptions" :icon="{ name: 'list-filter' }" />
</div>

```vue-html
<AdaptoSelect color="primary-700" :options="fruitOptions" :icon="{ name: 'list-filter' }" />
```

::: warning La prop `size` no tiene efecto visible
`adpt-select` declara una prop `size` (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`, por defecto `'xs'`) y la
hoja de estilos define las clases modificadoras correspondientes `.fw-select--xs` … `.fw-select--xl`
con distinto padding y tamaño de fuente. El componente nunca lee `props.size` en el template ni en
ninguna lista de clases calculada, así que pasar `size` no tiene efecto hoy por hoy: el select se
renderiza siempre con su estilo base, sin dimensionar.
:::

## Interacción con teclado y ratón

- **Clic** en el botón alterna la apertura y el cierre del listbox.
- **Flecha abajo / Flecha arriba** mueven la opción activa; si la lista está cerrada, cualquiera de
  las dos la abre primero (partiendo de la opción seleccionada, o de la primera si no hay ninguna).
- **Inicio / Fin** saltan a la primera o la última opción, solo mientras la lista está abierta.
- **Enter / Espacio** seleccionan la opción activa y cierran la lista; si la lista está cerrada, la
  abren.
- **Escape** cierra la lista (solo si está abierta); **Tab** la cierra sin cambiar el valor y deja
  que el foco avance con naturalidad.
- **Búsqueda por escritura**: teclear cualquier carácter alfanumérico busca en las etiquetas de las
  opciones por coincidencia de prefijo sin distinguir mayúsculas. Si la lista está abierta, la
  coincidencia mueve la opción activa; si está cerrada, selecciona directamente esa opción. El búfer
  escrito se reinicia tras 500 ms de inactividad.
- **Pasar el ratón** sobre una opción la marca como activa; el **clic** la selecciona y cierra la
  lista.
- **Clic fuera** del componente (mediante la directiva `v-click-outside`) cierra la lista.
- La opción activa se desplaza a la vista (`block: 'nearest'`) cada vez que cambia.

Pruébalo con el teclado en la demo anterior: enfoca el botón, pulsa <kbd>Flecha abajo</kbd> para
abrir y recorrer las opciones, escribe una letra para saltar a una etiqueta coincidente y pulsa
<kbd>Enter</kbd> para seleccionar.

## Props

| Prop         | Tipo                                                       | Por defecto                      | Descripción                                                                                                    |
| ------------ | ------------------------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `modelValue` | `string`                                                    | —                                 | Enlace de `v-model`. Muestra `selectedItem.label` cuando coincide con el `value` de una opción; si no, el marcador de posición. |
| `options`    | `ComboboxOptions[]` (`{ label: string, value: string \| number }[]`) | —          | **Obligatoria.** Opciones renderizadas como entradas del listbox.                                               |
| `color`      | `string`                                                    | `'primary-700'`                  | Nombre de token del tema resuelto vía `fw.cv()` y usado como color de texto del select.                         |
| `variant`    | `'outlined' \| 'fussy' \| 'soft' \| 'underlined'`             | `'outlined'`                     | Estilo visual del botón y del listbox.                                                                           |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                        | `'xs'`                            | Declarada, y existen las clases de tamaño correspondientes en la hoja de estilos, pero la prop nunca se lee en el componente: no tiene efecto. |
| `icon`       | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`) | `{ name: 'chevron-down' }`   | Icono final renderizado vía `AdaptoIcon`. `size` se calcula automáticamente a partir del tamaño de fuente si se omite. |

## Emits

| Evento              | Payload            | Descripción                                                        |
| -------------------- | -------------------- | ---------------------------------------------------------------------- |
| `update:modelValue`  | `string \| number`  | Se emite con el `value` de la opción elegida al seleccionar una.     |
| `onChange`           | —                   | Declarado en los emits del componente pero nunca emitido por el script. |
| `onFocus`            | —                   | Declarado en los emits del componente pero nunca emitido por el script. |
| `onBlur`             | —                   | Declarado en los emits del componente pero nunca emitido por el script. |

## Slots

`adpt-select` no expone slots: las etiquetas de las opciones vienen exclusivamente de
`options[].label`, y el texto del marcador de posición (`Selecciona una opción`) está escrito a
fuego y no es sobrescribible.

## Accesibilidad

- El botón del combobox lleva `role="combobox"`, `aria-haspopup="listbox"`, un `:aria-expanded` que
  refleja el estado abierto/cerrado y un `:aria-controls` que apunta al id del listbox.
- Mientras la lista está abierta, el `:aria-activedescendant` del botón apunta al id de la opción
  activa, de modo que las tecnologías de asistencia siguen la navegación por teclado sin mover el
  foco del DOM fuera del botón.
- El listbox tiene `role="listbox"` y un `:aria-labelledby` que referencia el id del botón.
- Cada opción tiene `role="option"` y `:aria-selected` a `true` en la que coincide con el
  `modelValue` actual.
- El soporte completo de teclado viene de serie (consulta la lista de interacciones anterior): no
  hace falta cablear nada para la navegación con flechas, la búsqueda por escritura o el cierre con
  `Escape`/`Tab`.
- El componente no acepta una prop `label`/`aria-label`, y el `id` del botón interno se genera con
  `useId()`: no se expone como prop ni es accesible desde fuera del componente. Quien necesite un
  nombre accesible para el combobox (p. ej. mediante un `<label for>` externo) no dispone de una vía
  integrada para conectarlo; envolver el componente en un `<div role="group">`/`fieldset` etiquetado
  es la solución práctica.
