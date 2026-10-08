# Input Field

`adpt-input-field` es un campo de texto etiquetado con cuatro variantes visuales, un modo de
etiqueta flotante/perfilada, un botón opcional para limpiar el contenido y un alternador de
visibilidad integrado para campos `type="password"`.

- **Nombre del componente:** `AdaptoInputField`
- **Fuente:** `src/lib/components/form/adpt-input-field/index.vue`
- **Estilos:** `src/lib/components/form/adpt-input-field/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoInputField`
está disponible de forma global. `name`, `label` y `modelValue` son props obligatorias.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo">
  <AdaptoInputField
    name="email"
    label="Correo electrónico"
    model-value=""
    placeholder="tu@ejemplo.com"
    color="primary-600"
  />
</div>

```vue-html
<AdaptoInputField
  v-model="email"
  name="email"
  label="Correo electrónico"
  placeholder="tu@ejemplo.com"
  color="primary-600"
/>
```

## Variantes

La prop `variant` controla el estilo de fondo y borde del campo. Por defecto es `underlined`.

<div class="demo">
  <AdaptoInputField name="v1" label="Outlined" model-value="" variant="outlined" color="primary-600" />
  <AdaptoInputField name="v2" label="Fussy" model-value="" variant="fussy" color="primary-600" />
  <AdaptoInputField name="v3" label="Soft" model-value="" variant="soft" color="primary-600" />
  <AdaptoInputField name="v4" label="Underlined" model-value="" variant="underlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="v1" label="Outlined" variant="outlined" color="primary-600" />
<AdaptoInputField name="v2" label="Fussy" variant="fussy" color="primary-600" />
<AdaptoInputField name="v3" label="Soft" variant="soft" color="primary-600" />
<AdaptoInputField name="v4" label="Underlined" variant="underlined" color="primary-600" />
```

| Variante     | Descripción                                                        |
| ------------ | ----------------------------------------------------------------------- |
| `outlined`   | Fondo transparente con un borde en `currentColor`.                 |
| `fussy`      | Borde en `currentColor` **y** fondo tintado (`color-mix`).         |
| `soft`       | Fondo tintado (`color-mix`), sin borde.                            |
| `underlined` | Solo borde inferior, con fondo ligeramente tintado. **Por defecto.** |

Cualquier valor fuera de estos cuatro cae internamente en el estilo `outlined` (ojo: ese respaldo
no lo impone el `validator` de la prop, que sigue admitiendo solo los cuatro valores listados).

## Variantes de etiqueta

`labelVariant` controla cómo se comporta la etiqueta respecto al campo: `'float'` la flota sobre el
campo y la anima hacia arriba al enfocarlo o cuando tiene contenido; `'outlined'` se comporta de
forma similar pero con una «muesca» de fondo recortada en el borde. Por defecto es `''` (una
etiqueta estática sobre el campo, sin flotación ni muesca).

<div class="demo">
  <AdaptoInputField name="lv1" label="Estática (por defecto)" model-value="" variant="outlined" color="primary-600" />
  <AdaptoInputField name="lv2" label="Flotante" model-value="" variant="outlined" label-variant="float" color="primary-600" />
  <AdaptoInputField name="lv3" label="Muesca perfilada" model-value="" variant="outlined" label-variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="lv1" label="Estática (por defecto)" variant="outlined" color="primary-600" />
<AdaptoInputField name="lv2" label="Flotante" variant="outlined" label-variant="float" color="primary-600" />
<AdaptoInputField name="lv3" label="Muesca perfilada" variant="outlined" label-variant="outlined" color="primary-600" />
```

::: warning El valor por defecto difiere de `adpt-textarea`
El `labelVariant` de `AdaptoInputField` es `''` por defecto (etiqueta estática). La prop
equivalente en [`AdaptoTextarea`](./adpt-textarea) tiene `'float'` por defecto. Mismo nombre de
prop, mismo tipo, distinto valor por defecto: no des por hecho que coinciden entre ambos
componentes.
:::

`hideLabel` oculta visualmente la etiqueta (mediante una clase utilitaria solo para lectores de
pantalla) manteniéndola en el árbol de accesibilidad.

## Colores

