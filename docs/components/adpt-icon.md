# Icon

`adpt-icon` es una envoltura ligera sobre [`lucide-vue-next`](https://lucide.dev/). Resuelve un
`name` de icono en kebab-case (p. ej. `arrow-right`) al componente Lucide correspondiente (p. ej.
`ArrowRight`) y reenvía tamaño, color y grosor de trazo al SVG renderizado.

- **Nombre del componente:** `AdaptoIcon`
- **Fuente:** `src/lib/components/element/adpt-icon/index.vue`

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoIcon` está
disponible de forma global:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoIcon name="star" />
```

La prop `name` va siempre en kebab-case, con independencia de cómo se llame el componente Lucide
subyacente. Internamente se divide por `-` y se capitaliza cada segmento, de modo que
`arrow-right` se convierte en `ArrowRight`, `circle-check` en `CircleCheck`, etc., coincidiendo con
los nombres exportados en `lucide-vue-next`. Si `name` no resuelve a un icono Lucide conocido, el
binding `:is` recibe `undefined` y no se renderiza nada.

<div class="demo">
  <AdaptoIcon name="star" />
  <AdaptoIcon name="arrow-right" />
  <AdaptoIcon name="circle-check" />
  <AdaptoIcon name="settings" />
</div>

```vue-html
<AdaptoIcon name="star" />
<AdaptoIcon name="arrow-right" />
<AdaptoIcon name="circle-check" />
<AdaptoIcon name="settings" />
```

## Tamaño

La prop `size` define el ancho y alto del icono en píxeles. Por defecto es `24`.

<div class="demo">
  <AdaptoIcon name="star" :size="16" />
  <AdaptoIcon name="star" :size="24" />
  <AdaptoIcon name="star" :size="32" />
  <AdaptoIcon name="star" :size="48" />
</div>

```vue-html
<AdaptoIcon name="star" :size="16" />
<AdaptoIcon name="star" :size="24" />
<AdaptoIcon name="star" :size="32" />
<AdaptoIcon name="star" :size="48" />
```

## Color

<div class="demo">
  <AdaptoIcon name="heart" color="#ef4444" />
  <AdaptoIcon name="heart" color="rebeccapurple" />
  <AdaptoIcon name="heart" color="rgb(16, 185, 129)" />
</div>

```vue-html
<AdaptoIcon name="heart" color="#ef4444" />
<AdaptoIcon name="heart" color="rebeccapurple" />
<AdaptoIcon name="heart" color="rgb(16, 185, 129)" />
```

::: warning Color CSS en crudo, no un token del tema
A diferencia de la prop `color` de `AdaptoButton` —que recibe el nombre de un token del tema (p.
ej. `primary-500`) resuelto mediante `fw.cv()` a un `var(--adapto-<color>)`—, la prop `color` de
`AdaptoIcon` se pasa tal cual al atributo `color` del `<svg>` subyacente, sin resolución de
tokens. Espera un valor de color CSS en crudo (hex, `rgb()`, una palabra clave de color CSS,
etc.). Pasar aquí un nombre de token (p. ej. `color="primary-500"`) **no** funcionará como en
`AdaptoButton`. Si se deja sin definir, el icono usa el valor por defecto de Lucide
(`currentColor`).
:::

## Grosor de trazo

La prop `strokeWidth` controla el grosor del trazo del icono. Por defecto es `2`.

<div class="demo">
  <AdaptoIcon name="star" :stroke-width="1" :size="32" />
  <AdaptoIcon name="star" :stroke-width="2" :size="32" />
  <AdaptoIcon name="star" :stroke-width="3" :size="32" />
</div>

```vue-html
<AdaptoIcon name="star" :stroke-width="1" :size="32" />
<AdaptoIcon name="star" :stroke-width="2" :size="32" />
<AdaptoIcon name="star" :stroke-width="3" :size="32" />
```

## Props

| Prop          | Tipo                | Por defecto | Descripción                                                                 |
| ------------- | ------------------- | ----------- | ----------------------------------------------------------------------------- |
| `name`        | `string` (obligatoria) | —        | Nombre del icono en kebab-case, convertido al componente Lucide equivalente en PascalCase (`arrow-right` → `ArrowRight`). |
| `size`        | `number`             | `24`        | Ancho y alto del icono en píxeles.                                           |
| `color`       | `string`             | `undefined` | Valor de color CSS en crudo (hex, `rgb()`, palabra clave, etc.) reenviado al atributo `color` del SVG. **No** es un token del tema: consulta el aviso anterior. |
| `strokeWidth` | `number`             | `2`         | Grosor del trazo del icono.                                                  |
| `defaultClass`| `string \| null`    | `null`      | Consulta la nota siguiente: hoy por hoy no tiene efecto visible.              |

::: warning `defaultClass` no es funcional actualmente
`defaultClass` se reenvía al componente Lucide renderizado como `:default-class="defaultClass"`.
Los componentes de icono de `lucide-vue-next` no declaran una prop `defaultClass`/`default-class`,
así que el fallthrough de atributos de Vue lo renderiza como un atributo literal
`default-class="..."` en el `<svg>` raíz en lugar de aplicarlo como clase CSS. En la práctica,
establecer `defaultClass` no produce ningún efecto visual. Para añadir clases propias a un
`AdaptoIcon`, usa el atributo estándar `class` (p. ej.
`<AdaptoIcon name="star" class="mi-clase" />`), que Vue fusiona automáticamente con la clase
propia del componente.
:::

## Accesibilidad

`AdaptoIcon` es un elemento hoja no interactivo y no enfocable: no tiene por sí mismo cuestiones
de gestión de foco ni de teclado.

Por defecto, los componentes de icono de Lucide se renderizan con `aria-hidden="true"` siempre que
no se reenvíe por fallthrough ningún atributo de nombre accesible (`aria-label`/`aria-labelledby`),
así que un `<AdaptoIcon>` se trata como **decorativo** salvo que indiques lo contrario. Así es como
lo usa `AdaptoButton`: los iconos dentro de un botón etiquetado permanecen `aria-hidden` y se
apoyan en el `aria-label` del propio botón.

Si necesitas usar `AdaptoIcon` como icono independiente con significado (no decorativo y no dentro
de un control ya etiquetado), aporta tú mismo un nombre accesible mediante fallthrough de
atributos:

```vue-html
<AdaptoIcon name="alert-triangle" aria-label="Advertencia" />
```

No existe una prop `label`/`decorative` dedicada para esto: es implícito, así que recuerda añadir
`aria-label` explícitamente siempre que un icono transmita significado por sí solo.
