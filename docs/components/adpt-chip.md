# Chip

`adpt-chip` renderiza una etiqueta compacta con forma de píldora. Admite cinco variantes visuales,
cinco tamaños, iconos opcionales antes y después del texto, un modo solo icono, un modo cerrable
con botón de eliminación integrado y un interruptor `clickable` que lo alterna entre control
interactivo y distintivo estático.

- **Nombre del componente:** `AdaptoChip`
- **Fuente:** `src/lib/components/element/adpt-chip/index.vue`
- **Estilos:** `src/lib/components/element/adpt-chip/style.scss` (inyectados en el primer render
  vía `useStyle`, no registrados en `AdaptoPlugin`)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoChip` está
disponible de forma global:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoChip label="Beta" color="primary-500" />
```

El chip no tiene slots: su texto visible viene siempre de la prop obligatoria `label`.

## Variantes

La prop `variant` controla el estilo visual. Por defecto es `fussy`.

<div class="demo">
  <AdaptoChip variant="outlined" color="primary-500" label="Outlined" />
  <AdaptoChip variant="fussy" color="primary-500" label="Fussy" />
  <AdaptoChip variant="soft" color="primary-500" label="Soft" />
  <AdaptoChip variant="soul" color="primary-500" label="Soul" />
  <AdaptoChip variant="link" color="primary-500" label="Link" />
</div>

```vue-html
<AdaptoChip variant="outlined" color="primary-500" label="Outlined" />
<AdaptoChip variant="fussy" color="primary-500" label="Fussy" />
<AdaptoChip variant="soft" color="primary-500" label="Soft" />
<AdaptoChip variant="soul" color="primary-500" label="Soul" />
<AdaptoChip variant="link" color="primary-500" label="Link" />
```

| Variante   | Descripción                                                                            |
| ---------- | ---------------------------------------------------------------------------------------- |
| `outlined` | Fondo transparente con un borde en `currentColor`.                                      |
| `fussy`    | Borde **y** fondo tintado (`color-mix`). **Por defecto.**                               |
| `soft`     | Fondo tintado, sin borde.                                                               |
| `soul`     | Fondo completamente transparente, sin borde.                                            |
| `link`     | Fondo transparente; hover y focus reducen la opacidad en lugar de mostrar el resalte.   |

Todas las variantes se renderizan con la utilidad compartida `.rounded--full`, así que el chip es
siempre una píldora. Todas salvo `link` reciben un resalte de hover/focus basado en
`currentColor`.

## Colores

La prop `color` acepta el nombre de un token del tema (primitivo, p. ej. `green-500`, o
semántico, p. ej. `primary-500`) tal y como se expone en las custom properties CSS que genera el
tema. Se resuelve mediante `fw.cv()` y se aplica como color de texto del chip (`currentColor`),
que las variantes anteriores reutilizan para bordes y fondos tintados.

<div class="demo">
  <AdaptoChip variant="fussy" color="primary-500" label="Primary" />
  <AdaptoChip variant="fussy" color="secondary-500" label="Secondary" />
  <AdaptoChip variant="fussy" color="success-600" label="Success" />
  <AdaptoChip variant="fussy" color="warning-600" label="Warning" />
  <AdaptoChip variant="fussy" color="danger-600" label="Danger" />
</div>

```vue-html
<AdaptoChip variant="fussy" color="primary-500" label="Primary" />
<AdaptoChip variant="fussy" color="secondary-500" label="Secondary" />
<AdaptoChip variant="fussy" color="success-600" label="Success" />
<AdaptoChip variant="fussy" color="warning-600" label="Warning" />
<AdaptoChip variant="fussy" color="danger-600" label="Danger" />
```

::: warning Sin color
Si `color` se deja vacío (el valor por defecto), el chip cae en el token `sm-surface-300` en lugar
del color que podrías esperar. Pasa siempre un token explícito para obtener un resultado
intencionado.
:::

## Tamaños

La prop `size` controla el padding y el tamaño de fuente. Por defecto es `xs`.

<div class="demo">
  <AdaptoChip size="xs" color="primary-500" label="XS" />
  <AdaptoChip size="sm" color="primary-500" label="SM" />
  <AdaptoChip size="md" color="primary-500" label="MD" />
  <AdaptoChip size="lg" color="primary-500" label="LG" />
  <AdaptoChip size="xl" color="primary-500" label="XL" />
