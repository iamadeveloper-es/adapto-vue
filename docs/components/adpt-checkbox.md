# Checkbox

`adpt-checkbox` es una casilla de verificación etiquetada construida sobre un
`<input type="checkbox">` nativo. Admite dos formas de `v-model`: un `boolean` para una casilla
autónoma, o un array de valores para un grupo de casillas que comparten el mismo `modelValue`
(selección múltiple). Incorpora un icono SVG propio que alterna entre el trazado sin marcar y el
marcado, además de un mensaje de validación en línea opcional.

- **Nombre del componente:** `AdaptoCheckbox`
- **Fuente:** `src/lib/components/form/adpt-checkbox/index.vue`
- **Estilos:** `src/lib/components/form/adpt-checkbox/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoCheckbox` está
disponible de forma global. `name` es la única prop obligatoria; `modelValue` no lo es según la
declaración de props, pero el componente no resulta útil sin un `v-model`.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

### Casilla única (`v-model` booleano)

Cuando `modelValue` es un `boolean` sin más, la casilla ignora la prop `value` a efectos de estado
y simplemente refleja y alterna ese booleano:

<script setup>
import { ref } from 'vue'

const accepted = ref(false)
const fruits = ref(['apple'])
</script>

<div class="demo">
  <AdaptoCheckbox
    v-model="accepted"
    name="terms"
    label="Acepto los términos y condiciones"
    active-color="primary-500"
  />
  <span>modelValue: {{ accepted }}</span>
</div>

```vue-html
<AdaptoCheckbox
  v-model="accepted"
  name="terms"
  label="Acepto los términos y condiciones"
  active-color="primary-500"
/>
```

### Grupo de casillas (`v-model` de array)

Cuando varios `AdaptoCheckbox` comparten el mismo `modelValue` de tipo array y cada uno recibe un
`value` distinto, el estado marcado se deriva de `modelValue.includes(value)`, y alternar
cualquiera de ellos añade o quita su `value` del array compartido:

<div class="demo" style="flex-direction: column; align-items: flex-start;">
  <AdaptoCheckbox v-model="fruits" name="fruit" value="apple" label="Manzana" active-color="primary-500" />
  <AdaptoCheckbox v-model="fruits" name="fruit" value="banana" label="Plátano" active-color="primary-500" />
  <AdaptoCheckbox v-model="fruits" name="fruit" value="cherry" label="Cereza" active-color="primary-500" />
  <span>modelValue: {{ fruits }}</span>
</div>

```vue-html
<AdaptoCheckbox v-model="fruits" name="fruit" value="apple" label="Manzana" active-color="primary-500" />
<AdaptoCheckbox v-model="fruits" name="fruit" value="banana" label="Plátano" active-color="primary-500" />
<AdaptoCheckbox v-model="fruits" name="fruit" value="cherry" label="Cereza" active-color="primary-500" />
```

`value` acepta un `string`, `number`, `boolean` u objeto plano: la forma que tenga sentido para los
elementos del grupo. Su valor por defecto es `false`, que solo resulta razonable en el modo
booleano autónomo anterior.

## Color activo

`activeColor` es el nombre de un token del tema (p. ej. `primary-500`, `success-600`) resuelto
mediante `fw.getVar` y aplicado como `color` del icono marcado. No tiene efecto mientras la casilla
está sin marcar.

<div class="demo">
  <AdaptoCheckbox name="c1" label="Primary" model-value active-color="primary-500" />
  <AdaptoCheckbox name="c2" label="Success" model-value active-color="success-600" />
  <AdaptoCheckbox name="c3" label="Danger" model-value active-color="danger-600" />
</div>

```vue-html
<AdaptoCheckbox name="c1" label="Primary" :model-value="true" active-color="primary-500" />
<AdaptoCheckbox name="c2" label="Success" :model-value="true" active-color="success-600" />
<AdaptoCheckbox name="c3" label="Danger" :model-value="true" active-color="danger-600" />
```

## Etiqueta oculta

`hideLabel` elimina el elemento `<label>` por completo (no solo visualmente) y añade una clase
modificadora `--no-label` que suprime los márgenes circundantes. `label` sigue siendo obligatoria en
este caso, ya que pasa a ser el `aria-label` del input.

<div class="demo">
  <AdaptoCheckbox name="hidden" label="Suscribirme a la newsletter" hide-label active-color="primary-500" />
</div>

```vue-html
<AdaptoCheckbox name="hidden" label="Suscribirme a la newsletter" hide-label active-color="primary-500" />
```

## Mensaje de validación

Pasar una cadena `validations` no vacía renderiza un `span` con `role="alert"` debajo de la
casilla, enlazado al input mediante `aria-describedby`. El componente no valida nada por sí mismo:
quien lo consume decide cuándo pasar un mensaje.

<div class="demo">
  <AdaptoCheckbox
    name="required-check"
    label="Acepto la política de privacidad"
    active-color="primary-500"
    validations="Debes aceptar para continuar"
  />
</div>

```vue-html
<AdaptoCheckbox
  name="required-check"
  label="Acepto la política de privacidad"
  active-color="primary-500"
  validations="Debes aceptar para continuar"
/>
```

