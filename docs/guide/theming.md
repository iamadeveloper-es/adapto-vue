# Estilos y theming

Adapto UI no tiene un build de CSS estático: todos los estilos —tokens globales, estilos base y la
hoja de estilos propia de cada componente— se inyectan en el `<head>` en tiempo de ejecución al
instalar [`AdaptoPlugin`](../../src/lib/plugin.ts) y conforme los componentes se renderizan. Esta
página explica cómo funciona esa tubería y cómo controlar el modo claro y oscuro.

## Cómo llegan los estilos a la página

- **`src/core/`** es el motor: normaliza los tokens del tema a custom properties CSS e inserta
  etiquetas `<style>` en el documento. No depende de Vue.
- **`AdaptoPlugin.install()`** llama una vez a `initFramework()`, que inyecta dos bloques globales:
  la hoja `tokens` (todas las custom properties `--adapto-*`) y la hoja `main` (resets y clases
  utilitarias). También registra las directivas `v-ripple`/`v-click-outside` y expone los helpers
  del framework mediante `provide('fw', fw)`.
- **Los estilos por componente no forman parte de ese bundle global.** Cada componente `adpt-*`
  importa su propio `style.scss` y lo inyecta la primera vez que se renderiza, vía `useStyle()`:

  ```ts
  import { useStyle } from '@/lib/composables/useStyle'
  import css from './style.scss?raw'

  useStyle('button', css)
  ```

  `useStyle()` llama al mismo `injectCSS()` que se usa internamente para los bloques globales,
  indexado por `${prefix}:${moduleId}` para no insertar dos veces el mismo bloque. El efecto
  práctico: un componente que nunca renderizas nunca inyecta su CSS, y el bundler puede descartar el
  módulo por completo porque la librería declara `"sideEffects": false`.

## Tokens y helpers

Los tokens del tema vienen en tres capas, definidas en [`Atlas`](../../src/core/themes/Atlas.ts) y
normalizadas por `initFramework()` a custom properties planas:

| Capa        | Ejemplo de origen                        | Variable CSS resultante      |
| ----------- | ---------------------------------------- | ---------------------------- |
| Primitiva   | `green.500`                              | `--adapto-green-500`         |
| Semántica   | `primary.500` (→ `green.500`)            | `--adapto-primary-500`       |
| Componente  | `btn.bg` (→ `sm.primary.100`)            | `--adapto-btn-bg`             |

Los tokens semánticos y de componente se emiten como referencias `var(...)` a la capa inferior, en
lugar de como valores resueltos, de modo que cambiar una variable primitiva o semántica en tiempo de
ejecución se propaga en cascada a todo lo que dependa de ella. Esto es justo lo que hace posible el
modo oscuro sin reinyectar ninguna hoja de estilos de componente.

Dentro de un componente, [`useFramework()`](../../src/lib/composables/useFramework.ts) expone tres
helpers construidos sobre el `prefix` configurado:

| Helper           | Ejemplo                           | Resultado                            |
| ----------------- | --------------------------------- | ------------------------------------ |
| `fw.cx(...names)` | `fw.cx('btn', 'primary')`         | `'adapto-btn adapto-primary'`        |
| `fw.cv(name)`      | `fw.cv('color-primary')`          | `'var(--adapto-color-primary)'`      |
| `fw.getVar(name)`  | `fw.getVar('color-primary')`      | el valor calculado leído de `:root`  |

## Modo oscuro

`Atlas` define un modo `dark` junto a sus tokens base (claros):

```ts
// src/core/themes/Atlas.ts
export const Atlas: ThemeOptions = {
  // ...
  darkModeSelector: 'dark-mode',
  modes: {
    light: { semantic: {} },
    dark: {
      semantic: {
        primary: { 50: 'green.950', /* ... */ 950: 'green.50' },
        // ...
      },
    },
  },
}
```