`color` acepta el nombre de un token del tema (p. ej. `primary-600`, `danger-700`) resuelto a
`var(--fw-<color>)`. Se aplica al color de la etiqueta y al del texto del campo.

<div class="demo">
  <AdaptoInputField name="c1" label="Danger (por defecto)" model-value="" variant="outlined" />
  <AdaptoInputField name="c2" label="Primary" model-value="" variant="outlined" color="primary-600" />
  <AdaptoInputField name="c3" label="Success" model-value="" variant="outlined" color="success-600" />
</div>

```vue-html
<AdaptoInputField name="c1" label="Danger (por defecto)" variant="outlined" />
<AdaptoInputField name="c2" label="Primary" variant="outlined" color="primary-600" />
<AdaptoInputField name="c3" label="Success" variant="outlined" color="success-600" />
```

::: warning El color por defecto es `danger-500`
A diferencia de [`AdaptoTextarea`](./adpt-textarea) (cuyo valor análogo por defecto es
`primary-600`), la prop `color` de `AdaptoInputField` es `'danger-500'` por defecto: un color
semántico de «error» usado como estilo por defecto de un campo corriente sin error. Se recomienda
pasar un `color` explícito para cualquier cosa que no sea un campo con estilo de error
intencionado.
:::

## Botón de limpiar y alternador de contraseña

Cuando el campo tiene contenido (`modelValue.length > 0`), es `clearable` (por defecto `true`) y no
está `disabled`, se renderiza dentro del campo un botón de icono al final (`AdaptoButton`,
`variant="link"`):

- Para cualquier `type` distinto de `password`, al pulsarlo se limpia el campo (emite
  `update:modelValue` con `''`).
- Para `type="password"`, al pulsarlo **alterna la visibilidad de la contraseña** en lugar de
  limpiar: cambia el `type` del `<input>` nativo entre `password` y `text`. La misma prop
  `clearable` decide si ese botón se muestra siquiera, así que poner `clearable="false"` en un
  campo de contraseña elimina la única forma de revelarla; no hay una prop aparte para mantener el
  alternador de revelado desactivando el limpiado.

<div class="demo">
  <AdaptoInputField name="clear-demo" label="Texto limpiable" model-value="Algo de texto" variant="outlined" color="primary-600" />
  <AdaptoInputField name="pw-demo" type="password" label="Contraseña" model-value="secret123" variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="clear-demo" label="Texto limpiable" model-value="Algo de texto" variant="outlined" color="primary-600" />
<AdaptoInputField name="pw-demo" type="password" label="Contraseña" model-value="secret123" variant="outlined" color="primary-600" />
```

El icono final es `{ name: 'x' }` por defecto (prop `trailingIcon`). Existe una prop
`onTrailingIcon` para sustituirlo por otro icono una vez activado el alternador de contraseña, pero
su valor por defecto es un objeto vacío (`{}`); si no se pasa `onTrailingIcon`, el botón sigue
mostrando el icono `x` incluso tras alternar la contraseña a «visible»: sigue funcionando (pulsarlo
alterna la visibilidad), simplemente no cambia de icono de serie.

::: tip Define `onTrailingIcon` para un alternador de contraseña visualmente correcto
```vue-html
<AdaptoInputField
  name="pw"
  type="password"
  label="Contraseña"
  v-model="password"
  trailing-icon="{ name: 'eye-off' }"
  :on-trailing-icon="{ name: 'eye' }"