## Slots

El slot `label` sustituye por completo el texto estático de la etiqueta, y el slot `link` renderiza
contenido adicional (p. ej. un enlace en línea) justo después, siempre dentro del mismo `<label>`:

<div class="demo">
  <AdaptoCheckbox name="slotted" active-color="primary-500">
    <template #label>Acepto los</template>
    <template #link>
      &nbsp;<a href="#" @click.prevent>términos del servicio</a>
    </template>
  </AdaptoCheckbox>
</div>

```vue-html
<AdaptoCheckbox name="slotted" active-color="primary-500">
  <template #label>Acepto los</template>
  <template #link>
    &nbsp;<a href="#">términos del servicio</a>
  </template>
</AdaptoCheckbox>
```

## Estados

<div class="demo">
  <AdaptoCheckbox name="disabled-unchecked" label="Deshabilitada" disabled active-color="primary-500" />
  <AdaptoCheckbox name="disabled-checked" label="Deshabilitada y marcada" disabled model-value active-color="primary-500" />
</div>

```vue-html
<AdaptoCheckbox name="disabled-unchecked" label="Deshabilitada" disabled active-color="primary-500" />
<AdaptoCheckbox name="disabled-checked" label="Deshabilitada y marcada" disabled :model-value="true" active-color="primary-500" />
```

- **`disabled`** — establece el atributo nativo `disabled` en el input y añade una clase `disabled`
  a la raíz, que `style.scss` no estiliza visualmente hoy por hoy (no hay regla de atenuación ni de
  cursor más allá del render nativo que el navegador da a un input deshabilitado).
- **enfocada** — mientras el input tiene el foco, un ref interno `isFocused` añade una clase
  `focused` a la raíz; no hay ningún otro estado controlado por props.

## Props

| Prop          | Tipo                                                          | Por defecto          | Descripción                                                                                          |
| ------------- | --------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `boolean \| CheckboxItemValue[]`                                | —                     | Enlace de `v-model`. Un `boolean` controla una casilla única; un array de `CheckboxItemValue` controla un grupo de selección múltiple. |
| `disabled`    | `boolean`                                                       | `false`               | Deshabilita el input de la casilla.                                                                   |
| `value`       | `string \| number \| boolean \| Record<string, unknown>`       | `false`               | Valor asociado a esta casilla. Solo se usa para calcular el estado marcado cuando `modelValue` es un array. |
| `name`        | `string`                                                        | —                     | **Obligatoria.** Atributo nativo `name` del input, necesario para el envío del formulario.            |
| `label`       | `string`                                                        | `'Checkbox label'`    | Texto visible de la etiqueta, y siempre el `aria-label` del input. El slot `label` lo sustituye visualmente. |
| `hideLabel`   | `boolean`                                                       | `false`               | Elimina el elemento `<label>` y añade una clase modificadora `--no-label`.                            |
| `activeColor` | `string`                                                        | `'secondary-400'`     | Nombre de token del tema aplicado como color del icono marcado. Sin efecto mientras está sin marcar.  |
| `validations` | `string`                                                        | —                     | Texto del mensaje de error. Cuando se define, renderiza un `span` con `role="alert"` enlazado vía `aria-describedby`. |

`CheckboxItemValue` es `string | number | boolean | Record<string, unknown>`.

## Emits

| Evento              | Payload                          | Descripción                                              |
| -------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `update:modelValue` | `boolean \| CheckboxItemValue[]`  | Se emite cada vez que la casilla nativa cambia, vía `v-model`. |
| `onFocus`            | `FocusEvent`                       | Se emite cuando el input gana el foco.                    |
| `onBlur`             | `FocusEvent`                       | Se emite cuando el input pierde el foco.                   |

## Slots

| Slot    | Descripción                                                                    |
| ------- | ---------------------------------------------------------------------------------- |
| `label` | Se renderiza dentro del `<label>`, sustituyendo el texto estático de la prop `label`. |
| `link`  | Se renderiza dentro del `<label>`, tras el contenido de la etiqueta (normalmente para un enlace en línea). |

## Accesibilidad

- El input expone siempre `label` como su `aria-label`, tanto si el texto visible viene de la prop
  `label` como del slot `label`, e incluso cuando `hideLabel` elimina el elemento `<label>`.
- El emparejamiento `<label for>`/`id` (mediante `useId()`) asocia la etiqueta visible con el input
  cuando `hideLabel` es `false`, además del `aria-label`.
- Cuando `validations` está definida, el input recibe `aria-describedby` apuntando al id del span de
  error, y ese span lleva `role="alert"` para que las tecnologías de asistencia lo anuncien.
- El `<span>` decorativo del icono y su `<svg>` interno se marcan ambos como `aria-hidden="true"`
  (el SVG lleva además `role="img"`, redundante con `aria-hidden`), de forma que la marca visible
  nunca se anuncia por separado del estado nativo de la casilla.
- Quien construya un grupo de casillas es responsable de envolverlo en un `fieldset`/`legend` (o un
  `role="group"` con nombre accesible) si el grupo en conjunto necesita anunciarse:
  `adpt-checkbox` solo se encarga de la accesibilidad de cada input individual.
