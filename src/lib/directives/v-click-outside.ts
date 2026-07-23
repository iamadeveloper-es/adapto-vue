import type { DirectiveBinding, ObjectDirective } from "vue"

interface ClickOutsideEl extends HTMLElement {
  __clickOutsideHandler__?: (event: MouseEvent) => void
}

export const vClickOutside: ObjectDirective = {
  mounted(el: ClickOutsideEl, binding: DirectiveBinding) {
    el.__clickOutsideHandler__ = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener("mousedown", el.__clickOutsideHandler__)
  },
  unmounted(el: ClickOutsideEl) {
    if (el.__clickOutsideHandler__) {
      document.removeEventListener("mousedown", el.__clickOutsideHandler__)
      delete el.__clickOutsideHandler__
    }
  },
}

