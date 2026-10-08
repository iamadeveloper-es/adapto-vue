---
layout: home

hero:
  name: Adapto UI
  text: Documentación de la librería de componentes
  tagline: Librería de componentes Vue 3 + TypeScript con un sistema de theming basado en tokens.
  actions:
    - theme: brand
      text: Empezar por los componentes
      link: /components/adpt-button
    - theme: alt
      text: Estilos y theming
      link: /guide/theming

features:
  - title: Theming basado en tokens
    details: Cada componente lee de las custom properties CSS generadas a partir de los tokens del tema Atlas.
  - title: Estilos en tiempo de ejecución
    details: Los estilos globales se inyectan al instalar AdaptoPlugin y los de cada componente en su primer render, sin paso de build de CSS estático.
  - title: Accesible por defecto
    details: Los componentes vienen con marcado semántico, atributos ARIA y soporte de teclado.
---
