# Avatar

`adpt-avatar` muestra la foto, el nombre completo o las iniciales de una persona dentro de un
círculo de tamaño fijo. Se comporta como un elemento interactivo (`role="button"`, activable por
teclado) y emite un único evento `clicked` al hacer clic o al pulsar
<kbd>Enter</kbd>/<kbd>Espacio</kbd>.

- **Nombre del componente:** `AdaptoAvatar`
- **Fuente:** `src/lib/components/element/adpt-avatar/index.vue`
- **Estilos:** `src/lib/components/element/adpt-avatar/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoAvatar` está
disponible de forma global:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

```vue-html
<AdaptoAvatar name="Ada Lovelace" @clicked="onAvatarClick" />
```

## Contenido: imagen, nombre o iniciales

`adpt-avatar` no tiene variantes visuales: el contenido que renderiza depende por completo de la
combinación de las props `image` y `showInitials`:

<div class="demo">
  <AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" />
  <AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" show-initials />
  <AdaptoAvatar name="Ada Lovelace" />
  <AdaptoAvatar name="Ada Lovelace" show-initials />
</div>

```vue-html
<!-- con imagen y showInitials en false (por defecto) -> renderiza el <img> -->
<AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" />

<!-- con imagen y showInitials en true -> la imagen se ignora y se muestran las iniciales -->
<AdaptoAvatar image="https://i.pravatar.cc/150?img=12" name="Ada Lovelace" show-initials />

<!-- sin imagen y showInitials en false (por defecto) -> renderiza el nombre completo, truncado -->
<AdaptoAvatar name="Ada Lovelace" />

<!-- sin imagen y showInitials en true -> renderiza las iniciales -->
<AdaptoAvatar name="Ada Lovelace" show-initials />
```

| `image`      | `showInitials` | Contenido renderizado                                  |
| ---------- | --------------- | ------------------------------------------------------ |
| presente   | `false`         | `<img :src="image" :alt="name">`                       |
| presente   | `true`          | Iniciales; la imagen no se solicita ni se renderiza.   |
| ausente | `false`       | El texto completo de `name`, truncado con puntos suspensivos si desborda el círculo. |
| ausente | `true`        | Iniciales.                                              |

Las iniciales se calculan a partir de `name` como el primer carácter más el primer carácter de la
segunda palabra separada por espacio (p. ej. `"Ada Lovelace"` → `"AL"`, `"Ada"` → `"A"`).

::: warning Sin imagen ni nombre
Si no se pasa ni `image` ni `name` (y `showInitials` es `false`), el avatar renderiza un círculo
vacío sin nombre accesible. Es un caso límite legítimo del componente, no un fallo, así que pasa
siempre al menos `name`.
:::

## Tamaños

La prop `size` controla el diámetro del avatar y el tamaño de fuente mediante un mapa de tamaños
fijo. Por defecto es `'md'`.

<div class="demo">
  <AdaptoAvatar size="xs" name="Ada Lovelace" />
  <AdaptoAvatar size="sm" name="Ada Lovelace" />
  <AdaptoAvatar size="md" name="Ada Lovelace" />
  <AdaptoAvatar size="lg" name="Ada Lovelace" />
  <AdaptoAvatar size="xl" name="Ada Lovelace" />
</div>

```vue-html
<AdaptoAvatar size="xs" name="Ada Lovelace" />
<AdaptoAvatar size="sm" name="Ada Lovelace" />
<AdaptoAvatar size="md" name="Ada Lovelace" />
<AdaptoAvatar size="lg" name="Ada Lovelace" />
<AdaptoAvatar size="xl" name="Ada Lovelace" />
```

| Tamaño | Diámetro |
| ---- | -------- |
| `xs` | 16px     |
| `sm` | 24px     |
| `md` | 32px (por defecto) |
| `lg` | 48px     |
| `xl` | 64px     |

## Interacción

El avatar siempre es enfocable y pulsable, sea cual sea su contenido:

<div class="demo">
  <AdaptoAvatar name="Ada Lovelace" @clicked="() => {}" />
</div>

```vue-html
<AdaptoAvatar name="Ada Lovelace" @clicked="onAvatarClick" />
```

- Al hacer clic en el avatar se emite `clicked` con el `MouseEvent`.
- Pulsar <kbd>Enter</kbd> o <kbd>Espacio</kbd> con el avatar enfocado también emite `clicked`, con
  el `KeyboardEvent`. Se evita el scroll de página que <kbd>Espacio</kbd> provoca por defecto.
- No hay prop `disabled`: el avatar siempre es interactivo.

## Props

| Prop           | Tipo                                       | Por defecto | Descripción                                                                 |
| -------------- | ------------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `image`        | `string`                                    | `undefined` | URL de la imagen. Se renderiza como `<img>` cuando está definida y `showInitials` es `false`. |
| `name`         | `string`                                    | `undefined` | Nombre de la persona. Se usa como `aria-label`, como `alt` del `<img>` y para calcular las iniciales o el texto mostrado. |
| `size`         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`       | `'md'`  | Diámetro y tamaño de fuente, mediante un mapa de tamaños fijo.               |
| `showInitials` | `boolean`                                   | `false` | Fuerza mostrar las iniciales en lugar de la imagen o el nombre completo.     |

## Emits

| Evento    | Payload                        | Descripción                                                          |
| --------- | ------------------------------- | ------------------------------------------------------------------------ |
| `clicked` | `MouseEvent \| KeyboardEvent`   | Se emite al hacer clic, o con <kbd>Enter</kbd>/<kbd>Espacio</kbd> mientras tiene el foco. |

## Slots

`adpt-avatar` no tiene slots: su contenido (imagen, nombre o iniciales) lo controlan por completo
las props `image`, `name` y `showInitials`.

## Accesibilidad

- El elemento raíz tiene `role="button"` y `tabindex="0"`, así que participa en el orden de
  tabulación y las tecnologías de asistencia lo anuncian como un botón.
- `aria-label` se enlaza directamente a la prop `name`. Si se omite `name`, el avatar no expone
  nombre accesible: pasa siempre `name`, incluso cuando solo uses `image`.
- El atributo `alt` del elemento `<img>` también usa `name`, con cadena vacía como valor de
  respaldo cuando `name` no se proporciona.
- El `<span>` interno que muestra el nombre o las iniciales se marca como `aria-hidden="true"`,
  ya que el nombre accesible lo aporta el `aria-label` del elemento raíz; así se evita que el
  texto se anuncie dos veces.
