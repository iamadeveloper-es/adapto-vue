# Button

`adpt-button` es el elemento estándar de acción pulsable de Adapto UI. Admite cinco variantes
visuales, cinco tamaños, un radio de esquina configurable, un icono opcional (con modo solo
icono), estados de carga/deshabilitado y un efecto ripple integrado en la interacción.

- **Nombre del componente:** `AdaptoButton`
- **Fuente:** `src/lib/components/element/adpt-button/index.vue`
- **Estilos:** `src/lib/components/element/adpt-button/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoButton` está
disponible de forma global:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoButton label="Guardar cambios" @clicked="onSave" />
```

El texto visible también puede pasarse por el slot por defecto en lugar de con la prop `label`.
`label` se usa siempre como nombre accesible (`aria-label`), sea cual sea la vía elegida:

```vue-html
<AdaptoButton label="Guardar cambios">Guardar cambios</AdaptoButton>
```

## Variantes

La prop `variant` controla el estilo visual. Por defecto es `soft`.

<div class="demo">
  <AdaptoButton variant="outlined" color="primary-500" label="Outlined" />
  <AdaptoButton variant="fussy" color="primary-500" label="Fussy" />
  <AdaptoButton variant="soft" color="primary-500" label="Soft" />
  <AdaptoButton variant="soul" color="primary-500" label="Soul" />
  <AdaptoButton variant="link" color="primary-500" label="Link" />
</div>

```vue-html
<AdaptoButton variant="outlined" color="primary-500" label="Outlined" />
<AdaptoButton variant="fussy" color="primary-500" label="Fussy" />
<AdaptoButton variant="soft" color="primary-500" label="Soft" />
<AdaptoButton variant="soul" color="primary-500" label="Soul" />
<AdaptoButton variant="link" color="primary-500" label="Link" />
```

| Variante   | Descripción                                                                             |
| ---------- | ---------------------------------------------------------------------------------------- |
| `outlined` | Fondo transparente con un borde en `currentColor`.                                      |
| `fussy`    | Borde **y** fondo tintado (`color-mix`): la variante visualmente más prominente.         |
| `soft`     | Fondo tintado, sin borde. **Por defecto.**                                              |
| `soul`     | Fondo completamente transparente, sin borde: solo texto/icono hasta el hover.            |
| `link`     | Fondo transparente con aspecto de hipervínculo; hover y focus reducen la opacidad en lugar de mostrar el resalte del ripple. |

Todas las variantes (salvo `link`) reciben un resalte de hover/focus basado en `currentColor`, y
derivan su fondo del color de texto resuelto del botón mediante `color-mix`.

## Colores

La prop `color` acepta el nombre de un token del tema (primitivo, p. ej. `green-500`, o
semántico, p. ej. `primary-500`, `danger-700`) tal y como se expone en las custom properties CSS
que genera el tema, es decir `--adapto-<color>`. Define el color de texto del botón
(`currentColor`), que las variantes anteriores reutilizan para bordes y fondos tintados.

<div class="demo">
  <AdaptoButton variant="fussy" color="primary-500" label="Primary" />
  <AdaptoButton variant="fussy" color="secondary-500" label="Secondary" />
  <AdaptoButton variant="fussy" color="success-600" label="Success" />
  <AdaptoButton variant="fussy" color="warning-600" label="Warning" />
  <AdaptoButton variant="fussy" color="danger-600" label="Danger" />
</div>

```vue-html
<AdaptoButton variant="fussy" color="primary-500" label="Primary" />
<AdaptoButton variant="fussy" color="secondary-500" label="Secondary" />
<AdaptoButton variant="fussy" color="success-600" label="Success" />
<AdaptoButton variant="fussy" color="warning-600" label="Warning" />
<AdaptoButton variant="fussy" color="danger-600" label="Danger" />
```

::: warning Sin color
Si `color` se deja vacío (el valor por defecto), el botón cae actualmente en el color CSS
literal `red`. Pasa siempre un token explícito para obtener un resultado intencionado.
:::

## Tamaños

La prop `size` controla el padding y el tamaño de fuente. Por defecto es `xs`.

<div class="demo">
  <AdaptoButton size="xs" color="primary-500" label="XS" />
  <AdaptoButton size="sm" color="primary-500" label="SM" />
  <AdaptoButton size="md" color="primary-500" label="MD" />
  <AdaptoButton size="lg" color="primary-500" label="LG" />
  <AdaptoButton size="xl" color="primary-500" label="XL" />
</div>

```vue-html
<AdaptoButton size="xs" color="primary-500" label="XS" />
<AdaptoButton size="sm" color="primary-500" label="SM" />
<AdaptoButton size="md" color="primary-500" label="MD" />
<AdaptoButton size="lg" color="primary-500" label="LG" />
<AdaptoButton size="xl" color="primary-500" label="XL" />
```

## Radio

La prop `radius` mapea a las clases utilitarias compartidas `.rounded--*`. Por defecto es `sm`.
Usa `full` para una forma de píldora o circular (en ese caso el padding pasa a ser simétrico).

<div class="demo">
  <AdaptoButton radius="xs" color="primary-500" label="XS" />
  <AdaptoButton radius="sm" color="primary-500" label="SM" />
  <AdaptoButton radius="md" color="primary-500" label="MD" />
  <AdaptoButton radius="lg" color="primary-500" label="LG" />
  <AdaptoButton radius="xl" color="primary-500" label="XL" />
  <AdaptoButton radius="full" color="primary-500" label="Full" />
</div>

```vue-html
<AdaptoButton radius="xs" color="primary-500" label="XS" />
<AdaptoButton radius="sm" color="primary-500" label="SM" />
<AdaptoButton radius="md" color="primary-500" label="MD" />
<AdaptoButton radius="lg" color="primary-500" label="LG" />
<AdaptoButton radius="xl" color="primary-500" label="XL" />
<AdaptoButton radius="full" color="primary-500" label="Full" />
```

## Iconos

Pasa un objeto `icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`, correspondiente al
tipo `Icon` y reenviado a `AdaptoIcon`/lucide) para renderizar un icono junto a la etiqueta. Si
se omite `size`, se deriva del tamaño de fuente calculado del botón.

<div class="demo">
  <AdaptoButton color="primary-500" label="Descargar" :icon="{ name: 'download' }" />
  <AdaptoButton color="primary-500" label="Siguiente" :icon="{ name: 'arrow-right' }" icon-prepend />
</div>

```vue-html
<!-- icono renderizado antes de la etiqueta (por defecto) -->
<AdaptoButton color="primary-500" label="Descargar" :icon="{ name: 'download' }" />

