# Textarea

`adpt-textarea` es un campo de texto multilínea etiquetado, que comparte las mismas variantes
visuales, el mecanismo de etiqueta flotante y el botón opcional de limpiar de
[`AdaptoInputField`](./adpt-input-field), pero construido sobre un `<textarea>` nativo en lugar de
un `<input>` (sin manejo de `type` ni de contraseñas).

- **Nombre del componente:** `AdaptoTextarea`
- **Fuente:** `src/lib/components/form/adpt-textarea/index.vue`
- **Estilos:** `src/lib/components/form/adpt-textarea/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoTextarea` está
disponible de forma global. `name`, `label` y `modelValue` son props obligatorias.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo">
  <AdaptoTextarea
    name="message"
    label="Mensaje"
    model-value=""
    placeholder="Escribe tu mensaje..."
    color="primary-600"
  />
</div>

```vue-html
<AdaptoTextarea
  v-model="message"
  name="message"
  label="Mensaje"
  placeholder="Escribe tu mensaje..."
  color="primary-600"
/>
```

## Variantes

La prop `variant` controla el estilo de fondo y borde del campo. Por defecto es `underlined`.

<div class="demo">
  <AdaptoTextarea name="v1" label="Outlined" model-value="" variant="outlined" color="primary-600" />
  <AdaptoTextarea name="v2" label="Fussy" model-value="" variant="fussy" color="primary-600" />
  <AdaptoTextarea name="v3" label="Soft" model-value="" variant="soft" color="primary-600" />
  <AdaptoTextarea name="v4" label="Underlined" model-value="" variant="underlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="v1" label="Outlined" variant="outlined" color="primary-600" />
<AdaptoTextarea name="v2" label="Fussy" variant="fussy" color="primary-600" />
<AdaptoTextarea name="v3" label="Soft" variant="soft" color="primary-600" />
<AdaptoTextarea name="v4" label="Underlined" variant="underlined" color="primary-600" />
```

| Variante     | Descripción                                                        |
| ------------ | ----------------------------------------------------------------------- |
| `outlined`   | Fondo transparente con un borde en `currentColor`.                 |
| `fussy`      | Borde en `currentColor` **y** fondo tintado (`color-mix`).         |
| `soft`       | Fondo tintado (`color-mix`), sin borde.                            |
| `underlined` | Solo borde inferior, con fondo ligeramente tintado. **Por defecto.** |

## Variantes de etiqueta

`labelVariant` controla cómo se comporta la etiqueta respecto al campo: `'float'` la flota sobre el
textarea y la anima hacia arriba al enfocarlo o cuando tiene contenido; `'outlined'` se comporta de
forma similar con una «muesca» de fondo recortada en el borde. Por defecto es **`'float'`**.

<div class="demo">
  <AdaptoTextarea name="lv1" label="Flotante (por defecto)" model-value="" variant="outlined" color="primary-600" />
  <AdaptoTextarea name="lv2" label="Muesca perfilada" model-value="" variant="outlined" label-variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="lv1" label="Flotante (por defecto)" variant="outlined" color="primary-600" />
<AdaptoTextarea name="lv2" label="Muesca perfilada" variant="outlined" label-variant="outlined" color="primary-600" />
```

::: warning El valor por defecto difiere de `adpt-input-field`
El `labelVariant` de `AdaptoTextarea` es `'float'` por defecto. La prop equivalente en
[`AdaptoInputField`](./adpt-input-field) es `''` por defecto (etiqueta estática). Mismo nombre de
prop, mismo tipo, distinto valor por defecto: no des por hecho que coinciden entre ambos
componentes.
:::

`hideLabel` oculta visualmente la etiqueta (mediante una clase utilitaria solo para lectores de
pantalla) manteniéndola en el árbol de accesibilidad.

## Colores

`color` acepta el nombre de un token del tema (p. ej. `primary-600`, `danger-700`) resuelto a
`var(--fw-<color>)`. Por defecto es **`'primary-600'`** (a diferencia del `'danger-500'` que
`AdaptoInputField` usa para la prop idéntica).

