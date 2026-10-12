# Range

`adpt-range` es un slider de valor único construido a mano (sin `<input type="range">` nativo):
un `div` con `role="slider"` que se arrastra con el puntero o se mueve con el teclado. Admite
rango y paso configurables, una etiqueta de valor flotante opcional, colores de pista/indicador
personalizables y un mensaje de validación en línea.

- **Nombre del componente:** `AdaptoRange`
- **Fuente:** `src/lib/components/form/adpt-range/index.vue`
- **Estilos:** `src/lib/components/form/adpt-range/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoRange` está
disponible de forma global. Ninguna prop es obligatoria; `modelValue` controla el valor mediante
`v-model`, y si se omite, el componente se muestra y se comporta como si valiera `min`.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const volume = ref(40)
const price = ref(250)
const brightness = ref(70)
</script>

<div class="demo" style="display: block;">
  <AdaptoRange v-model="volume" track-color="primary-500" indicator-color="primary-500" style="max-width: 320px;" />
  <p>modelValue: {{ volume }}</p>
</div>

```vue-html
<AdaptoRange v-model="volume" track-color="primary-500" indicator-color="primary-500" />
```

```ts
const volume = ref(40)
```

El valor se puede cambiar arrastrando la miniatura (o haciendo clic/`pointerdown` en cualquier
punto de la pista, que mueve la miniatura directamente a esa posición), o con el teclado una vez
que la miniatura tiene el foco.

## Rango y paso

Las props `min`, `max` y `step` acotan y cuantizan el valor. Por defecto son `0`, `100` y `1`. El
valor interno siempre se recalcula con `clamp`: primero se ajusta al múltiplo de `step` más
cercano relativo a `min`, y después se acota al intervalo `[min, max]`. Esto se aplica tanto al
valor que llega por `modelValue` como al que produce cualquier interacción.

<div class="demo" style="display: block;">
  <AdaptoRange v-model="price" :min="100" :max="500" :step="25" track-color="secondary-500" indicator-color="secondary-500" style="max-width: 320px;" />
  <p>modelValue: {{ price }}</p>
</div>

```vue-html
<AdaptoRange v-model="price" :min="100" :max="500" :step="25" />
```

## Valor visible

La prop `showValue` añade un pequeño globo numérico encima de la miniatura con el valor actual, y
fija `aria-valuetext` al mismo número (en lugar de dejarlo en `undefined`).

<div class="demo" style="display: block;">
  <AdaptoRange v-model="brightness" show-value track-color="success-600" indicator-color="success-600" style="max-width: 320px;" />
</div>

```vue-html
<AdaptoRange v-model="brightness" show-value />
```

::: tip Sin fondo en el globo de valor
La hoja de estilos de `adpt-range` define `.fw-range__value` con `color: currentColor` pero la
línea `background-color: var(--fw-range-value-bg)` está comentada. El globo de valor se renderiza
hoy sin fondo propio, apoyado solo en el color de texto.
:::

## Colores

`trackColor` e `indicatorColor` aceptan el nombre de un token del tema (p. ej. `primary-500`,
`success-600`), resuelto mediante `fw.getVar` igual que en `adpt-checkbox`/`adpt-radio`.

- `trackColor` fija el `background-color` inline de la pista **y** del relleno, sustituyendo a las
  custom properties `--fw-range-track-bg` / `--fw-range-track-fill-bg` cuando se define.
- `indicatorColor` fija el `color` inline de la miniatura, que el CSS consume vía `currentColor`
  (el fondo de la miniatura, el resalte de `::after` y el globo de valor), sustituyendo a
  `--fw-range-thumb-bg` cuando se define.

<div class="demo" style="display: block; gap: 20px;">
  <AdaptoRange :model-value="60" track-color="primary-500" indicator-color="primary-500" style="max-width: 320px;" />
  <AdaptoRange :model-value="60" track-color="warning-600" indicator-color="warning-600" style="max-width: 320px;" />
  <AdaptoRange :model-value="60" track-color="danger-600" indicator-color="danger-600" style="max-width: 320px;" />
</div>

```vue-html
<AdaptoRange :model-value="60" track-color="primary-500" indicator-color="primary-500" />
<AdaptoRange :model-value="60" track-color="warning-600" indicator-color="warning-600" />
<AdaptoRange :model-value="60" track-color="danger-600" indicator-color="danger-600" />
```

Si se omiten ambas props, la pista, el relleno y la miniatura caen en los tokens del tema
`component.range.*` definidos en `Atlas.ts` (`track-bg`, `track-fill-bg`, `thumb-bg`, …).

## Estados

<div class="demo" style="display: block;">
  <AdaptoRange :model-value="30" disabled track-color="primary-500" indicator-color="primary-500" style="max-width: 320px;" />
</div>

```vue-html
<AdaptoRange :model-value="30" disabled />
```

`disabled` añade la clase modificadora `--disabled` (opacidad `0.5` y `pointer-events: none` sobre
todo el componente), fija `tabindex="-1"` y `aria-disabled="true"` en la miniatura, y hace que los
manejadores de `pointerdown` y `keydown` retornen de inmediato sin aplicar ningún cambio.

## Validación

