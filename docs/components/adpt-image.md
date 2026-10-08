# Image

`adpt-image` es una envoltura ligera sobre un `<img>` nativo: una pareja div/img de estructura
fija que añade control de `object-fit`, una caja opcional de `aspect-ratio` y un evento `on-error`
normalizado. No tiene slots ni variantes visuales más allá de `fit`.

- **Nombre del componente:** `AdaptoImage`
- **Fuente:** `src/lib/components/element/adpt-image/index.vue`
- **Estilos:** `src/lib/components/element/adpt-image/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoImage` está
disponible de forma global. `src` es la única prop obligatoria:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" />
```

## Ajuste del contenido

La prop `fit` mapea a una clase modificadora `.fw-image--<fit>` que define `object-fit` en el
`<img>` interno. Por defecto es `'cover'`. Cualquier valor fuera de `'contain' | 'cover'` cae
silenciosamente en `'cover'`, tanto en la clase aplicada como en el comportamiento resuelto de
`object-fit`.

<div class="demo">
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" fit="cover" aspect-ratio="1/1" width="160px" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" fit="contain" aspect-ratio="1/1" width="160px" />
</div>

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" fit="cover" aspect-ratio="1/1" width="160px" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" fit="contain" aspect-ratio="1/1" width="160px" />
```

| `fit`       | Efecto                                                             |
| ----------- | ------------------------------------------------------------------- |
| `cover`     | Rellena la caja recortando lo que sobresale. **Por defecto.**       |
| `contain`   | Escala la imagen entera para que quepa dentro de la caja, dejando bandas si hace falta. |

## Relación de aspecto

La prop `aspectRatio` establece un estilo inline `aspect-ratio` en el `div` contenedor, pero solo
cuando el valor pertenece a una lista fija: `'16/9' | '4/3' | '1/1' | '9/16'`. Cualquier otro valor
(o ninguno) se ignora y no se aplica ningún `aspect-ratio`; en ese caso el contenedor se
dimensiona a partir de las dimensiones naturales de la imagen y del layout circundante.

<div class="demo">
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" aspect-ratio="16/9" width="220px" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" aspect-ratio="1/1" width="140px" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" aspect-ratio="9/16" width="110px" />
</div>

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" aspect-ratio="16/9" width="220px" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" aspect-ratio="1/1" width="140px" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" aspect-ratio="9/16" width="110px" />
```

::: warning Sin aspectRatio
Sin `aspectRatio`, el contenedor no tiene altura fija propia: el tamaño renderizado depende de las
dimensiones naturales del `<img>` (escaladas al `width` que pases, si lo hay) y de la altura que
permita el layout padre. Pasa un `aspectRatio` siempre que necesites una caja predecible antes de
que la imagen cargue.
:::

## Ancho

La prop `width` se escribe literalmente como estilo inline `width` del `div` contenedor, así que
debe incluir unidad (`"200px"`, `"50%"`, …): un número suelto no se convierte a píxeles.

<div class="demo">
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" width="100px" aspect-ratio="1/1" />
  <AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" width="200px" aspect-ratio="1/1" />
</div>

```vue-html
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" width="100px" aspect-ratio="1/1" />
<AdaptoImage src="https://picsum.photos/id/1015/800/500" alt="Río de montaña" width="200px" aspect-ratio="1/1" />
```

## Manejo de errores

El evento nativo `error` del `<img>` se reenvía como `on-error`, con el `Event` original. Es la
única forma de reaccionar ante un `src` roto: no hay imagen de reserva ni estado de marcador de
posición integrados.

<div class="demo">
  <AdaptoImage src="https://this-domain-does-not-exist.invalid/broken.jpg" alt="Imagen rota" width="120px" aspect-ratio="1/1" @on-error="() => {}" />
</div>

```vue-html
<AdaptoImage
  src="https://example.com/broken.jpg"
  alt="Imagen rota"
  @on-error="onImageError"
/>
```

```ts
function onImageError(event: Event) {
  // p. ej. cambiar `src` por una imagen de reserva, registrar el fallo, etc.
}
```

## Props

| Prop          | Tipo                                    | Por defecto | Descripción                                                                                   |
| ------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `src`         | `string`                                  | —         | **Obligatoria.** Define el atributo `<img src>`.                                               |
| `width`       | `string`                                  | `undefined` | Estilo inline `width` en el `div` contenedor. Debe incluir unidad.                           |
| `alt`         | `string`                                  | `undefined` | Define el atributo `<img alt>`. Opcional según la definición de la prop, pero debería pasarse en imágenes con significado. |
| `fit`         | `'contain' \| 'cover'`                    | `'cover'` | Aplica `object-fit` mediante una clase modificadora `.fw-image--<fit>`. Los valores fuera de esta unión caen en `'cover'`. |
| `aspectRatio` | `'16/9' \| '4/3' \| '1/1' \| '9/16'`       | `undefined` | Estilo inline `aspect-ratio` en el `div` contenedor, aplicado solo si el valor está en esta lista; en caso contrario se ignora. |

## Emits

| Evento     | Payload | Descripción                                                  |
| ---------- | ------- | ---------------------------------------------------------------- |
| `on-error` | `Event` | Se emite cuando el `<img>` falla al cargar (evento nativo `error`). |

## Slots

`adpt-image` no tiene slots. El `div` contenedor y el `<img>` que contiene son una estructura
fija: todo el contenido renderizado procede de las props `src`/`alt`/`fit`/`aspectRatio`/`width`.

## Accesibilidad

- El atributo `alt` del `<img>` se enlaza directamente a la prop `alt`. `alt` es opcional en la
  definición de la prop, pero omitirlo deja la imagen sin texto accesible: pasa siempre `alt` en
  cualquier imagen que transmita información, y pasa explícitamente una cadena vacía (`alt=""`)
  para imágenes puramente decorativas.
- No hay ningún atributo `role` ni `aria-*` más allá de `alt`; las tecnologías de asistencia tratan
  el elemento como una imagen estándar.
- Un fallo de carga (`on-error`) no cambia el marcado renderizado ni anuncia nada por sí mismo: si
  necesitas notificar a las personas usuarias de una imagen rota, gestiónalo tú en el manejador de
  `on-error` (p. ej. sustituyendo el `src` por uno de reserva o renderizando texto acompañante).
