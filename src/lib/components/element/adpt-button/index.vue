<script setup lang="ts">
import { computed, onMounted, ref, type PropType } from 'vue'
import { useFramework } from '../../../composables/useFramework'
import type { Icon, Radius, Size, Variant } from '../../../types/globals.ts'
import AdaptoIcon from '../adpt-icon/index.vue'
import { remToPx } from '@/lib/utils/units.ts'

const fw = useFramework()

const cmpClass = fw.cx('btn')

defineOptions({
  name: 'AdaptoButton',
})

const props = defineProps({
  variant: {
    type: String as PropType<Variant>,
    default: 'soft',
    validator: (value: string) => ['outlined', 'fussy', 'soft', 'soul', 'link'].includes(value),
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
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'Botón',
  },
  hideLabel: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Object as PropType<Icon>,
    default: (() => {})
  },
  iconPrepend: {
    type: Boolean,
    default: false
  },
  disableRipple: {
    type: Boolean,
    default: false
  }
})

const buttonRef = ref<HTMLElement | null>(null)
const fontSize = ref('')

const emit = defineEmits(['clicked'])

const emitValue = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('clicked', event)
}

const computedClasses = computed(() => [
    cmpClass,
    `${cmpClass}--${props.variant}`,
    `${cmpClass}--${props.size}`,
    `rounded--${props.radius}`,
    props.fullWidth ? `${cmpClass}--full-width` : '',
    props.iconPrepend ? `${cmpClass}--icon-prepend` : '',
  ])

const hasIcon = computed(() => props.icon && Object.keys(props.icon).length );

const handleIcon = computed(() => {

  const {name, size} = props.icon

  const iconSize = size ? size : remToPx(fontSize.value) + 4

  const icon = {
    name: name,
    size: iconSize
  }

  return icon

})

const getColor = computed(() => props.color ? fw.cv(props.color) : 'red')

onMounted(() => {
  if (buttonRef.value) {
    fontSize.value = getComputedStyle(buttonRef.value)
      .getPropertyValue(`--${fw.prefix}-btn-font-size`)
      .trim()
  }
})

</script>

<template>
  <button
  ref="buttonRef"
  v-ripple="disableRipple"
  :class="computedClasses"
  :style="{color: getColor}"
  :type="type"
  :disabled="disabled || loading"
  :aria-busy="loading || undefined"
  :aria-label="label"
  @click="emitValue">
    <span
    v-if="loading" :class="`${cmpClass}__spinner`" aria-hidden="true" />
    <AdaptoIcon
    v-if="hasIcon" v-bind="handleIcon"
    :aria-hidden="hasIcon && hideLabel ? true : null" />
    <span
    v-if="!hideLabel" :class="`${cmpClass}__content`">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