La prop `validations` renderiza un mensaje de error bajo el slider y lo enlaza con
`aria-describedby`. No se valida nada automáticamente: el componente solo muestra el texto que se
le pase.

<div class="demo" style="display: block;">
  <AdaptoRange :model-value="10" validations="El valor debe ser mayor que 20" track-color="danger-600" indicator-color="danger-600" style="max-width: 320px;" />
</div>

```vue-html
<AdaptoRange :model-value="10" validations="El valor debe ser mayor que 20" />
```

## Interacción con teclado y ratón

- **`pointerdown`** sobre la pista o la miniatura calcula el valor a partir de la posición
  horizontal del puntero dentro del rectángulo de la pista, lo aplica de inmediato y enfoca la
  miniatura; después registra `pointermove`/`pointerup` en `window` para seguir arrastrando aunque
  el puntero salga del componente.
- **`pointerup`** (en cualquier punto de la ventana) retira esos listeners; también se retiran al
  desmontar el componente.
- **Flecha derecha / Flecha arriba**: incrementa el valor en `step`.
- **Flecha izquierda / Flecha abajo**: decrementa el valor en `step`.
- **Inicio**: salta a `min`. **Fin**: salta a `max`.
- Todas las teclas anteriores llaman a `preventDefault()`; ninguna tiene efecto mientras
  `disabled` es `true`.
- El foco y el desenfoque de la miniatura alternan una clase `is-focused` (contorno de `2px` en
  `currentColor`) y emiten `onFocus`/`onBlur`.

## Props

| Prop             | Tipo      | Por defecto                    | Descripción                                                                                                    |
| ----------------- | --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `modelValue`      | `number`  | — (sin valor por defecto)      | Enlace de `v-model`. Se lee siempre a través de `clamp` (ajustado a `step`, acotado a `[min, max]`); si es `undefined`, se trata como `min`. |
| `min`             | `number`  | `0`                              | Límite inferior; también `aria-valuemin` y la base de referencia para el ajuste a `step`.                        |
| `max`             | `number`  | `100`                            | Límite superior; también `aria-valuemax` y el denominador del porcentaje de relleno.                             |
| `step`            | `number`  | `1`                              | Incremento de ajuste (`clamp`) y de cada pulsación de flecha.                                                    |
| `disabled`        | `boolean` | `false`                          | Añade la clase `--disabled`, fija `tabindex="-1"` y bloquea los manejadores de puntero y teclado.                |
| `trackColor`      | `string`  | — (sin valor por defecto)       | Token del tema resuelto vía `fw.getVar`; fija el `background-color` inline de la pista y del relleno.           |
| `indicatorColor`  | `string`  | — (sin valor por defecto)       | Token del tema resuelto vía `fw.getVar`; fija el `color` inline de la miniatura (consumido como `currentColor`). |
| `showValue`       | `boolean` | `false`                          | Muestra el globo de valor numérico sobre la miniatura y fija `aria-valuetext`.                                   |
| `label`           | `string`  | `'Range'`                        | Usada únicamente como `aria-label` de la miniatura; no se renderiza ningún texto visible.                        |
| `validations`     | `string`  | — (sin valor por defecto)       | Texto del mensaje de error. Cuando se define, renderiza un `span` con `role="alert"` enlazado vía `aria-describedby`. |

## Emits

| Evento              | Payload       | Descripción                                                              |
| -------------------- | ------------- | --------------------------------------------------------------------------- |
| `update:modelValue`  | `number`      | Se emite siempre acotado por `clamp`, tras arrastrar, hacer clic en la pista o pulsar una tecla. |
| `onFocus`            | `FocusEvent`  | Se emite al enfocar la miniatura. (Nombre del evento con prefijo `on`, no `focus`.) |
| `onBlur`             | `FocusEvent`  | Se emite al desenfocar la miniatura. (Nombre del evento con prefijo `on`, no `blur`.) |

## Slots

`adpt-range` no expone slots: el globo de valor, la pista y el mensaje de error son siempre el
marcado interno del componente.

## Accesibilidad

- La miniatura expone `role="slider"`, `aria-orientation="horizontal"`, `aria-valuemin`,
  `aria-valuemax` y `aria-valuenow` actualizados en vivo con cada cambio de valor.
- `aria-valuetext` solo se fija cuando `showValue` es `true`; en caso contrario queda `undefined`
  y las tecnologías de asistencia anuncian el número crudo de `aria-valuenow`.
- `label` (por defecto `'Range'`) es siempre el `aria-label` de la miniatura: no hay ningún texto
  visible de etiqueta en el componente, así que conviene pasar un valor descriptivo en vez de
  dejar el genérico por defecto.
- `disabled` añade `aria-disabled="true"` y retira la miniatura del orden de tabulación
  (`tabindex="-1"`), además de bloquear la interacción de puntero y teclado.
- El soporte completo de teclado (flechas, Inicio/Fin) viene de serie una vez que la miniatura
  tiene el foco; no hace falta cablear nada adicional.
- Cuando se define `validations`, el mensaje de error se asocia a la miniatura vía
  `aria-describedby` y se renderiza con `role="alert"`, de modo que los lectores de pantalla lo
  anuncian en cuanto aparece.
