# Accordion

`adpt-accordion` es un panel de contenido plegable con cabecera pulsable. Admite cuatro variantes
visuales, cinco tamaños, un icono de chevron opcional (presente por defecto) que rota al abrirse y
una transición animada de altura y opacidad. Funciona de forma autónoma, controlado mediante
`v-model`, o como hijo de [`adpt-accordion-list`](./adpt-accordion-list), que coordina la apertura
mutuamente excluyente dentro de un grupo de acordeones.

- **Nombre del componente:** `AdaptoAccordion`
- **Fuente:** `src/lib/components/element/adpt-accordion/index.vue`
- **Estilos:** `src/lib/components/element/adpt-accordion/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoAccordion`
está disponible de forma global:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

### Autónomo, con `v-model`

Fuera de un `adpt-accordion-list`, el estado abierto/cerrado lo controla por completo la prop
`modelValue`: el componente emite `update:modelValue` al hacer clic en la cabecera en lugar de
gestionar ningún estado interno:

<script setup>
import { ref } from 'vue'

const standaloneOpen = ref(false)
</script>

<div class="demo">
  <AdaptoAccordion
    v-model="standaloneOpen"
    color="primary-500"
    title="Haz clic para alternar"
  >
    <p>El estado de apertura de este panel está enlazado a un <code>ref</code> local vía <code>v-model</code>.</p>
  </AdaptoAccordion>
  <span>modelValue: {{ standaloneOpen }}</span>
</div>

```vue-html
<AdaptoAccordion v-model="isOpen" color="primary-500" title="Haz clic para alternar">
  <p>Contenido del panel.</p>
</AdaptoAccordion>
```

```ts
import { ref } from 'vue'

const isOpen = ref(false)
```

### Dentro de `adpt-accordion-list`

Cuando un `AdaptoAccordion` se anida dentro de un `AdaptoAccordionList`, inyecta el contexto de esa
lista y le delega por completo: lee su estado de apertura del ref interno `opened` de la lista
(comparándolo con su propio id autogenerado) y llama al método `toggle(id)` de la lista al hacer
clic. En este modo la prop `modelValue` y el emit `update:modelValue` se **ignoran**: abrir un
elemento cierra cualquier otro que estuviera abierto, ya que la lista solo guarda un id abierto
cada vez.

<div class="demo">
  <AdaptoAccordionList>
    <AdaptoAccordion color="primary-500" title="Primer elemento">
      <p>Solo uno de estos tres elementos puede estar abierto a la vez.</p>
    </AdaptoAccordion>
    <AdaptoAccordion color="primary-500" title="Segundo elemento">
      <p>Abrir este cierra el primero.</p>
    </AdaptoAccordion>
    <AdaptoAccordion color="primary-500" title="Tercer elemento">
      <p>Y abrir este cierra el que estuviera abierto antes.</p>
    </AdaptoAccordion>
  </AdaptoAccordionList>
</div>

```vue-html
<AdaptoAccordionList>
  <AdaptoAccordion color="primary-500" title="Primer elemento">
    <p>Solo uno de estos tres elementos puede estar abierto a la vez.</p>
  </AdaptoAccordion>
  <AdaptoAccordion color="primary-500" title="Segundo elemento">
    <p>Abrir este cierra el primero.</p>
  </AdaptoAccordion>
  <AdaptoAccordion color="primary-500" title="Tercer elemento">
    <p>Y abrir este cierra el que estuviera abierto antes.</p>
  </AdaptoAccordion>
</AdaptoAccordionList>
```

## Variantes

La prop `variant` controla el estilo de borde y fondo. Por defecto es `fussy`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion variant="outlined" color="primary-500" title="Outlined">
    <p>Fondo transparente con borde en <code>currentColor</code>.</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="fussy" color="primary-500" title="Fussy (por defecto)">
    <p>Borde y fondo tintado (<code>color-mix</code>).</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="soft" color="primary-500" title="Soft">
    <p>Fondo tintado, sin borde.</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="default" color="primary-500" title="Default">
    <p>Usa los tokens del tema <code>--fw-accordion-border-*</code> y <code>--fw-accordion-bg</code>.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion variant="outlined" color="primary-500" title="Outlined">...</AdaptoAccordion>
