# Card

`adpt-card` es un contenedor de contenido puramente presentacional. Renderiza un `<article>`
semántico con los slots opcionales `media`, `title`, `subtitle`, `body` y `footer`, tres variantes
visuales, radio y elevación configurables y un layout opcional de «superposición de imagen» en el
que el bloque de título y subtítulo se sitúa sobre la imagen del slot `media`.

- **Nombre del componente:** `AdaptoCard`
- **Fuente:** `src/lib/components/element/adpt-card/index.vue`
- **Estilos:** `src/lib/components/element/adpt-card/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoCard` está
disponible de forma global. Todo el contenido se aporta mediante slots con nombre: no hay props de
texto `title`/`body`.

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo" style="display: block;">
  <AdaptoCard variant="outlined" color="primary-500" radius="md">
    <template #title>Título de la tarjeta</template>
    <template #subtitle>Subtítulo de apoyo</template>
    <template #body>
      <p>El contenido del cuerpo lo aporta por completo quien la consume: texto plano, HTML o
      componentes anidados funcionan aquí.</p>
    </template>
    <template #footer>
      <AdaptoButton label="Acción" size="sm" color="primary-500" />
    </template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="outlined" color="primary-500" radius="md">
  <template #title>Título de la tarjeta</template>
  <template #subtitle>Subtítulo de apoyo</template>
  <template #body>
    <p>El contenido del cuerpo lo aporta por completo quien la consume: texto plano, HTML o
    componentes anidados funcionan aquí.</p>
  </template>
  <template #footer>
    <AdaptoButton label="Acción" size="sm" color="primary-500" />
  </template>
</AdaptoCard>
```

Cada sección se renderiza condicionalmente según los slots que se pasen: el bloque de cabecera
(`title`/`subtitle`/`media`) solo aparece si hay un slot `title` o `subtitle`, y `body`/`footer`
solo se renderizan si se usan sus slots respectivos. Una tarjeta sin ningún slot renderiza un
`<article>` prácticamente vacío.

## Variantes

La prop `variant` controla el estilo de fondo y borde de la tarjeta. Por defecto es `default`.

<div class="demo">
  <AdaptoCard variant="default" color="primary-500" style="width: 220px;">
    <template #title>Default</template>
    <template #body>Usa el token de fondo de tarjeta del tema.</template>
  </AdaptoCard>
  <AdaptoCard variant="outlined" color="primary-500" style="width: 220px;">
    <template #title>Outlined</template>
    <template #body>Fondo transparente, borde en `currentColor`.</template>
  </AdaptoCard>
  <AdaptoCard variant="fussy" color="primary-500" style="width: 220px;">
    <template #title>Fussy</template>
    <template #body>Borde y fondo tintado.</template>
  </AdaptoCard>
  <AdaptoCard variant="soft" color="primary-500" style="width: 220px;">
    <template #title>Soft</template>
    <template #body>Fondo tintado, sin borde.</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="default" color="primary-500">...</AdaptoCard>
<AdaptoCard variant="outlined" color="primary-500">...</AdaptoCard>
<AdaptoCard variant="fussy" color="primary-500">...</AdaptoCard>
<AdaptoCard variant="soft" color="primary-500">...</AdaptoCard>
```

| Variante   | Descripción                                                                  |
| ---------- | ------------------------------------------------------------------------------ |
| `default`  | Usa el token de fondo `--fw-card-bg` del tema. **Por defecto.**               |
| `outlined` | Fondo transparente con un borde en `currentColor`.                            |
| `fussy`    | Borde en `currentColor` **y** fondo tintado (`color-mix`).                    |
| `soft`     | Fondo tintado (`color-mix`), sin borde.                                       |

Cualquier valor fuera de `'default' | 'outlined' | 'fussy' | 'soft'` cae en `default` (lo impone el
`validator` de la prop).

## Colores

`color`, `titleColor` y `subtitleColor` aceptan cada uno el nombre de un token del tema (p. ej.
`primary-500`, `danger-700`) resuelto a `var(--fw-<color>)`. `color` define el color de texto
general de la tarjeta (`currentColor`), que `outlined`/`fussy`/`soft` reutilizan para bordes y
fondos tintados. `titleColor`/`subtitleColor` sobrescriben de forma independiente solo el color del
contenedor del slot de título o de subtítulo.

