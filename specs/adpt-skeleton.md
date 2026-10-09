# Especificación — Componente `adpt-skeleton`

## 1. Contexto y objetivo

**Historia de usuario original:**

> Quiero crear un componente skeleton. El componente tiene la finalidad de mostrar un estado de carga en la aplicación. Proveé al usuario un estado de carga que le indica que el contenido se está cargando y estará disponible pronto. El componente debe poder configurarse para poder establecer un ancho, un alto, redondear los bordes hasta que sea redondo, redondear los bordes de manera custom. A la hora de utilizar el componente cuando esté creado, la implementación y uso debe ser lo más sencilla posible. El componente debe cumplir todas las reglas de accesibilidad. El componente debe permitir la customización del color de fondo. Debe poder tener al menos dos opciones de animación, una por defecto.

**Actores:**

- *Desarrollador/a integrador/a*: quien agrega `adpt-skeleton` a una pantalla mientras el contenido real todavía no está disponible.
- *Usuario final*: quien percibe el placeholder (visual o vía lector de pantalla) y entiende que el contenido se está cargando.

**Objetivo:** componente de presentación, simple de usar y totalmente accesible, que represente un estado de carga configurable en tamaño, forma y animación.

## 2. Alcance y fuera de alcance

**Dentro de alcance:** placeholder configurable en ancho, alto, color de fondo, redondeo (predefinido y custom) y animación (`pulse`/`wave`/`none`); texto accesible incorporado; respeto de `prefers-reduced-motion`; uso sin props como caso válido.

**Fuera de alcance:** gestión de datos/carga real, slot con contenido real, variante de múltiples líneas en una instancia, i18n del texto accesible por defecto.

## 3. Flujo principal y alternativos

1. El desarrollador agrega `<AdaptoSkeleton />` sin props → placeholder por defecto, con anuncio accesible.
2. Cuando el contenido real llega, el desarrollador lo reemplaza (fuera del componente).

Alternativos: ajustar `width`/`height`; `rounded="full"`; niveles predefinidos de `rounded`; `borderRadius` custom con prioridad sobre `rounded`; `color` custom; animación `wave` o `none`; texto accesible personalizado; desactivación automática por `prefers-reduced-motion`; múltiples instancias para varias líneas.

## 4. Reglas de negocio

1. Puramente presentacional, sin gestión de datos.
2. Defaults: ancho 100%, alto de una línea, `rounded="none"`, color neutro del tema, animación `pulse`.
3. `width`/`height`: número (px) o string con unidad.
4. `rounded`: `none | sm | md | lg | full`.
5. `borderRadius` custom tiene prioridad sobre `rounded`.
6. `color` sobreescribe el default.
7. `animation`: `pulse | wave | none`.
8. `prefers-reduced-motion` desactiva la animación sin importar la prop.
9. Texto accesible con `role="status"` / `aria-live="polite"`, default y personalizable.
10. Placeholder visual con `aria-hidden="true"`.
11. Sin slot de contenido real.
12. Sin variante de repetición múltiple.

## 5. Errores y vacíos

Sin estados de error de red/datos. Valores inválidos en cualquier prop caen al default correspondiente sin romper el render. Único mensaje al usuario final: texto accesible, default **"Cargando contenido"**.

## 6. Escenarios BDD (Gherkin)