<AdaptoAccordion variant="fussy" color="primary-500" title="Fussy (por defecto)">...</AdaptoAccordion>
<AdaptoAccordion variant="soft" color="primary-500" title="Soft">...</AdaptoAccordion>
<AdaptoAccordion variant="default" color="primary-500" title="Default">...</AdaptoAccordion>
```

| Variante   | Descripción                                                                    |
| ---------- | ------------------------------------------------------------------------------- |
| `outlined` | Fondo transparente, borde `thin solid currentColor`.                            |
| `fussy`    | Borde **y** fondo tintado (`color-mix`). **Por defecto.**                       |
| `soft`     | Fondo tintado, sin borde.                                                       |
| `default`  | Usa los tokens del tema `--fw-accordion-border-*` / `--fw-accordion-bg` en lugar de un estilo derivado de `currentColor`. También se aplica a cualquier valor de `variant` no reconocido. |

## Colores

La prop `color` acepta el nombre de un token del tema (p. ej. `primary-500`), resuelto mediante
`fw.cv()` y aplicado como estilo inline `color` del acordeón, que las variantes anteriores
reutilizan vía `currentColor` para bordes y fondos tintados.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion variant="fussy" color="primary-500" title="Primary">
    <p>Contenido.</p>
  </AdaptoAccordion>
  <AdaptoAccordion variant="fussy" color="danger-600" title="Danger">
    <p>Contenido.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion variant="fussy" color="primary-500" title="Primary">...</AdaptoAccordion>
<AdaptoAccordion variant="fussy" color="danger-600" title="Danger">...</AdaptoAccordion>
```

::: tip Sin color
A diferencia de `adpt-button` (que cae en el literal `red`), dejar `color` vacío aquí resuelve al
token del tema `surface-700`: `getColor` es `props.color ? fw.cv(props.color) :
fw.cv('surface-700')`.
:::

## Tamaños

La prop `size` controla el padding y el tamaño de fuente de la cabecera mediante una clase
modificadora `--*`. Por defecto es `xs`.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion size="xs" color="primary-500" title="XS">
    <p>Contenido.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="sm" color="primary-500" title="SM">
    <p>Contenido.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="md" color="primary-500" title="MD">
    <p>Contenido.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="lg" color="primary-500" title="LG">
    <p>Contenido.</p>
  </AdaptoAccordion>
  <AdaptoAccordion size="xl" color="primary-500" title="XL">
    <p>Contenido.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion size="xs" color="primary-500" title="XS">...</AdaptoAccordion>
<AdaptoAccordion size="sm" color="primary-500" title="SM">...</AdaptoAccordion>
<AdaptoAccordion size="md" color="primary-500" title="MD">...</AdaptoAccordion>
<AdaptoAccordion size="lg" color="primary-500" title="LG">...</AdaptoAccordion>
<AdaptoAccordion size="xl" color="primary-500" title="XL">...</AdaptoAccordion>
```

::: warning La prop `radius` no tiene efecto
`radius` está declarada, tipada y con `'sm'` por defecto, pero nunca se lee en el template ni se
aplica a ninguna clase o estilo: pasar cualquier valor no cambia nada visualmente hoy por hoy.
Trátala como inoperante hasta que se conecte en el componente.
:::

## Icono

La cabecera renderiza un icono (por defecto `{ name: 'chevron-down' }`) que rota 180° cuando el
elemento está abierto. Si se omite `icon.size`, se calcula en el montaje a partir de la variable
CSS `--fw-accordion-title-font-size` (`remToPx(fontSize) + 2`). Pasa un objeto `icon` distinto para
cambiarlo, o `hideIcon` para eliminarlo por completo.

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion color="primary-500" title="Icono personalizado" :icon="{ name: 'plus' }">
    <p>Contenido.</p>
  </AdaptoAccordion>
  <AdaptoAccordion color="primary-500" title="Sin icono" hide-icon>
    <p>Contenido.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion color="primary-500" title="Icono personalizado" :icon="{ name: 'plus' }">
  ...
</AdaptoAccordion>
<AdaptoAccordion color="primary-500" title="Sin icono" hide-icon>
  ...
</AdaptoAccordion>
```