<div class="demo">
  <AdaptoCard variant="soft" color="success-600" title-color="success-800" style="width: 260px;">
    <template #title>Éxito</template>
    <template #subtitle>Color de subtítulo independiente</template>
    <template #body>Color de la tarjeta frente a color del título.</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="soft" color="success-600" title-color="success-800">
  <template #title>Éxito</template>
  <template #subtitle>Color de subtítulo independiente</template>
  <template #body>Color de la tarjeta frente a color del título.</template>
</AdaptoCard>
```

Si se dejan sin definir (el valor por defecto en los tres casos), no se aplica ningún estilo
inline `color` y el elemento hereda el color de texto de su contexto.

## Radio y elevación

`radius` mapea a las clases utilitarias compartidas `.rounded--*` (por defecto `sm`). `elevation`
mapea a las clases `.elevation-<n>` y acepta `'1' | '2' | '3' | '4' | '5'`; por defecto está sin
definir (`''`), lo que no renderiza ninguna clase de elevación ni sombra.

<div class="demo">
  <AdaptoCard variant="default" color="primary-500" radius="xl" elevation="3" style="width: 220px;">
    <template #title>Redondeada y elevada</template>
    <template #body>radius="xl" elevation="3"</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard variant="default" color="primary-500" radius="xl" elevation="3">
  <template #title>Redondeada y elevada</template>
  <template #body>radius="xl" elevation="3"</template>
</AdaptoCard>
```

## Media

Pasar un slot `media` (normalmente un `<img>`) lo renderiza por defecto sobre el bloque de título
y subtítulo. `titleReverse` invierte ese orden de apilado y coloca el contenido multimedia
**debajo** del título y el subtítulo.

<div class="demo">
  <AdaptoCard variant="default" color="primary-500" style="width: 260px;">
    <template #media>
      <img src="https://picsum.photos/id/1015/400/300" alt="Lago de montaña al amanecer" />
    </template>
    <template #title>Media apilada</template>
    <template #body>La media se renderiza sobre el bloque de título (orden por defecto).</template>
  </AdaptoCard>
  <AdaptoCard variant="default" color="primary-500" title-reverse style="width: 260px;">
    <template #media>
      <img src="https://picsum.photos/id/1018/400/300" alt="Camino en el bosque" />
    </template>
    <template #title>Media invertida</template>
    <template #body>`title-reverse` mueve la media debajo del bloque de título.</template>
  </AdaptoCard>
</div>

```vue-html
<!-- apilado por defecto: media sobre el título -->
<AdaptoCard color="primary-500">
  <template #media><img src="..." alt="..." /></template>
  <template #title>Media apilada</template>
  <template #body>...</template>
</AdaptoCard>

<!-- title-reverse: media bajo el título -->
<AdaptoCard color="primary-500" title-reverse>
  <template #media><img src="..." alt="..." /></template>
  <template #title>Media invertida</template>
  <template #body>...</template>
</AdaptoCard>
```

::: tip `titleReverse` requiere un slot `media`
`titleReverse` solo tiene efecto visible cuando hay un slot `media` **y** `imageOverlap` es
`false`. En una tarjeta sin media, o con `imageOverlap` activo, no hace nada.
:::

### Superposición de imagen

Activar `imageOverlap` sitúa el bloque de título y subtítulo sobre la imagen del slot `media` en
lugar de apilarlos. `titleOverlapPosition` (`'top-start' | 'top-end' | 'bottom-start' |
'bottom-end' | 'center'`) controla dónde se coloca el bloque de título sobre la imagen, y
`titleOverlapTextAlign` (`'start' | 'center' | 'end'`) controla la alineación del texto dentro de
él.

<div class="demo">
  <AdaptoCard
    variant="default"
    color="primary-500"
    image-overlap
    title-overlap-position="bottom-start"
    title-overlap-text-align="start"
    style="width: 280px;"
  >
    <template #media>
      <img src="https://picsum.photos/id/1019/400/300" alt="Dunas del desierto" />
    </template>
    <template #title>Título superpuesto</template>
    <template #subtitle>Posicionado en bottom-start</template>
  </AdaptoCard>
</div>

```vue-html
<AdaptoCard
  color="primary-500"
  image-overlap
  title-overlap-position="bottom-start"
  title-overlap-text-align="start"
>
  <template #media><img src="..." alt="..." /></template>
  <template #title>Título superpuesto</template>
  <template #subtitle>Posicionado en bottom-start</template>
</AdaptoCard>
```

