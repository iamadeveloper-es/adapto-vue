<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'

const fw = useFramework()

useStyle('progress-bar', css)

const cmpClass = fw.cx('progress-bar')

defineOptions({
  name: 'AdaptoProgressBar',
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 4
  },
  valuemax: {
    type: Number,
    default: 100
  },
  valuemin: {
    type: Number,
    default: 0
  },
  ariaLabel: {
    type: String,
    default: 'Barra de progreso'
  },
  showValue: {
    type: Boolean,
    default: true
  },
  indeterminate: {
    type: Boolean,
    default: false
  }
})

const setValue = computed(() =>
  Math.min(Math.max(props.modelValue, props.valuemin), props.valuemax)
)

const percentage = computed(() => {
  const range = props.valuemax - props.valuemin

  if (range <= 0) return 0

  return (setValue.value - props.valuemin) / range
})

const computedClasses = computed(() => [
  cmpClass,
  {[`${cmpClass}--indeterminate`]: props.indeterminate}
])

const setProgressStyle = computed(() => [
  `--${cmpClass}-value:${percentage.value}`,
  {height: props.height >= 4 ? `${props.height}px` : '4px'}
])

const setProgressIndicatorStyle = computed(() => {
  if (props.showValue)
    return [
      `--${cmpClass}-width-indicator:${setValue.value}%`,
      `--${cmpClass}-value-indicator:-${setValue.value / 2}%`
    ]
  return false
})

//{`${cmpClass}--indeterminate`: indeterminate}


</script>

<template>
  <div role="range" :class="computedClasses" :style="setProgressStyle"
    :aria-valuemax="valuemax" :aria-valuenow="setValue" :aria-label="ariaLabel" :valuemin="valuemin">
    <span v-if="showValue && !indeterminate" :class="`${cmpClass}__indicator`" :style="setProgressIndicatorStyle">{{ setValue }}%</span>
  </div>
</template>
