<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, type PropType } from 'vue';
import AdaptoIcon from '../../element/adpt-icon/index.vue'
import type { ComboboxOptions, Icon, Size, Variant } from '@/lib/types/globals';
import { remToPx } from '@/lib/utils/units.ts';


const fw = useFramework()

const cmpClass = fw.cx('select')

defineOptions({
  name: 'AdaptoSelect',
})

type InputVariant = Extract<Variant, 'outlined' | 'fussy' | 'soft'> | 'underlined'
const availableVariants = ['outlined', 'fussy', 'soft', 'underlined']

const props = defineProps({
  modelValue: {
    type: String
  },
  options: {
    type: Array as PropType<ComboboxOptions[]>,
    required: true
  },
  color: {
    type: String,
    default: 'primary-700',
  },
  variant: {
    type: String as PropType<InputVariant>,
    default: 'outlined',
    validator: (value: string) => ['outlined', 'fussy', 'soft', 'underlined'].includes(value),
  },
  size: {
    type: String as PropType<Size>,
    default: 'xs'
  },
  icon: {
    type: Object as PropType<Icon>,
    default: () => ({
      name: 'chevron-down'
    })
  }
})

const elementRef = ref<HTMLElement | null>(null)
const optionRefs = ref<(HTMLElement | null)[]>([])
const fontSize = ref()
const id = useId()
const listboxId = `${id}-listbox`
const showList = ref(false)
const activeIndex = ref(-1)

const handleIcon = computed(() => {

  const {name, size} = props.icon

  const iconSize = size ? size : remToPx(fontSize.value) + 2

  const icon = {
    name: name,
    size: iconSize
  }

  return icon

})

const getColor = computed(() => fw.cv(props.color))

const normalizedVariant = computed((): string => {
  return availableVariants.includes(String(props.variant)) ?
    `${cmpClass}--${props.variant}` : 'outlined'
})

const selectClasses = computed(() => {
  const clasess = [
    cmpClass
  ]

  if(props.variant){
    clasess.push(normalizedVariant.value)
  }
  return clasess
})

const emit = defineEmits(['update:modelValue', 'onChange', 'onFocus', 'onBlur']);

const selectedIndex = computed(() => props.options.findIndex(option => option.value == props.modelValue))
const selectedItem = computed(() => props.options[selectedIndex.value])
const activeOptionId = computed(() => activeIndex.value >= 0 ? `${listboxId}-option-${activeIndex.value}` : undefined)

const setOptionRef = (el: unknown, index: number) => {
  optionRefs.value[index] = el as HTMLElement | null
}

const setActive = (index: number) => {
  if (index < 0 || index >= props.options.length) return
  activeIndex.value = index
  nextTick(() => {
    optionRefs.value[index]?.scrollIntoView({ block: 'nearest' })
  })
}

const openList = () => {
  if (showList.value) return
  showList.value = true
  setActive(selectedIndex.value !== -1 ? selectedIndex.value : 0)
}

const closeList = () => {
  showList.value = false
  activeIndex.value = -1
}

const toggleList = () => {
  showList.value ? closeList() : openList()
}

const moveActive = (delta: number) => {
  if (!props.options.length) return
  const next = activeIndex.value === -1
    ? (delta > 0 ? 0 : props.options.length - 1)
    : (activeIndex.value + delta + props.options.length) % props.options.length
  setActive(next)
}

const selectOption = (value: string | number) => {
  emit('update:modelValue', value)
  closeList()
}

const selectActive = () => {
  const option = props.options[activeIndex.value]
  if (!option) return
  selectOption(option.value)
}

let typeaheadBuffer = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

const handleTypeahead = (char: string) => {
  clearTimeout(typeaheadTimer)
  typeaheadBuffer += char.toLowerCase()

  const match = props.options.findIndex(option =>
    option.label.toLowerCase().startsWith(typeaheadBuffer)
  )

  const matchedOption = match !== -1 ? props.options[match] : undefined
  if (matchedOption) {
    showList.value ? setActive(match) : selectOption(matchedOption.value)
  }

  typeaheadTimer = setTimeout(() => { typeaheadBuffer = '' }, 500)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      showList.value ? moveActive(1) : openList()
      break
    case 'ArrowUp':
      event.preventDefault()
      showList.value ? moveActive(-1) : openList()
      break
    case 'Home':
      if (!showList.value) return
      event.preventDefault()
      setActive(0)
      break
    case 'End':
      if (!showList.value) return
      event.preventDefault()
      setActive(props.options.length - 1)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      showList.value ? selectActive() : openList()
      break
    case 'Escape':
      if (!showList.value) return
      event.preventDefault()
      closeList()
      break
    case 'Tab':
      if (showList.value) closeList()
      break
    default:
      if (event.key.length === 1) handleTypeahead(event.key)
  }
}

onMounted(() => {
  if (elementRef.value) {
    fontSize.value = getComputedStyle(elementRef.value)
      .getPropertyValue(`--${fw.prefix}-select-font-size`)
      .trim()
  }
})

onBeforeUnmount(() => clearTimeout(typeaheadTimer))

</script>

<template>
  <div
  ref="elementRef"
  :style="{color: getColor}"
  :class="selectClasses"
  v-click-outside="closeList">
    <button
    :id="id"
    type="button"
    :class="[`${cmpClass}__button`]"
    role="combobox"
    :aria-expanded="showList"
    aria-haspopup="listbox"
    :aria-controls="listboxId"
    :aria-activedescendant="showList ? activeOptionId : undefined"
    @click="toggleList"
    @keydown="handleKeydown">
    <span>{{ modelValue ? selectedItem?.label : 'Selecciona una opción' }}</span>
    <AdaptoIcon
    :name="handleIcon?.name"
    :size="handleIcon?.size"
    :class="`${cmpClass}__icon`"/>
    </button>
    <Transition name="fw-select-listbox">
      <div
      v-if="showList"
      :id="listboxId"
      role="listbox"
      :aria-labelledby="id"
      :class="[`${cmpClass}__listbox`, 'elevation-2']">
        <div
        v-for="(option, index) in options"
        :key="index"
        :id="`${listboxId}-option-${index}`"
        :ref="(el) => setOptionRef(el, index)"
        :class="[`${cmpClass}__option`, { 'is-active': index === activeIndex }]"
        :aria-selected="option.value === selectedItem?.value"
        role="option"
        @click="selectOption(option.value)"
        @mouseenter="setActive(index)"
        >
        <span>{{ option.label }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
