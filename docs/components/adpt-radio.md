# Radio

`adpt-radio` renderiza un input de tipo radio con un icono SVG propio (cuadrado sin marcar / marca
de verificación al marcarse), una etiqueta y un mensaje de validación en línea opcional. Varias
instancias de `AdaptoRadio` que comparten el mismo `name` y están enlazadas al mismo `v-model`
forman un grupo estándar de elección exclusiva: no existe un componente contenedor
`AdaptoRadioGroup` aparte.

- **Nombre del componente:** `AdaptoRadio`
- **Fuente:** `src/lib/components/form/adpt-radio/index.vue`
- **Estilos:** `src/lib/components/form/adpt-radio/style.scss` (se inyectan en el primer render del
  componente) para las clases de layout `fw-radio`, más las reglas compartidas `fw-check-radio` de
  `src/lib/styles/sass/globals/forms/_check-radio.scss` (usadas también por `AdaptoCheckbox`) para
  el icono, el anillo de foco y el estilo deshabilitado.

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoRadio` está
disponible de forma global. `name` y `value` son props obligatorias; `modelValue` es opcional en el
componente en sí, pero es la vía para leer y controlar la selección con `v-model`.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const plan = ref('pro')
const agreement = ref('')
const answer = ref('')
</script>

<div class="demo">
  <AdaptoRadio name="single-demo" value="on" label="Activar notificaciones" v-model="plan" active-color="primary-500" />
</div>

```vue-html
<AdaptoRadio
  v-model="enabled"
  name="single-demo"
  value="on"
  label="Activar notificaciones"
  active-color="primary-500"
/>
```

## Grupo de radios

Un grupo son sencillamente varios elementos `AdaptoRadio` que comparten un `name` (que los agrupa a
nivel de HTML nativo) y un `v-model` (que el componente compara con el `value` de cada radio
mediante `props.modelValue === props.value`, recurriendo a una comparación con `JSON.stringify`
para que también funcionen los valores con forma de objeto).

<div class="demo">
  <AdaptoRadio name="plan" value="basic" label="Básico" v-model="plan" active-color="primary-500" />
  <AdaptoRadio name="plan" value="pro" label="Pro" v-model="plan" active-color="primary-500" />
  <AdaptoRadio name="plan" value="enterprise" label="Enterprise" v-model="plan" active-color="primary-500" />
</div>

<p>Seleccionado: <code>{{ plan }}</code></p>

```vue-html
<AdaptoRadio name="plan" value="basic" label="Básico" v-model="plan" active-color="primary-500" />
<AdaptoRadio name="plan" value="pro" label="Pro" v-model="plan" active-color="primary-500" />
<AdaptoRadio name="plan" value="enterprise" label="Enterprise" v-model="plan" active-color="primary-500" />
```

::: tip No se aporta `<fieldset>`/`<legend>`
`AdaptoRadio` renderiza un `<div>` independiente por opción; nada dentro del componente los agrupa
bajo un `<fieldset>` con un `<legend>` que describa el grupo en conjunto. Si el grupo necesita una
etiqueta accesible de grupo, envuelve las instancias en tu propio `<fieldset>`/`<legend>` (o en un
`role="radiogroup"` + `aria-label`).
:::

## Colores

`activeColor` es el nombre de un token del tema (p. ej. `primary-500`, `danger-600`) aplicado como
`color` del icono **solo mientras el radio está marcado**; los radios sin marcar usan el
`currentColor` heredado del icono.

<div class="demo">
  <AdaptoRadio name="color-primary" value="on" label="Primary" model-value="on" active-color="primary-500" />
  <AdaptoRadio name="color-success" value="on" label="Success" model-value="on" active-color="success-600" />
  <AdaptoRadio name="color-danger" value="on" label="Danger" model-value="on" active-color="danger-600" />
</div>

```vue-html
<AdaptoRadio name="color-primary" value="on" label="Primary" model-value="on" active-color="primary-500" />
<AdaptoRadio name="color-success" value="on" label="Success" model-value="on" active-color="success-600" />
<AdaptoRadio name="color-danger" value="on" label="Danger" model-value="on" active-color="danger-600" />
```

::: warning `getVar`, no `cv`: un valor resuelto, no una referencia viva
A diferencia de los componentes que enlazan colores mediante `fw.cv(name)` (que produce la cadena
`var(--fw-<name>)`), `AdaptoRadio` resuelve `activeColor` con `fw.getVar(name)`, que llama a
`getComputedStyle(document.documentElement)` y lee el valor **ya resuelto** de `--fw-<name>` en el
momento del render. En la práctica sigue actualizándose correctamente al alternar, porque se evalúa
en línea dentro del template, pero está leyendo un valor calculado en lugar de emitir una
referencia `var()` como hace casi todo el resto de la librería.
:::

## Slots `label` y `link`

El texto por defecto de la prop `label` puede sustituirse con el slot `label`; un slot adicional
`link` se renderiza justo después, dentro del mismo `<label>` (útil para textos del estilo «Acepto
los **términos del servicio**», donde parte del texto necesita su propio enlace o interacción).

<div class="demo">
  <AdaptoRadio name="agreement" value="accepted" v-model="agreement" active-color="primary-500">
    <template #label>Acepto los</template>
    <template #link>&nbsp;<a href="#" @click.prevent>términos del servicio</a></template>
  </AdaptoRadio>
</div>

```vue-html
<AdaptoRadio name="agreement" value="accepted" v-model="agreement" active-color="primary-500">
  <template #label>Acepto los</template>
  <template #link>&nbsp;<a href="#">términos del servicio</a></template>
