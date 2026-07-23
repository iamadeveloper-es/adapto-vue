import type { DirectiveBinding } from 'vue';

interface ElWithRippleEffect extends HTMLElement {
  _rippleEffect?: (ev: MouseEvent) => void;
}

export default {
  beforeMount (el: ElWithRippleEffect, binding: DirectiveBinding) {
    // Función que ejecuta el efecto ripple
    const rippleEffect = (ev: MouseEvent): void => {

      const element = el;
      const elementRect = element.getBoundingClientRect();

      const circle = document.createElement('span');

      const diameter = Math.max(elementRect.width, elementRect.height);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${ev.clientX - (elementRect.left + radius)}px`;
      circle.style.top = `${ev.clientY - (elementRect.top + radius)}px`;


      // Eliminar un ripple anterior si existe
      // const ripple = element.getElementsByClassName('ripple-span')[0];
      const ripple = document.getElementsByClassName('ripple-span')[0] || element.getElementsByClassName('ripple-span')[0];
      if (ripple) {
        ripple.remove();
      }

      circle.classList.add('ripple-span');

      element.appendChild(circle);
    };

    // Si el valor de la directiva es true, no aplicar el efecto ripple
    if (binding.value !== true) {
      // Guardar la función rippleEffect en el elemento
      el._rippleEffect = rippleEffect;

      // Añadir el evento de clic para activar el ripple
      el.addEventListener('click', rippleEffect);
    }
  },

  // Limpiar el evento cuando se destruye el componente
  unmounted (el: ElWithRippleEffect) {
    // Si la función rippleEffect fue guardada, remover el evento de clic
    if (el._rippleEffect) {
      el.removeEventListener('click', el._rippleEffect);
      delete el._rippleEffect; // Limpiar la referencia a la función rippleEffect
    }
  }
};
