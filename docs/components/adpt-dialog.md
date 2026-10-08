# Dialog

`adpt-dialog` es un modal construido sobre el elemento nativo `<dialog>`. Gestiona su propia
animación de apertura y cierre, el cierre al hacer clic en el backdrop, el manejo de `Escape` y una
trampa de foco para `Tab`/`Shift+Tab`, y expone su estado exclusivamente mediante slots con nombre
(`header`, `body`, `footer`) y una API imperativa `open()`/`close()`.

- **Nombre del componente:** `VkDialog` — una inconsistencia heredada en el nombre interno de
  `defineOptions` (documentada en `.claude/CLAUDE.md`, no es un patrón a copiar). Se registra de
  forma global como `AdaptoDialog`, igual que el resto de componentes.
- **Fuente:** `src/lib/components/overlay/adpt-dialog/index.vue`
- **Estilos:** `src/lib/components/overlay/adpt-dialog/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoDialog` está
disponible de forma global. Se renderiza cerrado por defecto: no hay prop `modelValue`/`open` para
controlarlo de forma declarativa. En su lugar, obtén una ref de plantilla y llama a los métodos
expuestos `open()`/`close()`:

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<script setup>
import { ref } from 'vue'

const basicDialog = ref()
const backdropDialog = ref()
const plainDialog = ref()
const status = ref('cerrado')
</script>

<div class="demo">
  <AdaptoButton label="Abrir diálogo" color="primary-500" @clicked="basicDialog.open()" />
  <AdaptoDialog
    ref="basicDialog"
    label="Diálogo de ejemplo"
    @opened="status = 'abierto'"
    @closed="status = 'cerrado'"
  >
    <template #header>
      <h3>Título del diálogo</h3>
    </template>
    <template #body>
      <p>Contenido del cuerpo del diálogo: este bloque hace scroll interno en cuanto supera los 340px de altura.</p>
    </template>
    <template #footer>
      <AdaptoButton label="Cerrar" color="primary-500" @clicked="basicDialog.close()" />
    </template>
  </AdaptoDialog>
  <span>Estado: {{ status }}</span>
</div>

```vue-html
<AdaptoButton label="Abrir diálogo" color="primary-500" @clicked="dialogRef.open()" />

<AdaptoDialog
  ref="dialogRef"
  label="Diálogo de ejemplo"
  @opened="onOpened"
  @closed="onClosed"
>
  <template #header><h3>Título del diálogo</h3></template>
  <template #body><p>Contenido del cuerpo del diálogo.</p></template>
  <template #footer>
    <AdaptoButton label="Cerrar" color="primary-500" @clicked="dialogRef.close()" />
  </template>
</AdaptoDialog>
```

```ts
import { ref } from 'vue'

const dialogRef = ref()
```

Dentro del diálogo se renderiza siempre un botón de cierre (un `AdaptoButton` solo icono, escrito a
fuego con `variant="soft"`, `size="sm"`, `radius="full"`, `icon="x"`), con independencia de los
slots que se usen; no hay ningún slot para sustituirlo ni eliminarlo.

## Slots `header`, `body` y `footer`