<div class="demo">
  <AdaptoTextarea name="c1" label="Primary (por defecto)" model-value="" variant="outlined" />
  <AdaptoTextarea name="c2" label="Success" model-value="" variant="outlined" color="success-600" />
  <AdaptoTextarea name="c3" label="Danger" model-value="" variant="outlined" color="danger-600" />
</div>

```vue-html
<AdaptoTextarea name="c1" label="Primary (por defecto)" variant="outlined" />
<AdaptoTextarea name="c2" label="Success" variant="outlined" color="success-600" />
<AdaptoTextarea name="c3" label="Danger" variant="outlined" color="danger-600" />
```

## Filas

La prop `rows` mapea directamente al atributo nativo `<textarea rows>`. Por defecto es `4`.

<div class="demo">
  <AdaptoTextarea name="r1" label="2 filas" model-value="" rows="2" variant="outlined" color="primary-600" />
  <AdaptoTextarea name="r2" label="6 filas" model-value="" rows="6" variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="r1" label="2 filas" rows="2" variant="outlined" color="primary-600" />
<AdaptoTextarea name="r2" label="6 filas" rows="6" variant="outlined" color="primary-600" />
```

::: tip Redimensionable en vertical
La hoja de estilos del componente aplica `resize: vertical` al `<textarea>`, así que se puede
arrastrar para hacerlo más alto (no más ancho), algo útil para personas con baja visión que
necesitan ver más texto a la vez.
:::

## Botón de limpiar

Cuando el campo tiene contenido (`modelValue.length > 0`), es `clearable` (por defecto `true`) y no
está `disabled`, se renderiza dentro del campo un botón de icono para limpiar (`AdaptoButton`,
`variant="link"`, icono `{ name: 'x' }` por defecto vía `trailingIcon`). Al pulsarlo se emite
`update:modelValue` con `''`. A diferencia de `AdaptoInputField`, no hay comportamiento de
alternado de contraseña: el botón siempre limpia.

<div class="demo">
  <AdaptoTextarea name="clear-demo" label="Limpiable" model-value="Algo de texto existente" variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="clear-demo" label="Limpiable" model-value="Algo de texto existente" variant="outlined" color="primary-600" />
```

## Estados

<div class="demo">
  <AdaptoTextarea name="s1" label="Deshabilitado" model-value="No se puede tocar" disabled variant="outlined" color="primary-600" />
  <AdaptoTextarea name="s2" label="Solo lectura" model-value="Valor de solo lectura" readonly variant="outlined" color="primary-600" />
  <AdaptoTextarea name="s3" label="Obligatorio" model-value="" required variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoTextarea name="s1" label="Deshabilitado" disabled variant="outlined" color="primary-600" />
