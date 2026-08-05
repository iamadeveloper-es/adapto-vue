<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import type { Icon, Size, Variant } from '@/lib/types/globals'
import AdaptoIcon from '../adpt-icon/index.vue'
import AdptButton from '../../element/adpt-button/index.vue'
import { computed, onMounted, ref, type PropType } from 'vue'
import { remToPx } from '@/lib/utils/units'


const fw = useFramework()

useStyle('chip', css)

const cmpClass = fw.cx('chip')

defineOptions({
  name: 'AdaptoChip',
})

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // El color debe ser o un token primitivo o un token semántico
  color: {
    type: String,
    default: '',
  },
  variant: {
    type: String as PropType<Variant>,
    default: 'fussy',
    validator: (value: string) => ['outlined', 'fussy', 'soft', 'soul', 'link'].includes(value),
  },
  size: {
    type: String as PropType<Size>,
    default: 'xs'
  },
  prependIcon: {
    type: Object as PropType<Icon>,
  },
  appendIcon: {
    type: Object as PropType<Icon>,
  },
  hideLabel: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits<{
  clicked: [event: MouseEvent | KeyboardEvent]
  closed: [event: MouseEvent]
}>()
const elementRef = ref<HTMLElement | null>(null)
const fontSize = ref('')
const show = ref(true)

const chipClasses = computed(() => {
  const classes = [
    cmpClass,
    'rounded--full',
    `${cmpClass}--${props.variant}`,
    `${cmpClass}--${props.size}`,
    { 'is-disabled': props.disabled }
  ]

  return classes
})

const getColor = computed(() => props.color ? fw.cv(props.color) : fw.cv('sm-surface-300'))

const hasIconPrepend = computed(() => !!props.prependIcon?.name)

const hasIconAppend = computed(() => !!props.appendIcon?.name)

const setIcon = (name: string, size?: string | number) => {
  const iconSize = typeof size === 'number'
    ? size
    : size
      ? remToPx(size)
      : fontSize.value
        ? remToPx(fontSize.value) + 1
        : remToPx('1rem') + 1

  const icon = {
    name: name,
    size: iconSize
  }

  return icon
}
const handleIconPrepend = computed(() => {
  const { name, size } = props.prependIcon ?? { name: '' }
  return setIcon(name, size)
})

const handleIconAppend = computed(() => {
  const { name, size } = props.appendIcon ?? { name: '' }
  return setIcon(name, size)
})

const emitValue = (event: MouseEvent | KeyboardEvent) => {
  if (props.disabled || !props.clickable) return
  emit('clicked', event)
}

const emitClosed = (event: MouseEvent) => {
  const chipEl = elementRef.value as HTMLElement
  const hadFocus = chipEl.contains(document.activeElement)
  const neighbor = chipEl.nextElementSibling

  if (hadFocus && neighbor instanceof HTMLElement) neighbor.focus()

  show.value = false
  emit('closed', event)
}

onMounted(() => {
  if (elementRef.value) {
    fontSize.value = getComputedStyle(elementRef.value)
      .getPropertyValue(`--${fw.prefix}-chip-font-size`)
      .trim()
  }
})

</script>

<template>
  <span v-if="show && !closable" ref="elementRef" :style="{ color: getColor }" :class="chipClasses"
    :role="clickable ? 'button' : undefined" :tabindex="clickable ? (disabled ? -1 : 0) : undefined"
    :aria-disabled="clickable ? (disabled || undefined) : undefined" :aria-label="hideLabel ? label : undefined"
    @click.stop="emitValue" @keydown.enter.self="emitValue" @keydown.space.self.prevent="emitValue">
    <AdaptoIcon v-if="hasIconPrepend" v-bind="handleIconPrepend" aria-hidden="true" />
    <div v-if="!hideLabel">{{ label }}</div>
    <AdaptoIcon v-if="hasIconAppend" v-bind="handleIconAppend" aria-hidden="true" />
  </span>

  <span v-else-if="show" ref="elementRef" :style="{ color: getColor }" :class="chipClasses" role="group"
    :aria-label="label">
    <span :class="`${cmpClass}__content`" :role="clickable ? 'button' : undefined"
      :tabindex="clickable ? (disabled ? -1 : 0) : undefined"
      :aria-disabled="clickable ? (disabled || undefined) : undefined" @click.stop="emitValue"
      @keydown.enter.self="emitValue" @keydown.space.self.prevent="emitValue">
      <AdaptoIcon v-if="hasIconPrepend" v-bind="handleIconPrepend" aria-hidden="true" />
      <div v-if="!hideLabel">{{ label }}</div>
      <AdaptoIcon v-if="hasIconAppend" v-bind="handleIconAppend" aria-hidden="true" />
    </span>
    <AdptButton :label="`Remove ${label}`" :hide-label="true" :disabled="disabled" variant="soft" :color="getColor"
      size="3xs" radius="full" :icon="{ name: 'x' }" @clicked.stop="emitClosed" />
  </span>
</template>