</AdaptoRadio>
```

## Validación

Cuando `validations` está definida, se renderiza un `<span role="alert">` de error bajo el input y
la etiqueta, con un id `{id}-error` al que apunta el `aria-describedby` del input. El componente no
decide *cuándo* mostrarlo (no hay estado interno de «tocado» o «inválido»): se renderiza
incondicionalmente siempre que la prop tenga valor, así que quien lo consume controla la visibilidad
enlazando `validations` de forma condicional.

<div class="demo">
  <AdaptoRadio name="answer" value="yes" v-model="answer" label="Sí" active-color="primary-500" />
  <AdaptoRadio
    name="answer"
    value="no"
    v-model="answer"
    label="No"
    active-color="primary-500"
    validations="Selecciona una opción antes de continuar"
  />
</div>

```vue-html
<AdaptoRadio name="answer" value="yes" v-model="answer" label="Sí" active-color="primary-500" />
<AdaptoRadio
  name="answer"
  value="no"
  v-model="answer"
  label="No"
  active-color="primary-500"
  :validations="showError ? 'Selecciona una opción antes de continuar' : undefined"
/>
```

## Estados

<div class="demo">
  <AdaptoRadio name="state-disabled" value="on" label="Deshabilitado" model-value="on" active-color="primary-500" disabled />
  <AdaptoRadio name="state-hidden" value="on" label="Etiqueta oculta (mantiene nombre accesible)" model-value="on" active-color="primary-500" hide-label />
</div>

```vue-html
<AdaptoRadio name="state-disabled" value="on" label="Deshabilitado" model-value="on" active-color="primary-500" disabled />
<AdaptoRadio name="state-hidden" value="on" label="Etiqueta oculta" model-value="on" active-color="primary-500" hide-label />
```

- **`disabled`** — establece el atributo nativo `disabled` en el `<input>` y añade una clase
  `disabled` a la raíz, que (mediante las reglas compartidas de `_check-radio.scss`) fuerza la
  etiqueta y el icono al token de color `--cacao-surface-300`, escrito a fuego: un prefijo distinto
  heredado de un esquema de nombres anterior, independiente del prefijo `fw` en tiempo de ejecución
  y de la prop `activeColor`.
- **`hideLabel`** — elimina el elemento `<label>` por completo (`v-if="!hideLabel"`) y añade una
  clase modificadora `--no-label` que anula los márgenes del layout. El `aria-label` del `<input>`
  sigue usando la prop `label` en cualquier caso, así que el radio conserva un nombre accesible aun
  sin etiqueta visible.
- El foco se sigue internamente (ref `isFocused`, actualizado en los eventos nativos
  `focus`/`blur`) y añade una clase `focused` que dibuja un contorno en `currentColor` alrededor del
  contenedor del icono: es un indicador de foco visible propio, no el contorno por defecto del
  navegador.

## Props

| Prop           | Tipo                                                        | Por defecto        | Descripción                                                                                     |
| -------------- | ------------------------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------- |
| `modelValue`   | `string \| number \| boolean \| Record<string, unknown>`     | —                   | Enlace de `v-model`: el valor seleccionado en todo el grupo.                                    |
| `value`        | `string \| number \| boolean \| Record<string, unknown>` (obligatoria) | —          | Valor que representa este radio concreto; se compara con `modelValue` para derivar el estado marcado. |
| `name`         | `string` (obligatoria)                                        | —                   | Atributo nativo `name`: los radios que comparten `name` forman un grupo.                        |
| `disabled`     | `boolean`                                                     | `false`             | Deshabilita el input nativo y aplica el estilo deshabilitado descrito arriba.                   |
| `label`        | `string`                                                      | `'Radio label'`     | Texto visible de la etiqueta y `aria-label` del input. El slot `label` sustituye el texto visible, pero el `aria-label` usa siempre el texto de esta prop, incluso cuando el slot renderiza otra cosa. |
| `hideLabel`    | `boolean`                                                     | `false`             | Elimina el elemento `<label>` visible y añade una clase modificadora `--no-label`. No afecta al `aria-label`. |
| `activeColor`  | `string`                                                      | `'secondary-400'`   | Nombre de token del tema resuelto vía `fw.getVar` y aplicado como color del icono, solo mientras está marcado. |
| `validations`  | `string`                                                      | `undefined`         | Texto del mensaje de error. Cuando se define, renderiza un span con `role="alert"` y cablea el `aria-describedby` del input. |

## Emits

| Evento              | Payload      | Descripción                                                                 |
| -------------------- | ------------ | ---------------------------------------------------------------------------- |
| `update:modelValue`  | `RadioValue` (`string \| number \| boolean \| Record<string, unknown>`) | Se emite a través del propio manejo de `v-model` del input nativo cuando este radio pasa a ser el marcado. |
| `onFocus`            | `FocusEvent` | Se emite en el `focus` nativo. Escúchalo con `@on-focus`, no con `@focus`: consulta la nota siguiente. |
| `onBlur`             | `FocusEvent` | Se emite en el `blur` nativo. Escúchalo con `@on-blur`, no con `@blur`.      |

::: warning Nombres de emits no estándar
`onFocus`/`onBlur` no siguen la convención de «kebab-case simple, cosa que ha ocurrido» usada en el
resto de la librería (compara con el `clicked` de `AdaptoButton`). Como Vue trata de forma especial
los nombres de prop/emit con forma `onXxx`, quien consume el componente debe escuchar con
`@on-focus` / `@on-blur` en lugar de los más idiomáticos `@focus` / `@blur`.
:::

## Slots

| Slot    | Descripción                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------- |
| `label` | Se renderiza dentro del `<label>`, sustituyendo el texto estático de la prop `label` (solo el texto visible: el `aria-label` del input sigue usando la prop `label`, ver arriba). Solo se renderiza cuando `hideLabel` es `false`. |
| `link`  | Se renderiza dentro del mismo `<label>`, justo tras el contenido de la etiqueta, para enlaces o acciones en línea («…los **términos del servicio**»). Solo se renderiza si se pasa. |

## Accesibilidad

- El nombre accesible del input procede siempre de `aria-label="{label}"`, con independencia de si
  el texto visible es la prop `label` o el slot `label`, e incluso cuando `hideLabel` elimina por
  completo el elemento `<label>` visible.
- El `<svg>` interno del icono decorativo lleva a la vez `role="img"` y `aria-hidden="true"`;
  `aria-hidden` prevalece en el cálculo de nombre y rol accesibles, así que el `role="img"` no tiene
  efecto práctico: el icono queda totalmente oculto a las tecnologías de asistencia en cualquier
  caso, que es el resultado buscado, ya que la etiqueta ya transmite el estado marcado.
- Cuando `validations` está definida, el `<span role="alert">` de error se enlaza al input mediante
  `aria-describedby="{id}-error"`, de modo que los lectores de pantalla lo anuncian junto al nombre
  del input. El `aria-describedby` solo está presente cuando `validations` tiene valor.
- La agrupación se apoya por completo en el atributo nativo `name` compartido entre instancias; el
  componente no renderiza ningún contenedor `<fieldset>`/`<legend>` ni `role="radiogroup"`, así que
  la etiqueta o descripción accesible a nivel de grupo es responsabilidad de quien lo consume
  (consulta el consejo anterior).
- El foco se indica visualmente con un contorno propio en `currentColor` alrededor del icono
  (mediante la clase `focused`), no solo con el anillo de foco por defecto del navegador.