/>
```
:::

## Estados

<div class="demo">
  <AdaptoInputField name="s1" label="Deshabilitado" model-value="No se puede tocar" disabled variant="outlined" color="primary-600" />
  <AdaptoInputField name="s2" label="Solo lectura" model-value="Valor de solo lectura" readonly variant="outlined" color="primary-600" />
  <AdaptoInputField name="s3" label="Obligatorio" model-value="" required variant="outlined" color="primary-600" />
</div>

```vue-html
<AdaptoInputField name="s1" label="Deshabilitado" disabled variant="outlined" color="primary-600" />
<AdaptoInputField name="s2" label="Solo lectura" readonly variant="outlined" color="primary-600" />
<AdaptoInputField name="s3" label="Obligatorio" required variant="outlined" color="primary-600" />
```

- **`disabled`** — establece el atributo nativo `disabled` y oculta el botón de icono final.
- **`readonly`** — establece el atributo nativo `readonly`; el botón de icono final sigue visible.
- **`required`** — establece el atributo nativo `required`; no hay ningún mensaje de error
  accesible cableado (consulta [Accesibilidad](#accesibilidad)).
- `min` / `max` / `maxlength` se reenvían tal cual al `<input>` nativo (`min`/`max` solo tienen
  efecto en el navegador para `type`s numéricos o de fecha).

## Props

| Prop             | Tipo                                                        | Por defecto    | Descripción                                                                                     |
| ---------------- | ------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `modelValue`     | `string` (obligatoria)                                         | —              | Valor enlazado (`v-model`).                                                                      |
| `type`           | `string`                                                       | `'text'`       | `type` nativo del `<input>`. Los cambios reactivos de `type` en tiempo de ejecución se respetan. |
| `name`           | `string` (obligatoria)                                         | —              | Atributo nativo `name`.                                                                          |
| `label`          | `string` (obligatoria)                                         | —              | Texto de la etiqueta, asociada al campo vía `<label for>`. Siempre presente en el árbol de accesibilidad, incluso cuando `hideLabel` la oculta visualmente. |
| `placeholder`    | `string`                                                        | `undefined`    | `placeholder` nativo.                                                                            |
| `disabled`       | `boolean`                                                       | `false`        | Deshabilita el campo y oculta el botón de icono final.                                          |
| `required`       | `boolean`                                                       | `false`        | Establece el atributo nativo `required`.                                                         |
| `readonly`       | `boolean`                                                       | `false`        | Establece el atributo nativo `readonly`.                                                         |
| `min`            | `number`                                                        | `undefined`    | Reenviado al atributo nativo `min`.                                                              |
| `max`            | `number`                                                        | `undefined`    | Reenviado al atributo nativo `max`.                                                              |
| `maxlength`      | `number`                                                        | `undefined`    | Reenviado al atributo nativo `maxlength`.                                                        |
| `color`          | `string`                                                        | `'danger-500'` | Nombre de token del tema resuelto a `var(--fw-<color>)`, aplicado al color de la etiqueta y del texto. |
| `variant`        | `'outlined' \| 'fussy' \| 'soft' \| 'underlined'`               | `'underlined'` | Estilo visual del campo.                                                                         |
| `hideLabel`      | `boolean`                                                       | `false`        | Oculta visualmente la etiqueta (solo para lectores de pantalla), manteniéndola en el árbol de accesibilidad. |
| `labelVariant`   | `'float' \| 'outlined' \| ''`                                   | `''`           | Comportamiento de posicionamiento de la etiqueta. La cadena vacía renderiza una etiqueta estática, sin flotación ni muesca. |
| `clearable`      | `boolean`                                                       | `true`         | Muestra el botón final de limpiar/alternar cuando el campo tiene contenido. En campos de contraseña, decide además si aparece el alternador de revelado (ver arriba). |
| `trailingIcon`   | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`) | `{ name: 'x' }` | Icono del botón final en su estado por defecto.                                                 |
| `onTrailingIcon` | `Icon`                                                          | `{}`           | Icono alternativo mostrado tras activar el revelado de contraseña. Vacío por defecto: consulta el consejo anterior. |

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

`AdaptoInputField` no declara slots; todo el contenido se controla mediante props.

## Accesibilidad

- El nombre accesible procede de la asociación nativa `<label for>`: no se aplica ningún
  `aria-label` ni `aria-labelledby` sobre el `<input>`, así que no puede desincronizarse del texto
  visible de la etiqueta.
- El botón final de limpiar/alternar es un `AdaptoButton` con `hide-label`, y recibe un `label`
  descriptivo que refleja su acción y estado actuales («Limpiar campo» al limpiar, «Mostrar
  contraseña» / «Ocultar contraseña» en el alternador según el estado de visibilidad): quien usa un
  lector de pantalla oye lo que el botón hace realmente, no un nombre genérico.
- No hay ningún mecanismo accesible de mensajes de error cableado (p. ej. `aria-invalid` +
  `aria-describedby` apuntando a un mensaje), pese a que el componente admite
  `required`/`min`/`max`/`maxlength`. Si necesitas mensajes de validación, tendrás que construirlos
  tú alrededor de este componente.