<!-- iconPrepend invierte el orden y coloca el icono después de la etiqueta -->
<AdaptoButton color="primary-500" label="Siguiente" :icon="{ name: 'arrow-right' }" icon-prepend />
```

### Botón solo icono

Combina `icon` con `hideLabel` para renderizar un botón únicamente con icono. `label` sigue
siendo obligatorio en este caso: pasa a ser el nombre accesible vía `aria-label`, y el icono se
marca como `aria-hidden`.

<div class="demo">
  <AdaptoButton variant="soul" color="primary-500" label="Ajustes" :icon="{ name: 'settings' }" hide-label />
</div>

```vue-html
<AdaptoButton
  variant="soul"
  color="primary-500"
  label="Ajustes"
  :icon="{ name: 'settings' }"
  hide-label
/>
```

## Estados

<div class="demo">
  <AdaptoButton color="primary-500" label="Deshabilitado" disabled />
  <AdaptoButton color="primary-500" label="Cargando" loading />
  <AdaptoButton color="primary-500" label="Sin ripple" disable-ripple />
</div>

```vue-html
<AdaptoButton color="primary-500" label="Deshabilitado" disabled />
<AdaptoButton color="primary-500" label="Cargando" loading />
<AdaptoButton color="primary-500" label="Sin ripple" disable-ripple />
```

- **`disabled`** — activa el atributo nativo `disabled` y bloquea la emisión de `clicked`.
- **`loading`** — muestra un spinner en línea, establece `aria-busy="true"` y bloquea la emisión
  de `clicked` (sin deshabilitar visualmente el botón ni fijar `disabled`).
- **`disableRipple`** — desactiva el feedback de clic de `v-ripple` manteniendo el botón
  interactivo en todo lo demás.

### Ancho completo

<div class="demo" style="display: block;">
  <AdaptoButton color="primary-500" label="Ancho completo" full-width />
</div>

```vue-html
<AdaptoButton color="primary-500" label="Ancho completo" full-width />
```

## Props

| Prop            | Tipo                                                              | Por defecto | Descripción                                                                |
| ---------------- | ------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------- |
| `variant`         | `'outlined' \| 'fussy' \| 'soft' \| 'soul' \| 'link'`               | `'soft'`   | Estilo visual del botón.                                                     |
| `color`           | `string`                                                            | `''`       | Nombre de token del tema (p. ej. `primary-500`) resuelto a `var(--adapto-<color>)` y usado como color de texto del botón. |
| `size`            | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                              | `'xs'`     | Controla el padding y el tamaño de fuente.                                   |
| `radius`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`                    | `'sm'`     | Radio de esquina, mediante las clases utilitarias compartidas `.rounded--*`. |
| `type`            | `'button' \| 'submit' \| 'reset'`                                   | `'button'` | Atributo nativo `type` del elemento `<button>`.                             |
| `disabled`        | `boolean`                                                           | `false`    | Deshabilita el botón y bloquea la emisión de `clicked`.                     |
| `loading`         | `boolean`                                                           | `false`    | Muestra un spinner, establece `aria-busy` y bloquea la emisión de `clicked`. |
| `fullWidth`       | `boolean`                                                           | `false`    | Estira el botón hasta `width: 100%`.                                        |
| `label`           | `string`                                                            | `'Botón'`  | Texto visible (salvo que lo sobrescriba el slot por defecto) y siempre el `aria-label`. |
| `hideLabel`       | `boolean`                                                           | `false`    | Oculta el span de la etiqueta visible, produciendo un botón solo icono.     |
| `icon`            | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`)     | `undefined`| Icono renderizado vía `AdaptoIcon`. Omítelo para no renderizar ninguno.     |
| `iconPrepend`     | `boolean`                                                           | `false`    | Invierte el orden flex de icono/etiqueta: con `false` el icono va primero.  |
| `disableRipple`   | `boolean`                                                           | `false`    | Desactiva el feedback de clic de `v-ripple`.                                |

## Emits

| Evento    | Payload      | Descripción                                                        |
| --------- | ------------ | -------------------------------------------------------------------- |
| `clicked` | `MouseEvent` | Se emite al hacer clic, salvo que el botón esté `disabled` o `loading`. |

## Slots

| Slot      | Descripción                                                                 |
| --------- | ------------------------------------------------------------------------------ |
| `default` | Sobrescribe el contenido de la etiqueta visible. Por defecto usa el texto de la prop `label`. Solo se renderiza cuando `hideLabel` es `false`. |

## Accesibilidad

- El botón expone siempre `label` como su `aria-label`, con independencia de si el texto visible
  viene de la prop `label` o del slot por defecto, e incluso cuando la etiqueta está oculta
  visualmente (`hideLabel`).
- `loading` establece `aria-busy="true"` en el botón mientras la petición está en curso.
- Cuando se usa `hideLabel` junto con `icon`, el icono se marca como `aria-hidden="true"` para que
  las tecnologías de asistencia se apoyen únicamente en `aria-label`.
- Los estados de focus y hover son visibles por defecto (resalte basado en `currentColor`) en
  todas las variantes salvo `link`, que usa un cambio de opacidad en su lugar.
