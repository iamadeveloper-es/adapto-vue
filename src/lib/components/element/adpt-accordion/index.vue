<script lang="ts" setup>
import { computed, inject, onMounted, ref, useId, type PropType } from 'vue';
import { useFramework } from '@/lib/composables/useFramework';
import AdaptoIcon from '../adpt-icon/index.vue'
import { AccordionKey } from '../adpt-accordion-list/index.vue';
import { remToPx } from '@/lib/utils/units.ts';
import type { Icon, Radius, Size, Variant } from '@/lib/types/globals.ts';


const fw = useFramework()

const cmpClass = fw.cx('accordion')

defineOptions({
  name: 'AdaptoAccordion',
})

type AccordionVariant = Extract<Variant, 'outlined' | 'fussy' | 'soft'> | 'default'
const availableVariants = ['outlined', 'fussy', 'soft', 'default']

const props = defineProps({
  variant: {
    type: String as PropType<AccordionVariant>,
    default: 'fussy',
    validator: (value: string) => ['outlined', 'fussy', 'soft', 'default'].includes(value),
  },
  // El color debe ser o un token primitivo o un token semántico
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<Size>,
    default: 'xs'
  },
  radius: {
    type: String as PropType<Radius>,
    default: 'sm'
  },
  title: {
    type: String,
    default: 'Accordion title item'
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Object as PropType<Icon>,
    default: () => ({
      name: 'chevron-down'
    })
  },
  hideIcon:{
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])


const elementRef = ref<HTMLElement | null>(null)
const id = useId()
const accordionList = inject(AccordionKey, null)
const fontSize = ref()

const normalizedVariant = computed((): string => {
  return availableVariants.includes(String(props.variant)) ?
    `${cmpClass}--${props.variant}` : `${cmpClass}--default`
})

const accordionClasses = computed(() => [
  cmpClass,
  normalizedVariant.value,
  {
    'is-list' : accordionList?.isList,
    [`${cmpClass}--${props.size}`] : props.size,
  }
])

const isOpen = computed(() => {
  if (accordionList) {
    return accordionList.opened.value === id
  }

  return props.modelValue
})

const handleIcon = computed(() => {

  const {name, size} = props.icon

  const iconSize = size ? size : remToPx(fontSize.value) + 2

  const icon = {
    name: name,
    size: iconSize
  }

  return icon

})

const getColor = computed(() => props.color ? fw.cv(props.color) : fw.cv('surface-700'))

const toggle = () => {
  if (accordionList) {
    accordionList.toggle(id)
    return
  }
  emit('update:modelValue', !props.modelValue);
}

const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'

function enter(el: Element, done: () => void) {
  const content = el as HTMLElement
  content.style.height = '0'
  content.style.opacity = '0'
  void content.offsetHeight // fuerza reflow
  content.style.transition = `height .3s ${easing}, opacity .3s ${easing}`
  content.style.height = `${content.scrollHeight}px`
  content.style.opacity = '1'

  content.addEventListener(
    'transitionend',
    (event) => {
      if (event.propertyName !== 'height') return
      content.style.height = 'auto'
      done()
    },
    { once: true }
  )
}

function leave(el: Element, done: () => void) {
  const content = el as HTMLElement
  content.style.height = `${content.scrollHeight}px`
  void content.offsetHeight // fuerza reflow
  content.style.transition = `height .3s ${easing}, opacity .3s ${easing}`
  content.style.height = '0'
  content.style.opacity = '0'

  content.addEventListener(
    'transitionend',
    (event) => {
      if (event.propertyName !== 'height') return
      done()
    },
    { once: true }
  )
}

onMounted(() => {
  if (elementRef.value) {
    fontSize.value = getComputedStyle(elementRef.value)
      .getPropertyValue(`--${fw.prefix}-accordion-title-font-size`)
      .trim()
  }
})

</script>

<template>
  <div
  ref="elementRef"
  :id="id"
  :style="{color: getColor}"
  :class="accordionClasses">
    <div
    :class="[`${cmpClass}__item`, {'is-open' : isOpen}]">
      <button
      :class="[`${cmpClass}__title`]"
      :disabled="disabled"
      @click="toggle"
      >{{title}}
        <AdaptoIcon
        v-if="!hideIcon"
        :name="handleIcon?.name"
        :size="handleIcon?.size"
        :class="`${cmpClass}__icon`"/>
      </button>
      <Transition
        :css="false"
        @enter="enter"
        @leave="leave"
      >
        <div
        v-if="isOpen"
        role="region"
        :class="[`${cmpClass}__content`]">
           <slot></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>