```gherkin
# language: es
Característica: Mostrar un estado de carga con el componente skeleton
  Como desarrollador que integra adapto-ui
  quiero crear un componente skeleton configurable
  para proveer al usuario un estado de carga que le indique que el contenido se está cargando
  y estará disponible pronto

  @happy-path @A1 @A2 @A3
  Escenario: Mostrar el placeholder por defecto sin configurar propiedades
    Dado que el desarrollador agrega el componente skeleton sin indicar ninguna propiedad
    Cuando la pantalla se renderiza mientras el contenido real todavía no está disponible
    Entonces el usuario ve un placeholder rectangular con el tamaño y la animación por defecto
    Y el placeholder no muestra contenido real ni acepta contenido interno

  @alternativo @A1
  Escenario: El padre decide cuándo reemplazar el skeleton por el contenido real
    Dado que el desarrollador muestra el skeleton mientras los datos reales todavía no llegaron
    Cuando los datos reales terminan de cargar
    Entonces el desarrollador reemplaza el skeleton por el contenido real
    Y el componente skeleton no participa en la decisión de cuándo ocurre ese cambio

  @alternativo @A4 @A5
  Esquema del escenario: Configurar ancho y alto del placeholder
    Dado que el desarrollador configura el skeleton con un ancho de "<ancho>" y un alto de "<alto>"
    Cuando la pantalla se renderiza
    Entonces el placeholder ocupa exactamente ese ancho y ese alto

    Ejemplos:
      | ancho | alto |
      | 200px | 20px |
      | 50%   | 2rem |

  @alternativo @A5
  Escenario: Omitir ancho y alto usa los valores por defecto
    Dado que el desarrollador no configura ni ancho ni alto
    Cuando la pantalla se renderiza
    Entonces el placeholder ocupa el 100% del ancho del contenedor
    Y el placeholder tiene una altura equivalente a una línea de texto

  @alternativo @A6
  Escenario: Redondear completamente los bordes para simular un círculo
    Dado que el desarrollador configura el skeleton con el redondeo "full"
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra completamente redondeado, como un círculo o píldora

  @alternativo @A6
  Esquema del escenario: Aplicar un nivel de redondeo predefinido
    Dado que el desarrollador configura el skeleton con el redondeo "<nivel>"
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra con ese nivel de redondeo de bordes

    Ejemplos:
      | nivel |
      | none  |
      | sm    |
      | md    |
      | lg    |

  @alternativo @A7
  Escenario: Personalizar el redondeo de bordes de forma custom
    Dado que el desarrollador configura el skeleton con un valor de borde custom
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra con ese redondeo custom en lugar de cualquier nivel predefinido

  @alternativo @A7
  Escenario: El redondeo custom tiene prioridad sobre el nivel predefinido
    Dado que el desarrollador configura el skeleton con un nivel de redondeo predefinido y además con un redondeo custom
    Cuando la pantalla se renderiza
    Entonces el placeholder respeta el redondeo custom e ignora el nivel predefinido

  @alternativo @A8
  Escenario: Personalizar el color de fondo del placeholder
    Dado que el desarrollador configura el skeleton con un color de fondo propio
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra con ese color de fondo en lugar del color neutro por defecto

  @alternativo @A8
  Escenario: Omitir el color de fondo usa el color neutro por defecto
    Dado que el desarrollador no configura ningún color de fondo
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra con el color neutro definido por el tema

  @alternativo @A9
  Esquema del escenario: Elegir el tipo de animación del placeholder
    Dado que el desarrollador configura el skeleton con la animación "<animacion>"
    Cuando la pantalla se renderiza
    Entonces el placeholder anima su carga con el efecto "<animacion>"

    Ejemplos:
      | animacion |
      | pulse     |
      | wave      |

  @alternativo @A9
  Escenario: Desactivar la animación explícitamente
    Dado que el desarrollador configura el skeleton con la animación "none"
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra de forma estática, sin ningún efecto de animación

  @A10
  Escenario: Respetar la preferencia de reducir movimiento del sistema
    Dado que el usuario final tiene activada la preferencia de "reducir movimiento" en su sistema
    Y el desarrollador configuró el skeleton con la animación "pulse" o "wave"
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra sin animación, aunque la propiedad indique una animación activa

  @A11 @A13
  Escenario: El placeholder es accesible para lectores de pantalla
    Dado que el desarrollador agrega el componente skeleton con su configuración por defecto
    Cuando un lector de pantalla recorre la pantalla mientras el contenido carga
    Entonces el lector de pantalla anuncia el texto "Cargando contenido"
    Y el lector de pantalla no lee la estructura interna del placeholder visual

  @alternativo @A12
  Escenario: Personalizar el texto accesible del estado de carga
    Dado que el desarrollador configura el skeleton con un texto accesible propio, por ejemplo "Cargando perfil del usuario"
    Cuando un lector de pantalla recorre la pantalla mientras el contenido carga
    Entonces el lector de pantalla anuncia "Cargando perfil del usuario" en lugar del texto por defecto

  @error @A4
  Esquema del escenario: Valores inválidos de dimensiones, redondeo o animación caen al valor por defecto
    Dado que el desarrollador configura el skeleton con un valor inválido de "<propiedad>" igual a "<valor>"
    Cuando la pantalla se renderiza
    Entonces el placeholder se muestra con el valor por defecto de esa propiedad
    Y la aplicación no se rompe ni muestra un error al usuario final

    Ejemplos:
      | propiedad | valor   |
      | width     | -10px   |
      | rounded   | diamond |
      | animation | spin    |

  @A14
  Escenario: El componente no acepta contenido real dentro de sí mismo
    Dado que el desarrollador intenta insertar contenido dentro del componente skeleton
    Cuando la pantalla se renderiza
    Entonces el skeleton ignora ese contenido y solo muestra el placeholder visual

  @A15
  Escenario: Mostrar varias líneas de carga requiere varias instancias
    Dado que el desarrollador quiere mostrar tres líneas de placeholder
    Cuando agrega tres instancias del componente skeleton una debajo de la otra
    Entonces el usuario ve tres placeholders independientes
    Y no existe una propiedad del componente para generar múltiples líneas con una sola instancia
```

## 7. Notas técnicas (preparadas para implementación)

- Ruta: `src/lib/components/element/adpt-skeleton/index.vue` + `style.scss`, inyectado con `useStyle('skeleton', css)` (no se registra en `plugin.ts`).
- Export público: `AdaptoSkeleton` en `src/lib/index.ts`; `defineOptions({ name: 'AdaptoSkeleton' })`.
- Props tipadas con `PropType`; `rounded`/`animation` con `validator` (patrón `adpt-avatar`).
- Animaciones como clases modificadoras con `@keyframes`; `prefers-reduced-motion` resuelto en SCSS.
- Color default vía token neutro del tema `Atlas`; `color` sobreescribe por variable CSS inline.
- Texto accesible: `span` sr-only con `role="status"`/`aria-live="polite"`.
- Tests en `tests/lib/components/element/adpt-skeleton/index.spec.ts` (sin verificación de animación por la limitación conocida de `style.scss?raw` en vitest).
