# Skeleton

`adpt-skeleton` es un marcador de posición puramente visual para contenido que todavía se está
cargando. No slots, no eventos, sin lógica de carga propia: el consumidor decide cuándo mostrarlo
y cuándo sustituirlo por el contenido real.

- **Nombre del componente:** `AdaptoSkeleton`
- **Fuente:** `src/lib/components/element/adpt-skeleton/index.vue`
- **Estilos:** `src/lib/components/element/adpt-skeleton/style.scss` (se inyectan en el primer
  render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoSkeleton`
está disponible de forma global:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoSkeleton width="240" height="16" />
```

<div class="demo">
  <AdaptoSkeleton width="240" height="16" />
</div>

El componente no acepta contenido: no declara ningún slot, así que cualquier cosa que se coloque
dentro de `<AdaptoSkeleton>` se ignora. Es responsabilidad del consumidor renderizar el
`AdaptoSkeleton` mientras los datos están en vuelo y sustituirlo por el contenido final una vez
resueltos.

## Animación

La prop `animation` controla el efecto mientras el skeleton está visible. Por defecto es
`'pulse'`.

<div class="demo">
  <AdaptoSkeleton width="200" height="16" animation="pulse" />
  <AdaptoSkeleton width="200" height="16" animation="wave" />
  <AdaptoSkeleton width="200" height="16" animation="none" />
</div>

```vue-html
<AdaptoSkeleton width="200" height="16" animation="pulse" />
<AdaptoSkeleton width="200" height="16" animation="wave" />
<AdaptoSkeleton width="200" height="16" animation="none" />
```

| Animación | Descripción                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------- |
| `pulse`   | Oscila la opacidad entre `1` y `0.4` en bucle. **Por defecto.**                                |
| `wave`    | Degradado lineal en movimiento (`background-position`) que simula un barrido de luz en bucle.   |
| `none`    | Sin animación: no añade la clase modificadora `fw-skeleton--<animation>`, el fondo queda estático. |

::: tip `prefers-reduced-motion`
Con `animation="pulse"` o `animation="wave"`, si el sistema tiene activado
`prefers-reduced-motion: reduce`, la animación se desactiva automáticamente y el fondo vuelve a su
color estático — con independencia del valor de la prop. No hace falta gestionarlo desde el
consumidor.
:::

## Dimensiones

Las props `width` y `height` fijan el tamaño inline del skeleton. Un número se interpreta como
píxeles; un string se pasa tal cual (admite por tanto cualquier unidad CSS, p. ej. `"50%"`).

Sin `height`, el bloque mide `1em` de alto por la hoja de estilos base — el tamaño de una sola
línea de texto. Sin `width`, ocupa `100%` del contenedor.

<div class="demo">
  <AdaptoSkeleton width="100%" height="16" />
  <AdaptoSkeleton width="120" height="120" />
  <AdaptoSkeleton width="3rem" height="3rem" rounded="full" />
</div>

```vue-html
<AdaptoSkeleton width="100%" height="16" />
<AdaptoSkeleton width="120" height="120" />
<AdaptoSkeleton width="3rem" height="3rem" rounded="full" />
```

## Radio

La prop `rounded` mapea a las clases utilitarias compartidas `.rounded--*` (definidas de forma
global en `src/lib/styles/sass/helpers/_radius.scss`, no en el `style.scss` propio del
componente). Sin valor, no se añade ninguna clase de radio.

<div class="demo">
  <AdaptoSkeleton width="64" height="64" rounded="xs" />
  <AdaptoSkeleton width="64" height="64" rounded="md" />
  <AdaptoSkeleton width="64" height="64" rounded="xl" />
  <AdaptoSkeleton width="64" height="64" rounded="full" />
</div>

```vue-html
<AdaptoSkeleton width="64" height="64" rounded="xs" />
<AdaptoSkeleton width="64" height="64" rounded="md" />
<AdaptoSkeleton width="64" height="64" rounded="xl" />
<AdaptoSkeleton width="64" height="64" rounded="full" />
```

También existe `borderRadius`, que fija el `border-radius` inline directamente (número → `px`,
string tal cual). Si se usan ambas a la vez, `borderRadius` gana por especificidad CSS al tratarse
de un estilo inline frente a una clase.

```vue-html
<!-- borderRadius prevalece sobre rounded cuando ambas están presentes -->
<AdaptoSkeleton width="64" height="64" rounded="xs" border-radius="24px" />
```

## Color

La prop `color` acepta el nombre de un token del tema (p. ej. `color-primary-500`) y, si se
indica, resuelve el fondo del skeleton vía `fw.cv(color)`. Es un valor libre, no un enum cerrado:
cualquier token válido del tema sirve. Si se omite (valor por defecto `''`), el skeleton usa el
color de fondo del tema para este componente (token `component.skeleton.bg`, `sm.surface.300` en
Atlas).

<div class="demo">
  <AdaptoSkeleton width="200" height="16" color="color-primary-300" />
</div>

```vue-html
<AdaptoSkeleton width="200" height="16" color="color-primary-300" />
```

## Composición de varias líneas

Al no tener slot, componer un bloque de carga (p. ej. una card con avatar y varias líneas de
texto) se hace apilando varias instancias:

<div class="demo" style="flex-direction: column; align-items: flex-start; gap: 8px;">
  <AdaptoSkeleton width="48" height="48" rounded="full" />
  <AdaptoSkeleton width="180" height="12" />
  <AdaptoSkeleton width="120" height="12" />
</div>

```vue-html
<AdaptoSkeleton width="48" height="48" rounded="full" />
<AdaptoSkeleton width="180" height="12" />
<AdaptoSkeleton width="120" height="12" />
```

## Props

| Prop           | Tipo                                             | Por defecto            | Descripción                                                                                       |
| -------------- | ------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `width`        | `string \| number`                                | `undefined`             | Ancho inline; un número se convierte a `px`, un string se usa tal cual.                            |
| `height`       | `string \| number`                                | `undefined`             | Alto inline; un número se convierte a `px`, un string se usa tal cual (la base en SCSS es `1em`).  |
| `rounded`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`   | `undefined`             | Añade la clase utilitaria global `rounded--<valor>`.                                               |
| `borderRadius` | `string \| number`                                | `undefined`             | `border-radius` inline; un número se convierte a `px`. Prevalece sobre `rounded` si ambas se usan. |
| `color`        | `string`                                          | `''`                    | Nombre de token del tema; si es truthy, fija `background-color` inline vía `fw.cv(color)`.         |
| `animation`    | `'pulse' \| 'wave' \| 'none'`                     | `'pulse'`               | Añade la clase `fw-skeleton--<animation>`, salvo con `'none'`.                                     |
| `ariaLabel`    | `string`                                          | `'Cargando contenido'`  | Texto del `<span>` accesible oculto visualmente que anuncia el estado de carga.                    |

`rounded` y `animation` validan sus valores con un validador de Vue que solo emite un warning en
consola si el valor no está en la lista — no rechaza ni sustituye el valor recibido.

## Emits

`adpt-skeleton` no emite ningún evento.

## Slots

`adpt-skeleton` no declara ningún slot. Es un componente puramente presentacional sin contenido
proyectado: cualquier markup colocado entre sus etiquetas de apertura y cierre se ignora.

## Accesibilidad

- El componente renderiza dos nodos **hermanos** (fragmento multi-raíz de Vue 3), no anidados: un
  `<div>` visual con `aria-hidden="true"` (el "hueso" que se ve en pantalla) y un `<span
  role="status" aria-live="polite">` separado que lleva el texto de `ariaLabel`. Al ser hermanos,
  el `aria-hidden` del bloque visual nunca oculta el texto accesible del span.
- El `<span>` usa además la clase global `accesible-hidden` (oculta visualmente, pero presente
  para lectores de pantalla) y anuncia el valor de `ariaLabel` como su contenido de texto —no como
  atributo `aria-*`— apoyándose en `role="status"` y `aria-live="polite"` para la notificación.
- El texto por defecto de `ariaLabel` es `"Cargando contenido"`, en castellano y sin gancho de
  i18n. Sobrescríbelo con una descripción concreta de lo que se está cargando, por ejemplo
  `aria-label="Cargando perfil del usuario"`.
- El componente no gestiona el ciclo de vida de la carga: es el consumidor quien decide cuándo
  mostrar el skeleton y cuándo reemplazarlo por el contenido real, incluyendo mover el foco o
  anunciar la finalización si corresponde.
