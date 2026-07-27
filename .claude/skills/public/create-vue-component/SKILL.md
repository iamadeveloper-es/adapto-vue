---
name: create-vue-component
description: Genera un componente Vue dentro de src/lib/components/<categoría>/ con la estructura esperada por el repositorio.
---

# Crear un componente Vue

Cuando se te pida crear un componente Vue en este repositorio, sigue estas reglas:

1. Crea el componente en `src/lib/components/<categoría>/adpt-<component-name>/index.vue`. Los
   componentes viven bajo una carpeta de categoría — hoy existen `element/`, `form/` y `overlay/`.
   Elige la que corresponda; si ninguna encaja, propón una nueva al usuario antes de crearla.
2. Usa un nombre de carpeta en kebab-case con el prefijo `adpt-`.
3. El archivo `index.vue` solo contiene bloque de script y bloque de template, en ese orden. Los
   estilos no van en un bloque `<style>` del componente.
4. Prefiere `<script setup lang="ts">` para la sección de script.
5. Usa `defineOptions({ name: 'Adapto<Nombre>' })` siguiendo el patrón de nombre de los
   componentes existentes.
6. Mantén el componente simple, tipado (evita `any`) y alineado con el estilo de la librería.
7. Si el componente necesita utilidades del framework, importa `useFramework` con el alias
   `@/lib/composables/useFramework` — es lo que usan los componentes más recientes
   (`adpt-checkbox`, `adpt-radio`, `adpt-card`, `adpt-avatar`).
8. Si el componente necesita estilos propios, créalos en un `style.scss` junto a `index.vue` y
   regístralo en el array `styles` de `src/lib/plugin.ts` (ver cómo lo hacen `adpt-button` y
   `adpt-dialog`).
9. No modifiques App.vue ni main.ts a menos que el usuario lo pida explícitamente.
10. Responde siempre en español.

## Esqueleto esperado del archivo

```vue
<script setup lang="ts">
import { useFramework } from '@/lib/composables/useFramework'

const fw = useFramework()
const cmpClass = fw.cx('component-name')

defineOptions({
  name: 'Adapto<Nombre>',
})
</script>

<template>
  <div :class="cmpClass">
    <!-- markup -->
  </div>
</template>
```

Si el componente tiene estilos propios, añade junto a `index.vue` un `style.scss`:

```scss
.fw-component-name {
  /* styles */
}
```

y regístralo en `src/lib/plugin.ts` — fíjate en que la ruta del import incluye la categoría:

```ts
import componentName from './components/<categoría>/adpt-component-name/style.scss?raw'
// ...
styles: [
  // ...
  { id: 'component-name', css: componentName },
]
```

## Guía adicional

- Mantén la API pequeña y fácil de componer.
- Prefiere un markup accesible y HTML semántico.
- Sigue las convenciones del ejemplo del botón en
  `src/lib/components/element/adpt-button/index.vue`.
- Si el usuario necesita un comportamiento concreto, implementa una versión por defecto sensata y
  fácil de extender.

## Después de crear el componente

El componente nuevo no tiene tests ni documentación. Ofrécelos como paso siguiente explícito, sin
ejecutarlos por tu cuenta:

- `component-test-writer` para la cobertura unitaria.
- La skill `component-docs` para su página de VitePress.
- La skill `component-review` para la revisión de calidad puntuada.
