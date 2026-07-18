# Documentación de la carpeta src

Esta carpeta contiene la lógica central de la librería UI que se está construyendo. El objetivo principal es ofrecer un conjunto de utilidades y componentes que puedan ser usados desde una aplicación Vue mediante un plugin de instalación.

## Visión general

La arquitectura actual es bastante simple y está orientada a tres responsabilidades principales:

1. Inicializar el framework y sus estilos.
2. Exponer utilidades compartidas para generar clases y variables CSS.
3. Proveer componentes base que consuman esas utilidades.

La idea general es que, cuando la aplicación instala el plugin, se inyecten los estilos base y se deje disponible un objeto con helpers para que los componentes puedan trabajar con un prefijo configurable.

## Flujo de funcionamiento de la librería

El flujo real de la librería es el siguiente:

1. La aplicación Vue instala el plugin `AdaptoPlugin`.
2. El plugin llama a `initFramework()` con las opciones recibidas.
3. `initFramework()` inyecta:
   - los tokens CSS base,
   - los estilos generales de la librería,
   - y devuelve un objeto de utilidades.
4. Ese objeto se expone a la app con `app.provide('fw', fw)`.
5. Los componentes pueden consumir esas utilidades usando `useFramework()`.

En términos prácticos, la librería no tiene todavía una arquitectura muy amplia: funciona como una capa ligera de helpers + estilos + un componente de ejemplo.

## Estructura de archivos

### Carpeta core

Esta carpeta contiene la lógica de inicialización y la inyección de CSS.

#### `core/create-utils.ts`

Responsable de crear el objeto de utilidades que se expone al framework.

Funciones que aporta:

- `cx(...names)`: genera nombres de clase con el prefijo configurado. Por ejemplo, `cx('btn')` devuelve algo como `app-btn`.
- `cv(name)`: devuelve una referencia a una variable CSS en formato `var(--prefix-name)`.
- `getVar(name)`: lee el valor real de una custom property del `:root` del documento.

Este archivo es la base de la API de helpers que usan los componentes.

#### `core/init.ts`

Es el punto central de inicialización del framework.

Hace lo siguiente:

- recibe opciones como `prefix` y `tokens`;
- inyecta los tokens CSS definidos en `styles/sass/tokens.scss`;
- inyecta el CSS base de la librería desde `styles/sass/main.scss`;
- devuelve un objeto de utilidades generado por `createUtils()`.

Es el archivo que conecta la configuración del consumidor con la inyección de estilos y la creación de helpers.

#### `core/inject-css.ts`

Contiene la lógica para insertar estilos dinámicamente en el DOM.

Responsabilidades:

- evitar inyectar el mismo bloque CSS más de una vez con un `Set` llamado `injected`;
- crear etiquetas `<style>` en el `<head>`;
- reemplazar el marcador `__FW__` por el prefijo real configurado;
- parsear los tokens de CSS y combinarlos con overrides del consumidor.

Este archivo permite que la librería no dependa de un archivo de estilos estático cargado manualmente, sino que lo inserte en tiempo de ejecución.

## Carpeta lib

Aquí está la API pública de la librería y los componentes que la consumen.

### `lib/index.ts`

Es el punto de exportación principal. Actualmente re-exporta el plugin:

- `export { AdaptoPlugin } from './plugin.ts'`

Esto hace que la librería pueda exponerse como un módulo principal desde el paquete.

### `lib/plugin.ts`

Define el plugin de Vue.

Su comportamiento es simple:

- implementa `install(app, options)`;
- llama a `initFramework(options)`;
- guarda el resultado en `app.provide('fw', fw)`.

Este es el puente entre Vue y la lógica interna de la librería. Una vez instalado, cualquier componente hijo de la app puede acceder a las utilidades del framework.

### `lib/composables/useFramework.ts`

Composable que permite leer las utilidades expuestas por el plugin.

Funcionamiento:

- usa `inject('fw')` de Vue;
- si no existe el valor, lanza un error indicando que el plugin no está instalado;
- devuelve el objeto de utilidades.

Este composable es el mecanismo usado por los componentes para consumir el contexto del framework sin depender de props o de una importación directa del plugin.

### `lib/components/button/index.vue`

Componente de ejemplo que muestra cómo se consume la lógica de la librería.

Lo que hace:

- importa `useFramework()`;
- obtiene el helper `fw`;
- usa `fw.cx('btn', ...)` para construir una clase con prefijo.

En el template actual se genera una clase para el botón usando el sistema de prefijos. Es un ejemplo claro de cómo integrar el helper dentro de un componente.

## Estilos

La carpeta `styles` contiene los recursos CSS/Sass usados por la librería.

### `styles/sass/main.scss`

Define variables globales de layout, spacing y contenedores. Estas se inyectan como custom properties en el `:root` del documento.

### `styles/sass/tokens.scss`

Define los tokens base de la librería, como colores primarios y secundarios. Son usados como valores por defecto para las variables CSS.

### `styles/css/tokens.css`

Archivo CSS similar al anterior. En la lógica actual no parece ser usado directamente por el flujo de inicialización, que prioriza el archivo Sass.

## Resumen del modelo mental

Si se resume la librería en una sola idea, sería esta:

- el plugin instala la librería;
- el plugin inicializa estilos y helpers;
- los helpers se exponen a través de `provide/inject`;
- los componentes consumen esos helpers para construir clases y variables CSS con un prefijo configurable.

## Puntos a tener en cuenta

- La librería está todavía en una fase muy inicial.
- La implementación actual es más un framework de utilidades base que una librería completa de componentes.
- El componente de botón es un ejemplo simple y todavía no está totalmente integrado con props o variantes más complejas.
- El sistema de tokens funciona mediante inyección de estilos en el `<head>`, no mediante un build de estilos estático más complejo.