`initFramework()` normaliza `modes.dark.semantic` igual que los tokens base, y lo inyecta como un
segundo bloque acotado bajo el selector configurado, justo después del bloque `:root`:

```css
:root {
  --adapto-primary-100: var(--adapto-green-100);
  --adapto-btn-bg: var(--adapto-primary-100);
  /* ... */
}

.dark-mode {
  --adapto-primary-100: var(--adapto-green-900);
  /* ... */
}
```

Como los tokens de componente como `--adapto-btn-bg` referencian `--adapto-primary-100` en lugar de
un color resuelto, añadir la clase `dark-mode` al `<html>` reapunta todas las variables dependientes
por la cascada CSS normal: ningún componente necesita saber que existe el modo oscuro.

### Alternar el modo

Una vez instalado `AdaptoPlugin`, el modo oscuro puede controlarse desde cualquier punto de la
aplicación consumidora, sin necesidad de un componente Vue:

```ts
import { applyThemeMode, getSystemThemeMode, getStoredThemeMode, storeThemeMode } from 'adapto-ui'

// Aplica un modo de inmediato (por defecto usa el darkModeSelector de Atlas, 'dark-mode')
applyThemeMode('dark')

// Persiste la elección para futuras cargas de página (por defecto usa el prefix de Atlas, 'adapto')
storeThemeMode('dark')

// Lee lo que se guardó, o cae en la preferencia del sistema operativo
const mode = getStoredThemeMode() ?? getSystemThemeMode()
```

Son funciones planas de `src/core/theme-mode.ts`: sin Vue, sin reactividad, seguras de llamar
durante el arranque de la app (p. ej. en `main.ts`, antes del montaje) tanto como desde manejadores
de eventos.

`initFramework()` ya ejecuta esta lógica una vez al instalarse, aplicando el modo previamente
guardado o, si no había ninguno, el `prefers-color-scheme` del sistema. Así, quien vuelve a visitar
la página ve el modo correcto antes de que se renderice ningún componente.

### Dentro de un componente

[`useFramework()`](../../src/lib/composables/useFramework.ts) expone el mismo comportamiento ligado
al `prefix`/`darkModeSelector` configurados en la app, práctico para construir un interruptor:

```vue
<script setup lang="ts">
import { useFramework } from '@/lib/composables/useFramework'

const fw = useFramework()
</script>

<template>
  <button @click="fw.toggleMode()">Cambiar tema</button>
</template>
```

| Método                | Descripción                                                                 |
| ---------------------- | ----------------------------------------------------------------------------- |
| `fw.setMode(mode)`      | Aplica `'light'` o `'dark'` y lo persiste.                                   |
| `fw.toggleMode()`       | Alterna entre claro y oscuro según la clase que tenga `<html>` en ese momento. |
| `fw.getInitialMode()`   | El modo guardado, o la preferencia del sistema si aún no hay nada guardado.  |

### `prefix` o `darkModeSelector` personalizados

Si la aplicación instala el plugin con un `prefix` o un `darkModeSelector` distintos de los de
serie:

```ts
app.use(AdaptoPlugin, { prefix: 'myapp', darkModeSelector: 'theme-dark' })
```

las funciones independientes necesitan que se les pasen esos mismos valores explícitamente, ya que
no pueden leer por sí solas las opciones de instalación del plugin:

```ts
applyThemeMode('dark', 'theme-dark')
storeThemeMode('dark', 'myapp')
getStoredThemeMode('myapp')
```

`fw.setMode()`/`fw.toggleMode()` a través de `useFramework()` no lo necesitan: ya llevan cerrada la
configuración real de la app.

::: warning No hace falta que protejas el SSR por tu cuenta
Todas las funciones de `theme-mode.ts` ya no hacen nada cuando `document`/`window`/`localStorage`
no están disponibles, así que es seguro importarlas en un punto de entrada SSR. Simplemente no
actúan hasta que se ejecutan en un navegador.
:::
