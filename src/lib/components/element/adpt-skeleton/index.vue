<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import type { Radius } from '@/lib/types/globals'

const fw = useFramework()

useStyle('skeleton', css)

const cmpClass = fw.cx('skeleton')

defineOptions({
  name: 'AdaptoSkeleton',
})

type SkeletonAnimation = 'pulse' | 'wave' | 'none'

const props = defineProps({
  width: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  rounded: {
    type: String as PropType<Radius>,
    default: undefined,
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl', 'full'].includes(value),
  },
  borderRadius: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  color: {
    type: String,
    default: '',
  },
  animation: {
    type: String as PropType<SkeletonAnimation>,
    default: 'pulse',
    validator: (value: string) => ['pulse', 'wave', 'none'].includes(value),
  },
  ariaLabel: {
    type: String,
    default: 'Cargando contenido',
  },
})

const toCssSize = (value: string | number | undefined) =>
  value === undefined ? undefined : typeof value === 'number' ? `${value}px` : value

const computedClasses = computed(() => [
  cmpClass,
  props.rounded ? `rounded--${props.rounded}` : '',
  props.animation !== 'none' ? `${cmpClass}--${props.animation}` : '',
])

const computedStyle = computed(() => ({
  width: toCssSize(props.width),
  height: toCssSize(props.height),
  borderRadius: toCssSize(props.borderRadius),
  backgroundColor: props.color ? fw.cv(props.color) : undefined,
}))
</script>

<template>
  <div
  :class="computedClasses"
  :style="computedStyle"
  aria-hidden="true" />
  <span class="accesible-hidden" role="status" aria-live="polite">{{ ariaLabel }}</span>
</template>