## Estados

<div class="demo" style="flex-direction: column; align-items: stretch;">
  <AdaptoAccordion color="primary-500" title="Deshabilitado" disabled>
    <p>Contenido.</p>
  </AdaptoAccordion>
</div>

```vue-html
<AdaptoAccordion color="primary-500" title="Deshabilitado" disabled />
```

- **`disabled`** — establece el atributo nativo `disabled` en el `<button>` de la cabecera,
  impidiendo que se disparen los clics (y por tanto `toggle`). No afecta al estilo más allá del
  render por defecto que el navegador da a un botón deshabilitado.

## Animación

La apertura y el cierre se animan con un `<Transition :css="false">` y hooks JS manuales
(`enter`/`leave`) en lugar de clases de transición CSS: la `height` del contenido se mide de `0` a
`scrollHeight` y la `opacity` de `0` a `1`, ambas durante `.3s` con una curva
`cubic-bezier(0.4, 0, 0.2, 1)`. Cuando termina la transición de entrada, `height` se reinicia a
`auto` para que el contenido pueda redimensionarse con naturalidad mientras está abierto (por
ejemplo, si contiene contenido dinámico o responsive).

## Props

| Prop         | Tipo                                                | Por defecto                      | Descripción                                                                 |
| ------------ | ---------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `variant`    | `'outlined' \| 'fussy' \| 'soft' \| 'default'`       | `'fussy'`                          | Estilo de borde y fondo.                                                     |
| `color`      | `string`                                             | `''`                               | Nombre de token del tema resuelto vía `fw.cv()`; define el estilo inline `color` (cae en `surface-700` si está vacío). |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`               | `'xs'`                              | Controla el padding y el tamaño de fuente de la cabecera.                    |
| `radius`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`     | `'sm'`                              | Declarada pero nunca leída: actualmente **sin efecto visual**.               |
| `title`      | `string`                                             | `'Accordion title item'`           | Texto mostrado en el botón de la cabecera.                                   |
| `modelValue` | `boolean`                                            | `false`                             | Estado abierto/cerrado (`v-model`). Se ignora al anidarse en `adpt-accordion-list`. |
| `disabled`   | `boolean`                                            | `false`                             | Deshabilita el botón de la cabecera.                                         |
| `icon`       | `Icon` (`{ name, size?, color?, strokeWidth?, defaultClass? }`) | `{ name: 'chevron-down' }` | Icono renderizado vía `AdaptoIcon`; se dimensiona automáticamente a partir del tamaño de fuente de la cabecera si se omite `size`. |
| `hideIcon`   | `boolean`                                            | `false`                             | Oculta el icono de la cabecera.                                              |

## Emits

| Evento              | Payload   | Descripción                                                                                   |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `update:modelValue`  | `boolean` | Se emite al hacer clic en la cabecera **solo** en modo autónomo (sin un ancestro `adpt-accordion-list`). No se emite al estar anidado en una lista: en ese caso el `toggle()` de la lista gestiona el estado. |

## Slots

| Slot      | Descripción                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------- |
| `default` | Contenido del panel, renderizado dentro de un `<div role="region">` solo mientras el acordeón está abierto. Sin contenido de respaldo. |

## Accesibilidad

- El contenedor del contenido expandible tiene un `role="region"` estático.
- `disabled` se refleja en el atributo nativo `disabled` del `<button>` de la cabecera, así que
  queda excluido automáticamente del orden de tabulación y las tecnologías de asistencia lo
  anuncian como no disponible.
- La cabecera es un `<button>` real, así que es alcanzable y activable por teclado (`Tab` +
  `Enter`/`Espacio`) sin necesidad de nada más.
- El componente no establece `aria-expanded` en el botón de la cabecera ni el emparejamiento
  `aria-controls`/`id` entre el botón y el panel `role="region"`: si dependes de ese nivel de
  cableado ARIA, verifícalo frente a tus requisitos de accesibilidad.
