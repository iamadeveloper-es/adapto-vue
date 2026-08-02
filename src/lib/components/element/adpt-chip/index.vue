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
    default: 'lg'
  },
  iconPrepend: {
    type: Object as PropType<Icon>,
    default: (() => {})
  },
  iconAppend: {
    type: Object as PropType<Icon>,
    default: (() => {})
  },
  hideLabel: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['clicked', 'closable'])
const elementRef = ref<HTMLElement | null>(null)
const fontSize = ref()
const show = ref(true)

const chipClasses = computed(() => {
  const classes = [
    cmpClass,
    'rounded--full',
    `${cmpClass}--${props.variant}`,
    `${cmpClass}--${props.size}`,
    {'is-disabled' : props.disabled}
  ]

  return classes
})

const getColor = computed(() => props.color ? fw.cv(props.color) : 'sm-surface-300')

const hasIconPrepend = computed(() => props.iconPrepend && Object.keys(props.iconPrepend).length );

const hasIconAppend = computed(() => props.iconAppend && Object.keys(props.iconAppend).length );

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
  const { name, size } = props.iconPrepend
  return setIcon(name, size)
})

const handleIconAppend = computed(() => {
  const { name, size } = props.iconAppend
  return setIcon(name, size)
})

const emitValue = (event: MouseEvent) => {
  emit('clicked', event)
}

const emitClosable = (event: MouseEvent) => {
  show.value = false
  emit('closable', event)
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
  <span
  v-if="show"
  ref="elementRef"
  :style="{color: getColor}"
  :class="chipClasses"
  @click.stop="emitValue">
    <AdaptoIcon
    v-if="hasIconPrepend" v-bind="handleIconPrepend"
    :aria-hidden="hasIconPrepend && hideLabel ? true : null" />
    <div
    v-if="!hideLabel">{{ label }}</div>
    <AdaptoIcon
    v-if="hasIconAppend" v-bind="handleIconAppend"
    :aria-hidden="hasIconAppend && hideLabel ? true : null" />
    <AdptButton
    v-if="closable"
    label="Close dialog"
    :hide-label="true"
    :disabled="disabled"
    variant="soft"
    :color="getColor"
    size="3xs"
    radius="full"
    :icon="{ name: 'x' }"
    @clicked.stop="emitClosable" />
  </span>
</template>