`header`, `body` y `footer` se renderizan solo cuando se pasa el slot correspondiente: un diálogo
vacío sin slots renderiza únicamente el botón de cierre. Los contenedores de `header` y `body`
alimentan además el nombre y la descripción accesibles del diálogo (consulta
[Accesibilidad](#accesibilidad) más abajo): cuando no hay slot `header`, se usa la prop `label`
como `aria-label`.

<div class="demo">
  <AdaptoButton label="Abrir (sin header)" color="primary-500" @clicked="plainDialog.open()" />
  <AdaptoDialog ref="plainDialog" label="Nombre accesible vía aria-label">
    <template #body>
      <p>Aquí no se pasa slot <code>header</code>, así que <code>label</code> pasa a ser el
      <code>aria-label</code> del diálogo en lugar de alimentar <code>aria-labelledby</code>.</p>
    </template>
  </AdaptoDialog>
</div>

```vue-html
<AdaptoDialog ref="dialogRef" label="Nombre accesible vía aria-label">
  <template #body>
    <p>Sin slot header: label pasa a ser aria-label.</p>
  </template>
</AdaptoDialog>
```

## Clic en el backdrop

Por defecto, hacer clic fuera del contenido del diálogo lo cierra. `blockBackdrop` desactiva ese
comportamiento y obliga a cerrarlo explícitamente (con el botón de cierre integrado, con `Escape` o
llamando a `close()`).

<div class="demo">
  <AdaptoButton label="Abrir (backdrop bloqueado)" color="danger-600" @clicked="backdropDialog.open()" />
  <AdaptoDialog ref="backdropDialog" label="Backdrop bloqueado" block-backdrop>
    <template #body>
      <p>Hacer clic fuera de este diálogo no hace nada: solo lo cierran el botón de cierre o
      <kbd>Esc</kbd>.</p>
    </template>
  </AdaptoDialog>
</div>

```vue-html
<AdaptoDialog ref="dialogRef" label="Backdrop bloqueado" block-backdrop>
  <template #body><p>Solo el botón de cierre o Esc cierran este diálogo.</p></template>
</AdaptoDialog>
```

::: tip Cómo se detecta el clic en el backdrop
`handleBackdrop()` no comprueba `event.target`: compara las coordenadas del clic con el rectángulo
delimitador del elemento del diálogo. Un clic en cualquier punto fuera de ese rectángulo (es decir,
sobre el `::backdrop` nativo) dispara `close()`, salvo que `blockBackdrop` sea `true`.
:::

## Animación y tiempos

La apertura y el cierre animan opacidad y escala mediante los modificadores de clase `is-visible` e
`is-closing` (`--duration: 0.24s`, aplicado tanto al panel del diálogo como a su `::backdrop`):

- **`open()`** — llama de inmediato al `showModal()` nativo y emite `update:modelValue(true)` de
  forma síncrona; después espera 16 ms antes de añadir `is-visible` y emitir `opened` (dando al
  navegador un frame para aplicar el estado cerrado inicial antes de la transición).
- **`close()`** — añade `is-closing` y emite `update:modelValue(false)` de inmediato; después espera
  los 240 ms completos de la transición antes de llamar al `close()` nativo, devolver el foco al
  elemento que lo tenía antes y emitir `closed`.

Ambos temporizadores se limpian al desmontar y cada vez que se vuelve a llamar a `open()`/`close()`,
de modo que alternar rápidamente no deja ningún temporizador obsoleto en marcha.

## Props

| Prop            | Tipo      | Por defecto | Descripción                                                                 |
| ---------------- | --------- | ------- | ----------------------------------------------------------------------------- |
| `blockBackdrop`   | `boolean` | `false` | Si es `true`, hacer clic en el backdrop no cierra el diálogo.                |
| `label`           | `string`  | `''`    | `aria-label` del diálogo. Solo se usa cuando no se aporta slot `header`.     |

No hay prop `modelValue`/`open`: el estado de apertura del diálogo vive por completo dentro del
componente y lo controlan los métodos expuestos `open()`/`close()`, no un enlace de prop. Por tanto,
`v-model` en `AdaptoDialog` **no** es un enlace controlado bidireccional: solo recibe las
notificaciones `update:modelValue` de abajo, no sirve para abrir el diálogo programáticamente
asignando el valor enlazado.

## Emits

| Evento               | Payload                                | Descripción                                                                 |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `opened`               | ninguno                                  | Se emite unos 16 ms después de llamar a `open()`, una vez confirmada la apertura. |
| `closed`               | ninguno                                  | Se emite unos 240 ms después de llamar a `close()`, al terminar la transición de cierre. |
| `update:modelValue`    | `boolean` (`true` al abrir / `false` al cerrar) | Se emite de forma síncrona al inicio de `open()`/`close()`: es solo una notificación, ver la nota anterior. |

## Slots

| Slot      | Descripción                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------- |
| `header`  | Se renderiza en un `div` con id autogenerado (enlazado a `aria-labelledby`). Solo se muestra si se pasa el slot. |
| `body`    | Se renderiza en un `div` con id autogenerado (enlazado a `aria-describedby`), `max-height: 340px` y scroll interno. Solo se muestra si se pasa el slot. |
| `footer`  | Se renderiza en un `div` sin más. Solo se muestra si se pasa el slot.                         |

## Accesibilidad

- La raíz es un `<dialog>` nativo abierto con `showModal()`, con `aria-modal="true"`.
- Si hay slot `header`, el diálogo recibe `aria-labelledby` apuntando a ese bloque; si no, el
  `aria-label` recurre a la prop `label` (cuando está definida).
- Si hay slot `body`, el diálogo recibe `aria-describedby` apuntando a ese bloque.
- **Trampa de foco:** `Tab`/`Shift+Tab` recorren únicamente los descendientes enfocables del
  diálogo, saltando del último al primero (y viceversa). Si dentro no hay ningún elemento enfocable,
  el foco se mantiene en el propio elemento del diálogo.
- **Gestión del foco:** al llamar a `open()` se recuerda el elemento que tenía el foco y el diálogo
  lo recibe; al llamar a `close()`, el foco vuelve a ese elemento recordado en cuanto termina la
  transición de cierre.
- `Escape` se intercepta (`handleCancel`) para ejecutar la misma ruta de `close()` que cualquier
  otro disparador de cierre, manteniendo consistentes los eventos emitidos y la animación.
- El botón de cierre está siempre presente y es siempre solo icono, con un `aria-label="Close
  dialog"` escrito a fuego: no depende de la prop `label` ni de ningún slot.
