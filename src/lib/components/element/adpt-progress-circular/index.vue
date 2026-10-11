<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import type { Size } from '@/lib/types/globals'

const fw = useFramework()

useStyle('progress-circular', css)

const cmpClass = fw.cx('progress-circular')

defineOptions({
  name: 'AdaptoProgressCircular',
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  size: {
    type: String as PropType<Size>,
    default: 'md',
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  width: {
    type: Number,
    default: 4,
  },
  color: {
    type: String,
    default: '',
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: 'Progreso de la operación',
  },
})

const sizeMap: Record<Size, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

const diameter = computed(() => sizeMap[props.size] ?? sizeMap.md)
const center = computed(() => diameter.value / 2)
const radius = computed(() => Math.max((diameter.value - props.width) / 2, 0))
const circumference = computed(() => 2 * Math.PI * radius.value)

const setValue = computed(() => {
  const value = Number(props.modelValue)
  if (Number.isNaN(value)) return 0
  return Math.min(Math.max(value, 0), 100)
})

const dashOffset = computed(() => circumference.value * (1 - setValue.value / 100))

// Arco fijo visible mientras gira, propio del patrón de spinner indeterminado.
const indeterminateDashOffset = computed(() => circumference.value * 0.75)

const computedClasses = computed(() => [
  cmpClass,
  `${cmpClass}--${props.size}`,
  props.indeterminate ? `${cmpClass}--indeterminate` : '',
])

const valueStyle = computed(() => (props.color ? { stroke: fw.cv(props.color) } : undefined))
</script>

<template>
  <div
    :class="computedClasses"
    :style="{ [`--${fw.prefix}-progress-circular-size`]: `${diameter}px` }"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="indeterminate ? undefined : setValue"
    :aria-label="ariaLabel">
    <svg
      :viewBox="`0 0 ${diameter} ${diameter}`"
      :width="diameter"
      :height="diameter"
      :class="`${cmpClass}__svg`"
      aria-hidden="true">
      <circle
        :class="`${cmpClass}__track`"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="width"
        fill="none" />
      <circle
        :class="`${cmpClass}__value`"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="width"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="indeterminate ? indeterminateDashOffset : dashOffset"
        :style="valueStyle"
        fill="none" />
    </svg>
    <span v-if="showLabel && !indeterminate" :class="`${cmpClass}__label`" aria-hidden="true">{{ setValue }}%</span>
  </div>
</template>