</div>

```vue-html
<AdaptoChip size="xs" color="primary-500" label="XS" />
<AdaptoChip size="sm" color="primary-500" label="SM" />
<AdaptoChip size="md" color="primary-500" label="MD" />
<AdaptoChip size="lg" color="primary-500" label="LG" />
<AdaptoChip size="xl" color="primary-500" label="XL" />
```

## Iconos

Pasa `prependIcon` y/o `appendIcon` (cada uno un objeto `Icon` — `{ name, size?, color?,
strokeWidth?, defaultClass? }`, reenviado a `AdaptoIcon`) para renderizar un icono antes y/o
después de la etiqueta. Se pueden usar ambos a la vez. Si se omite `size`, se deriva en el montaje
del `--adapto-chip-font-size` calculado del chip (más 1px); antes del montaje cae en
`1rem + 1px`.

<div class="demo">
  <AdaptoChip color="primary-500" label="Descargar" :prepend-icon="{ name: 'download' }" />
  <AdaptoChip color="primary-500" label="Siguiente" :append-icon="{ name: 'arrow-right' }" />
  <AdaptoChip color="primary-500" label="Rango" :prepend-icon="{ name: 'calendar' }" :append-icon="{ name: 'chevron-down' }" />
</div>

```vue-html
<AdaptoChip color="primary-500" label="Descargar" :prepend-icon="{ name: 'download' }" />
<AdaptoChip color="primary-500" label="Siguiente" :append-icon="{ name: 'arrow-right' }" />
<AdaptoChip
  color="primary-500"
  label="Rango"
  :prepend-icon="{ name: 'calendar' }"
  :append-icon="{ name: 'chevron-down' }"
/>
```

### Chip solo icono

Combina un icono con `hideLabel` para ocultar el texto visible. `label` sigue siendo obligatorio:
pasa a ser el nombre accesible vía `aria-label`, y el icono se marca como `aria-hidden`.

<div class="demo">
  <AdaptoChip variant="soul" color="primary-500" label="Filtrar" :prepend-icon="{ name: 'filter' }" hide-label />
</div>

```vue-html
<AdaptoChip
  variant="soul"
  color="primary-500"
  label="Filtrar"
  :prepend-icon="{ name: 'filter' }"
  hide-label
/>
```

## Chip cerrable

Activar `closable` renderiza un botón de eliminación (un `AdaptoButton` solo icono) junto a la
etiqueta y cambia la estructura DOM del chip: la raíz pasa a ser un contenedor `role="group"` que
lleva el `aria-label`, con un `span` interno `role="button"` para la etiqueta y el comportamiento
de clic, y el botón de eliminación como hermano. El botón de eliminación **no** queda anidado
dentro del elemento pulsable, así que activarlo nunca dispara además el manejador `clicked` del
propio chip. Al pulsar el botón de eliminación se emite `closed` y el chip se desmonta.

<div class="demo">
  <AdaptoChip color="primary-500" label="Etiqueta eliminable" closable />
</div>

```vue-html
<AdaptoChip color="primary-500" label="Etiqueta eliminable" closable @closed="onRemove" />
```

## Chip pulsable

`clickable` (por defecto `true`) determina si el chip se comporta como un control interactivo:
`role="button"`, `tabindex`, `aria-disabled` y los manejadores de clic y teclado
(<kbd>Enter</kbd>/<kbd>Espacio</kbd>) que emiten `clicked`. Ponlo a `false` para renderizar un chip
estático y no interactivo (por ejemplo, una etiqueta de solo lectura).

<div class="demo">
  <AdaptoChip color="primary-500" label="Distintivo estático" :clickable="false" />
</div>

```vue-html
<AdaptoChip color="primary-500" label="Distintivo estático" :clickable="false" />
```

`clickable="false"` solo afecta al área de la etiqueta: en un chip `closable` el botón de
eliminación sigue funcionando con independencia de `clickable`, porque es un control aparte.

## Estados

<div class="demo">
  <AdaptoChip color="primary-500" label="Deshabilitado" disabled />
  <AdaptoChip color="primary-500" label="Deshabilitado y cerrable" disabled closable />
