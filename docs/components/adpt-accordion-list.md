# Accordion List

`adpt-accordion-list` es un contenedor ligero de coordinación para elementos
[`AdaptoAccordion`](./adpt-accordion). No tiene estilo visual propio —renderiza un `<div>` sin más
alrededor del contenido de su slot— y existe únicamente para aportar estado compartido de modo que
solo un acordeón hijo pueda estar abierto a la vez.

- **Nombre del componente:** `AdaptoAccordionList`
- **Fuente:** `src/lib/components/element/adpt-accordion-list/index.vue`
- **Estilos:** ninguno (no hay `style.scss`; este componente solo renderiza un `<div>` contenedor)

## Uso

Una vez instalado [`AdaptoPlugin`](../../src/lib/plugin.ts) en la aplicación,
`AdaptoAccordionList` está disponible de forma global. Envuelve en él dos o más elementos
`AdaptoAccordion` para enlazarlos entre sí:

```vue-html
<AdaptoAccordionList>
  <AdaptoAccordion title="Primer elemento">
    Contenido del primer elemento.
  </AdaptoAccordion>
  <AdaptoAccordion title="Segundo elemento">
    Contenido del segundo elemento.
  </AdaptoAccordion>
</AdaptoAccordionList>
```

`AdaptoAccordionList` no acepta props ni emite eventos: funciona exclusivamente a través del
contenido del slot y de un contexto interno de `provide`/`inject`.

## Coordinación de apertura única

`AdaptoAccordionList` provee un contexto de inyección `AccordionKey`: un ref `opened` (el `id` del
acordeón abierto en ese momento, o `null`), una bandera `isList: true` y una función `toggle(id)`.
Cada `AdaptoAccordion` hijo inyecta este contexto (y recurre a su propio `modelValue` local cuando
no existe una lista ancestro) y llama a `toggle(id)` en lugar de gestionar su estado de apertura.

Abrir un acordeón de la lista cierra el que estuviera abierto antes, y volver a hacer clic en el
título del acordeón abierto lo cierra, dejando ninguno abierto. Pruébalo aquí:

<div class="demo" style="display: block;">
  <AdaptoAccordionList>
    <AdaptoAccordion title="¿Qué es Adapto UI?">
      Una librería de componentes Vue 3 + TypeScript instalable como plugin, con un sistema de theming basado en tokens.
    </AdaptoAccordion>
    <AdaptoAccordion title="¿Cómo funciona el theming?">
      Los estilos se generan a partir de un tema base (Atlas) fusionado con overrides, y se inyectan en tiempo de ejecución como custom properties CSS.
    </AdaptoAccordion>
    <AdaptoAccordion title="¿Se pueden deshabilitar los acordeones?">
      Sí, cada AdaptoAccordion acepta su propia prop `disabled` con independencia de la lista.
    </AdaptoAccordion>
  </AdaptoAccordionList>
</div>

```vue-html
<AdaptoAccordionList>
  <AdaptoAccordion title="¿Qué es Adapto UI?">
    Una librería de componentes Vue 3 + TypeScript instalable como plugin, con un sistema de theming basado en tokens.
  </AdaptoAccordion>
  <AdaptoAccordion title="¿Cómo funciona el theming?">
    Los estilos se generan a partir de un tema base (Atlas) fusionado con overrides, y se inyectan en tiempo de ejecución como custom properties CSS.
  </AdaptoAccordion>
  <AdaptoAccordion title="¿Se pueden deshabilitar los acordeones?">
    Sí, cada AdaptoAccordion acepta su propia prop `disabled` con independencia de la lista.
  </AdaptoAccordion>
</AdaptoAccordionList>
```

::: tip Sin lista
Un `AdaptoAccordion` renderizado fuera de un `AdaptoAccordionList` sigue funcionando: recurre a su
propio v-model local `modelValue`/`update:modelValue`, abriéndose y cerrándose con independencia de
los acordeones hermanos. Consulta la página de [Accordion](./adpt-accordion) para ese uso autónomo.
:::

## Props

Ninguna. `AdaptoAccordionList` no declara props.

## Emits

Ninguno. `AdaptoAccordionList` no declara emits.

## Slots

| Slot      | Descripción                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------- |
| `default` | Espera uno o más hijos `AdaptoAccordion`. No hay contenido de respaldo si se deja vacío.          |

## Accesibilidad

`AdaptoAccordionList` no lleva atributos ARIA propios: es un `<div>` plano y sin estilos usado solo
para compartir vía `provide`/`inject` el estado de acordeón único abierto. Todo el marcado
accesible (el `<button>` que alterna, el panel de contenido con `role="region"`) vive en cada
`AdaptoAccordion` individual; consulta la sección de accesibilidad de ese componente para los
detalles. El comportamiento de apertura única que coordina se corresponde con el patrón de teclado
y lector de pantalla esperado en un grupo de acordeones estándar, donde abrir un panel cierra los
demás.
