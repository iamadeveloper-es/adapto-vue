<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'

const fw = useFramework()

useStyle('range', css)

const cmpClass = fw.cx('range')

defineOptions({
  name: 'AdaptoRange',
})

const props = defineProps({
  modelValue: {
    type: Number
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  trackColor: {
    type: String
  },
  indicatorColor: {
    type: String
  },
  showValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Range'
  },
  validations: String
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  onFocus: [event: FocusEvent]
  onBlur: [event: FocusEvent]
}>()

const id = useId()
const trackRef = ref<HTMLElement | null>(null)
const thumbRef = ref<HTMLElement | null>(null)
const isFocused = ref(false)

// acota el valor entre min y max y lo ajusta al múltiplo de step más cercano
const clamp = (value: number): number => {
  const stepped = Math.round((value - props.min) / props.step) * props.step + props.min
  return Math.min(Math.max(stepped, props.min), props.max)
}

// computed para manejar el v-model
const currentValue = computed<number>({
  get() {
    return clamp(props.modelValue ?? props.min)
  },
  set(value: number) {
    emit('update:modelValue', clamp(value))
  }
})

const percentage = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((currentValue.value - props.min) / range) * 100
})

const rootClasses = computed(() => [
  cmpClass,
  { [`${cmpClass}--disabled`]: props.disabled }
])

const trackStyle = computed(() => ({
  backgroundColor: props.trackColor ? fw.getVar(props.trackColor) : undefined
}))

const fillStyle = computed(() => ({
  width: `${percentage.value}%`,
  backgroundColor: props.trackColor ? fw.getVar(props.trackColor) : undefined
}))

const thumbStyle = computed(() => ({
  left: `${percentage.value}%`,
  color: props.indicatorColor ? fw.getVar(props.indicatorColor) : undefined
}))

const valueFromPointer = (event: PointerEvent): number => {
  const rect = trackRef.value!.getBoundingClientRect()
  const ratio = rect.width <= 0 ? 0 : Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
  return props.min + ratio * (props.max - props.min)
}

const onPointerMove = (event: PointerEvent) => {
  currentValue.value = valueFromPointer(event)
}

const stopDragging = () => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDragging)
}

const onPointerDown = (event: PointerEvent) => {
  if (props.disabled) return
  currentValue.value = valueFromPointer(event)
  thumbRef.value?.focus()
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDragging)
}

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault()
      currentValue.value = currentValue.value + props.step
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault()
      currentValue.value = currentValue.value - props.step
      break
    case 'Home':
      event.preventDefault()
      currentValue.value = props.min
      break
    case 'End':
      event.preventDefault()
      currentValue.value = props.max
      break
  }
}

const emitFocus = (ev: FocusEvent) => {
  isFocused.value = true
  emit('onFocus', ev)
}

const emitBlur = (ev: FocusEvent) => {
  isFocused.value = false
  emit('onBlur', ev)
}

onBeforeUnmount(stopDragging)
</script>

<template>
  <div :class="rootClasses">
    <div
      ref="trackRef"
      :class="`${cmpClass}__wrapper`"
      @pointerdown="onPointerDown"
    >
      <div
        :class="`${cmpClass}__track`"
        :style="trackStyle"
      >
        <div
          :class="`${cmpClass}__fill`"
          :style="fillStyle"
        />
      </div>

      <div
        :id="id"
        ref="thumbRef"
        :class="[`${cmpClass}__thumb`, { 'is-focused': isFocused }]"
        :style="thumbStyle"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        aria-orientation="horizontal"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="currentValue"
        :aria-valuetext="showValue ? `${currentValue}` : undefined"
        :aria-disabled="disabled || undefined"
        :aria-label="label"
        :aria-describedby="validations ? `${id}-error` : undefined"
        @keydown="onKeydown"
        @focus="emitFocus"
        @blur="emitBlur"
      >
        <span
          v-if="showValue"
          :class="`${cmpClass}__value`"
        >{{ currentValue }}</span>
      </div>
    </div>

    <span
      v-if="validations"
      :id="`${id}-error`"
      class="form-error-message show"
      role="alert"
    >{{ validations }}</span>
  </div>
</template>