</div>

```vue-html
<AdaptoChip color="primary-500" label="Deshabilitado" disabled />
<AdaptoChip color="primary-500" label="Deshabilitado y cerrable" disabled closable />
```

- **`disabled`** — aplica el estilo `is-disabled` (opacidad reducida, cursor `not-allowed`),
  establece `tabindex="-1"` y `aria-disabled="true"` en los elementos interactivos y bloquea la
  emisión de `clicked`. Por sí solo **no** desactiva el manejo de clic del botón de eliminación:
  ese botón es un `AdaptoButton` anidado que también recibe `disabled`, así que queda deshabilitado
  igualmente.

## Props

| Prop          | Tipo                                                          | Por defecto      | Descripción                                                                 |
| ------------- | ---------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------- |
| `label`       | `string` (obligatoria)                                            | —                 | Texto del chip. Se usa siempre como `aria-label` cuando `hideLabel` es `true`. |
| `disabled`    | `boolean`                                                          | `false`           | Desactiva la interacción de clic y teclado y aplica el estilo `is-disabled`. |
| `color`       | `string`                                                           | `''`              | Token del tema resuelto vía `fw.cv()`. Cae en `sm-surface-300` si está vacío. |
| `variant`     | `'outlined' \| 'fussy' \| 'soft' \| 'soul' \| 'link'`               | `'fussy'`         | Estilo visual del chip.                                                      |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                              | `'xs'`            | Controla el padding y el tamaño de fuente.                                   |
| `prependIcon` | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`)    | `undefined`       | Icono renderizado antes de la etiqueta.                                      |
| `appendIcon`  | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`)    | `undefined`       | Icono renderizado después de la etiqueta.                                    |
| `hideLabel`   | `boolean`                                                          | `false`           | Oculta la etiqueta visible; sigue expuesta vía `aria-label`.                |
| `closable`    | `boolean`                                                          | `false`           | Renderiza un botón de eliminación y cambia a la estructura DOM con contenedor de grupo. |
| `clickable`   | `boolean`                                                          | `true`            | Habilita la interacción de clic y teclado y el `role="button"` en el área de la etiqueta. |

::: tip
El tipo de `size` es el alias compartido `Size` (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`), pero la prop
en sí se declara como un `String` plano en tiempo de ejecución: TypeScript impone los valores
literales en el punto de uso, no en el componente.
:::

## Emits

| Evento    | Payload                       | Descripción                                                                 |
| -------- | -------------------------------- | ------------------------------------------------------------------------------ |
| `clicked` | `MouseEvent \| KeyboardEvent`   | Se emite al hacer clic o pulsar Enter/Espacio, salvo que `disabled` esté activo o `clickable` sea `false`. |
| `closed`  | `MouseEvent`                    | Se emite al activar el botón de eliminación (`closable`). Ese botón es un `<button>` nativo vía `AdaptoButton`, así que también se dispara con Enter/Espacio. |

## Slots

`adpt-chip` no tiene slots. La etiqueta solo puede establecerse mediante la prop `label`.

## Accesibilidad

- **Chip no cerrable** — el `<span>` raíz recibe `role="button"` cuando `clickable` es `true`,
  `tabindex="0"` (o `-1` cuando está `disabled`) y `aria-disabled` reflejando la prop `disabled`.
  Cuando `clickable` es `false` no se renderiza ninguno de esos atributos y el chip queda fuera
  del orden de tabulación.
- **Chip cerrable** — el `<span>` raíz pasa a `role="group"` con `aria-label="label"` (siempre
  presente, con independencia de `hideLabel`); el `<span>` de contenido interno repite el mismo
  patrón de `role`/`tabindex`/`aria-disabled` que el chip no cerrable, separado del botón de
  eliminación para que los dos controles nunca compitan por el mismo clic.
- `hideLabel` establece `aria-label="label"` en el elemento interactivo para que las tecnologías
  de asistencia sigan anunciando el texto aunque no se renderice visualmente.
- Los iconos de inicio y fin se marcan siempre como `aria-hidden="true"`.
- Cuando se cierra un chip que tenía el foco, el foco pasa al siguiente elemento hermano en el DOM
  (si existe), de modo que quien navega con teclado no acaba de vuelta en el `body` del documento.