::: warning `titleOverlapPosition` y `titleOverlapTextAlign` son modificadores de `imageOverlap`
Ambas props están condicionadas a `imageOverlap` en el cálculo interno de clases del componente:
solo producen un efecto visible cuando `imageOverlap` es `true`. Definir cualquiera de las dos sin
`imageOverlap` compila y renderiza sin error, pero no tiene efecto visible.
:::

## Props

| Prop                     | Tipo                                                                | Por defecto | Descripción                                                                                     |
| ------------------------ | -------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `color`                  | `string`                                                              | `''`        | Nombre de token del tema resuelto a `var(--fw-<color>)`; define el color de texto de la tarjeta (`currentColor`). |
| `titleColor`             | `string`                                                              | `''`        | Nombre de token del tema resuelto a `var(--fw-<color>)`, aplicado solo al contenedor del slot `title`. |
| `subtitleColor`          | `string`                                                              | `''`        | Nombre de token del tema resuelto a `var(--fw-<color>)`, aplicado solo al contenedor del slot `subtitle`. |
| `radius`                 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`                      | `'sm'`      | Radio de esquina, mediante las clases utilitarias compartidas `.rounded--*`.                        |
| `variant`                | `'default' \| 'outlined' \| 'fussy' \| 'soft'`                        | `'default'` | Estilo visual de la tarjeta. Los valores inválidos caen en `'default'`.                            |
| `elevation`              | `'1' \| '2' \| '3' \| '4' \| '5'`                                     | `''`        | Añade una clase utilitaria de sombra `.elevation-<n>`. Sin definir por defecto (sin sombra).       |
| `imageOverlap`           | `boolean`                                                             | `false`     | Superpone el bloque de título y subtítulo sobre el slot `media` en lugar de apilarlos.             |
| `titleOverlapPosition`   | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end' \| 'center'` | `''`     | Posición del bloque de título sobre la imagen. **Solo aplica cuando `imageOverlap` es `true`.**    |
| `titleOverlapTextAlign`  | `'start' \| 'center' \| 'end'`                                        | `''`        | Alineación del texto del bloque de título superpuesto. **Solo aplica cuando `imageOverlap` es `true`.** |
| `titleReverse`           | `boolean`                                                             | `false`     | Renderiza `media` debajo del bloque de título y subtítulo en lugar de encima. **Solo aplica cuando hay un slot `media` y `imageOverlap` es `false`.** |

## Emits

`AdaptoCard` es un componente puramente presentacional: no declara ningún emit.

## Slots

| Slot       | Descripción                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `media`    | Contenido multimedia (normalmente un `<img>`), renderizado dentro del bloque de cabecera. Quien lo consume es responsable de aportar un `alt` adecuado. |
| `title`    | Título de la tarjeta. Su presencia (junto con `subtitle`) determina si se renderiza el bloque de cabecera, y alimenta el `aria-labelledby` del `<article>` raíz. |
| `subtitle` | Subtítulo de la tarjeta, renderizado bajo el título. Su presencia alimenta el `aria-describedby` del `<article>` raíz. |
| `body`     | Contenido principal de la tarjeta. Solo se renderiza cuando se usa el slot.                   |
| `footer`   | Contenido del pie (p. ej. botones de acción). Solo se renderiza cuando se usa el slot.        |

## Accesibilidad

- El elemento raíz es un `<article>` semántico.
- Cuando hay un slot `title`, el `<article>` recibe `aria-labelledby` apuntando al id autogenerado
  del bloque de título, de modo que las tecnologías de asistencia anuncian el título de la tarjeta
  como su nombre accesible.
- Cuando hay un slot `subtitle`, el `<article>` recibe `aria-describedby` apuntando al id
  autogenerado del bloque de subtítulo.
- `AdaptoCard` no tiene elementos interactivos propios; no renderiza ningún `role` más allá del
  rol implícito `article` y no gestiona el foco.
- El contenido de los slots `media`/`title`/`body`/`footer` lo aporta íntegramente quien consume el
  componente: recuerda dar un `alt` significativo a las imágenes que pases al slot `media` y usar
  elementos interactivos enfocables y etiquetados (p. ej. `AdaptoButton`) dentro de `footer`.
