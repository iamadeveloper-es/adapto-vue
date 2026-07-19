# Documentación de la carpeta Core

Esta carpeta concentra la lógica central del framework: inicialización, normalización de tokens y inyección dinámica de estilos en el documento.

## Objetivo

Core es el motor interno de la librería. Aquí se preparan los tokens del tema, se generan las variables CSS y se exponen los helpers que luego usan los componentes.

## Qué hace esta carpeta

La carpeta Core tiene tres responsabilidades principales:

1. Inicializar el framework a partir de un tema y unas opciones de configuración.
2. Normalizar los tokens primitivos, semánticos y de componentes a un formato utilizable por CSS.
3. Insertar estilos y variables en el documento para que la librería funcione en tiempo de ejecución.

## Estructura de archivos

### create-utils.ts

Este archivo crea el objeto de utilidades que se devuelve al iniciar el framework.

#### Funciones y helpers

- `cx(...names)`: genera clases con el prefijo configurado. Ejemplo: `cx('btn')` devuelve `adapto-btn`.
- `cv(name)`: devuelve una referencia CSS en formato `var(--prefix-name)`.
- `getVar(name)`: lee el valor real de una custom property desde `:root`.

#### Uso mental

Este módulo sirve como capa de helpers para que los componentes puedan construir clases y variables CSS sin repetir lógica manual.

### init.ts

Es el punto central de inicialización del framework.

#### Flujo interno

1. Recibe `options` con el prefijo y los tokens del tema.
2. Fusiona los tokens base del tema `Atlas` con los overrides del consumidor.
3. Normaliza los tokens en un formato compatible con CSS.
4. Inyecta esas variables en el documento con `injectTokens()`.
5. Carga los estilos base del framework.
6. Devuelve un objeto de utilidades creado por `createUtils()`.

#### Funciones principales

- `initFramework(options)`: inicializa el framework completo.
- `normalizeTokens(tokens, prefix)`: combina los tokens base con los overrides y los convierte al formato final.
- `normalizePrimitiveTokens(tokens)`: transforma los tokens primitivos anidados en un formato plano tipo `group-variant`.
- `normalizeSemanticTokens(tokens, prefix)`: convierte referencias semánticas a variables CSS con el prefijo del tema.
- `normalizeComponentTokens(tokens, prefix)`: resuelve referencias de componentes a variables CSS o valores estáticos.

### inject-css.ts

Este archivo se encarga de insertar estilos y variables CSS en el DOM.

#### Funciones principales

- `injectCSS(rawCSS, prefix, moduleId)`: añade un bloque de estilos al `<head>` y evita duplicarlo usando un `Set` interno.
- `parseTokens(css, prefix)`: extrae las custom properties de un bloque `:root` y las convierte en un objeto de tokens.
- `injectTokens(rawCSS, prefix, overrides)`: junta los valores por defecto con overrides y genera un nuevo bloque `:root` con variables CSS.

#### Comportamiento importante

- Reemplaza el marcador `__FW__` por el prefijo real configurado.
- Evita inyectar el mismo bloque de estilos más de una vez.
- Permite que los tokens del consumidor sobrescriban los valores base.

### types/index.ts

Define los tipos compartidos que modelan la estructura de los tokens y del tema.

#### Tipos principales

- `PrimitiveTokens`: estructura de los tokens base.
- `SemanticTokens`: estructura de los tokens semánticos.
- `ComponentTokens`: estructura de los tokens de componentes.
- `Tokens`: agrupa los tres grupos anteriores.
- `ThemeOptions`: representa la configuración completa del tema.

## Resumen del flujo real

El flujo de uso de Core es este:

1. El plugin llama a `initFramework()`.
2. `initFramework()` prepara el prefijo y los tokens del tema.
3. `normalizeTokens()` convierte toda la configuración a variables CSS.
4. `injectTokens()` inserta esas variables en el documento.
5. `createUtils()` devuelve los helpers que los componentes pueden usar.

## Conclusión

Core es la capa base que permite que la librería funcione de forma dinámica y configurable. Sin esta carpeta, no existiría la inicialización del tema, ni la generación de clases y variables CSS, ni la inyección de estilos en tiempo de ejecución.