<AdaptoTextarea name="s2" label="Solo lectura" readonly variant="outlined" color="primary-600" />
<AdaptoTextarea name="s3" label="Obligatorio" required variant="outlined" color="primary-600" />
```

- **`disabled`** — establece el atributo nativo `disabled` y oculta el botón final de limpiar.
- **`readonly`** — establece el atributo nativo `readonly`; el botón final de limpiar sigue
  visible.
- **`required`** — establece el atributo nativo `required`; no hay ningún mensaje de error
  accesible cableado (consulta [Accesibilidad](#accesibilidad)).
- `maxlength` se reenvía al atributo nativo `maxlength`.

## Props

| Prop             | Tipo                                                        | Por defecto     | Descripción                                                                                     |
| ---------------- | ------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `modelValue`     | `string` (obligatoria)                                         | —               | Valor enlazado (`v-model`).                                                                      |
| `name`           | `string` (obligatoria)                                         | —               | Atributo nativo `name`.                                                                          |
| `label`          | `string` (obligatoria)                                         | —               | Texto de la etiqueta, asociada al campo vía `<label for>`. Siempre presente en el árbol de accesibilidad, incluso cuando `hideLabel` la oculta visualmente. |
| `placeholder`    | `string`                                                        | `undefined`     | `placeholder` nativo.                                                                            |
| `disabled`       | `boolean`                                                       | `false`         | Deshabilita el campo y oculta el botón final de limpiar.                                        |
| `required`       | `boolean`                                                       | `false`         | Establece el atributo nativo `required`.                                                         |
| `readonly`       | `boolean`                                                       | `false`         | Establece el atributo nativo `readonly`.                                                         |
| `maxlength`      | `number`                                                        | `undefined`     | Reenviado al atributo nativo `maxlength`.                                                        |
| `rows`           | `number`                                                        | `4`             | Reenviado al atributo nativo `rows`.                                                             |
| `color`          | `string`                                                        | `'primary-600'` | Nombre de token del tema resuelto a `var(--fw-<color>)`, aplicado al color de la etiqueta y del texto. |
| `variant`        | `'outlined' \| 'fussy' \| 'soft' \| 'underlined'`               | `'underlined'`  | Estilo visual del campo.                                                                         |
| `hideLabel`      | `boolean`                                                       | `false`         | Oculta visualmente la etiqueta (solo para lectores de pantalla), manteniéndola en el árbol de accesibilidad. |
| `labelVariant`   | `'float' \| 'outlined'`                                         | `'float'`       | Comportamiento de posicionamiento de la etiqueta.                                                |
| `clearable`      | `boolean`                                                       | `true`          | Muestra el botón final de limpiar cuando el campo tiene contenido.                              |
| `trailingIcon`   | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`) | `{ name: 'x' }` | Icono del botón de limpiar.                                                                      |

`min`/`max` también se declaraban aquí antes, copiadas de `AdaptoInputField`, pero `<textarea>` no
tiene atributos nativos `min`/`max`: no producían ningún efecto y se han eliminado de la API
pública del componente. Usa `maxlength` para limitar la longitud de la entrada.

## Emits

| Evento             | Payload      | Descripción                                                                 |
| ------------------ | ------------ | ---------------------------------------------------------------------------- |
| `update:modelValue`| `string`     | Se emite en cada evento nativo `input`, y cuando el campo se limpia con el botón final. |
| `onFocus`          | `FocusEvent` | Se emite en el `focus` nativo. Escúchalo con `@on-focus`, no con `@focus`: consulta la nota siguiente. |
| `onBlur`           | `FocusEvent` | Se emite en el `blur` nativo. Escúchalo con `@on-blur`, no con `@blur`.      |

::: warning Nombres de emits no estándar
`onFocus`/`onBlur` no siguen la convención de «kebab-case simple, cosa que ha ocurrido» usada en el
resto de la librería (compara con el `clicked` de `AdaptoButton`). Como Vue trata de forma especial
los nombres de prop/emit con forma `onXxx`, quien consume el componente debe escuchar con
`@on-focus` / `@on-blur` en lugar de los más idiomáticos `@focus` / `@blur`.
:::

## Slots

`AdaptoTextarea` no declara slots; todo el contenido se controla mediante props.

## Accesibilidad

- El nombre accesible procede de la asociación nativa `<label for>`: no se aplica ningún
  `aria-label` ni `aria-labelledby` sobre el `<textarea>`, así que no puede desincronizarse del
  texto visible de la etiqueta.
- El botón final de limpiar es un `AdaptoButton` con `hide-label` y `label="Limpiar campo"`, de
  modo que quien usa un lector de pantalla oye un nombre descriptivo en lugar de uno genérico.
- No hay ningún mecanismo accesible de mensajes de error cableado (p. ej. `aria-invalid` +
  `aria-describedby` apuntando a un mensaje), pese a que el componente admite `required`/`maxlength`.
  Si necesitas mensajes de validación, tendrás que construirlos tú alrededor de este componente.
- El campo es redimensionable en vertical (`resize: vertical`), lo que ayuda a las personas con baja
  visión a ver más texto a la vez.
