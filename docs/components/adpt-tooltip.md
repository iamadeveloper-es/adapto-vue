# Tooltip

`adpt-tooltip` envuelve un elemento disparador y muestra una pequeña caja de texto al pasar el
ratón. Admite cuatro posiciones iniciales y se recoloca automáticamente cuando no hay suficiente
espacio de viewport para la posición solicitada.

- **Nombre del componente:** `AdaptoTooltip`
- **Fuente:** `src/lib/components/overlay/adpt-tooltip/index.vue`
- **Estilos:** `src/lib/components/overlay/adpt-tooltip/style.scss` (se inyectan en el primer render del componente)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación, `AdaptoTooltip` está
disponible de forma global. La prop `content` contiene el texto del tooltip, y el **slot** `content`
contiene el elemento disparador al que se ancla: pese a compartir nombre, no tienen relación
(consulta [Slots](#slots) más abajo).

```ts
// main.ts
import { createApp } from 'vue'
import { AdaptoPlugin } from 'adapto-ui'
import App from './App.vue'

createApp(App).use(AdaptoPlugin).mount('#app')
```

<div class="demo">
  <AdaptoTooltip content="Guarda tus cambios">
    <template #content>
      <AdaptoButton label="Guardar" color="primary-500" />
    </template>
  </AdaptoTooltip>
</div>

```vue-html
<AdaptoTooltip content="Guarda tus cambios">
  <template #content>
    <AdaptoButton label="Guardar" color="primary-500" />
  </template>
</AdaptoTooltip>
```

La caja del tooltip se muestra en el `mouseenter` del disparador y se oculta en el `mouseleave`: no
hay disparador por teclado/foco ni por clic.

## Posición

La prop `position` define la posición inicial del tooltip respecto al disparador. Por defecto es
`'top'`.

<div class="demo" style="padding: 56px 24px; justify-content: space-around;">
  <AdaptoTooltip content="Tooltip arriba" position="top">
    <template #content><AdaptoButton label="Arriba" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
  <AdaptoTooltip content="Tooltip abajo" position="bottom">
    <template #content><AdaptoButton label="Abajo" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
  <AdaptoTooltip content="Tooltip a la izquierda" position="left">
    <template #content><AdaptoButton label="Izquierda" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
  <AdaptoTooltip content="Tooltip a la derecha" position="right">
    <template #content><AdaptoButton label="Derecha" color="primary-500" variant="outlined" /></template>
  </AdaptoTooltip>
</div>

```vue-html
<AdaptoTooltip content="Tooltip arriba" position="top">
  <template #content><AdaptoButton label="Arriba" color="primary-500" /></template>
</AdaptoTooltip>
<AdaptoTooltip content="Tooltip abajo" position="bottom">
  <template #content><AdaptoButton label="Abajo" color="primary-500" /></template>
</AdaptoTooltip>
<AdaptoTooltip content="Tooltip a la izquierda" position="left">
  <template #content><AdaptoButton label="Izquierda" color="primary-500" /></template>
</AdaptoTooltip>
<AdaptoTooltip content="Tooltip a la derecha" position="right">
  <template #content><AdaptoButton label="Derecha" color="primary-500" /></template>
</AdaptoTooltip>
```

Si `position` recibe cualquier valor distinto de `'top' | 'bottom' | 'left' | 'right'`, el
componente cae silenciosamente en `'top'`.

## Reposicionamiento automático

Un `IntersectionObserver` observa el elemento disparador desde que el componente se monta. Cada vez
que el tooltip pasa a ser visible, mide su caja frente al espacio de viewport restante en el lado
donde se renderizaría:

- `position="top"` cambia a `bottom` si la altura del tooltip es mayor que el espacio disponible
  encima del disparador.
- `position="bottom"` cambia a `top` si la altura del tooltip es mayor que el espacio de debajo.
- `position="left"` cambia a `right` si el ancho del tooltip es mayor que el espacio de la
  izquierda.
- `position="right"` cambia a `left` si el ancho del tooltip es mayor que el espacio de la derecha.

Solo alterna entre los dos lados opuestos del eje solicitado (arriba↔abajo o izquierda↔derecha):
nunca redirige, por ejemplo, un tooltip `left` hacia `top`. Una demo realista de esto necesita un
borde real del viewport, algo que esta página no puede reproducir de forma fiable en todos los
tamaños de ventana; prueba a reducir la ventana del navegador alrededor de uno de los ejemplos
anteriores, o a colocar un tooltip cerca de la parte superior de una página con scroll, para verlo
cambiar de lado.

::: tip Detalle de implementación
`observeTrigger()` se ejecuta tanto en `onMounted` como de nuevo en un `watch` sobre el estado
interno `showTooltip` (es decir, cada vez que el tooltip se muestra), sin comprobar si ya existe un
observador. En la práctica esto puede crear más de una instancia de `IntersectionObserver` a lo
largo de la vida del componente. Es un detalle de implementación conocido, no algo que esta página
pretenda sortear.
:::

## Props

| Prop       | Tipo                                          | Por defecto | Descripción                                                                 |
| ---------- | ---------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `content`  | `string`                                        | —       | **Obligatoria.** Texto mostrado dentro de la caja del tooltip.              |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'`        | `'top'` | Posición inicial. Cambia automáticamente al lado opuesto del mismo eje si no hay suficiente espacio de viewport (consulta [Reposicionamiento automático](#reposicionamiento-automatico)). |

## Emits

Ninguno.

## Slots

| Slot      | Descripción                                                                 |
| --------- | ------------------------------------------------------------------------------ |
| `content` | El elemento disparador que muestra el tooltip al pasar el ratón. **No** es el texto del tooltip: ese es la prop `content`. La prop y el slot comparten nombre pero contienen cosas distintas; no los confundas. |

## Accesibilidad

- No hay ningún cableado ARIA explícito: la caja del tooltip no tiene `role="tooltip"`, y el
  disparador no tiene un `aria-describedby` que apunte a ella. Quien usa un lector de pantalla no
  recibe ningún equivalente del tooltip visual de hover.
- El tooltip solo se abre con `mouseenter`/`mouseleave` del disparador: no hay disparador por
  teclado (focus/blur), así que su contenido resulta inalcanzable solo con navegación por teclado.
- Si el tooltip transmite información que no está disponible en otro sitio, quien lo consume debe
  aportar hoy por hoy su propia alternativa accesible (p. ej. una descripción oculta visualmente, o
  un `aria-label` en el disparador) en lugar de confiar en este componente para ese fin.
