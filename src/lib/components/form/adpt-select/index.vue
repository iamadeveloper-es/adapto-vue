<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework';
import { computed, onMounted, ref, useId, type PropType } from 'vue';
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
const fontSize = ref()
const id = useId()
const listboxId = `${id}-listbox`
const showList = ref(false)

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

const emitValue = (value: string | number) => {
  emit('update:modelValue', value);
  toggleList()
};

const selectedItem = computed(() => {
  return props.options.find(option => option.value == props.modelValue)
})

const toggleList = () => {
  showList.value = !showList.value
}

onMounted(() => {
  if (elementRef.value) {
    fontSize.value = getComputedStyle(elementRef.value)
      .getPropertyValue(`--${fw.prefix}-select-font-size`)
      .trim()
  }
})

</script>

<template>
  <div
  ref="elementRef"
  :style="{color: getColor}"
  :class="selectClasses">
    <button
    :id="id"
    :class="[`${cmpClass}__button`]"
    role="combobox"
    :aria-expanded="showList"
    aria-haspopup="listbox"
    :aria-controls="listboxId"
    :aria-owns="listboxId"
    @click="toggleList">
    <span>{{ modelValue ? selectedItem?.label : 'Selecciona una opción' }}</span>
    <AdaptoIcon
    :name="handleIcon?.name"
    :size="handleIcon?.size"
    :class="`${cmpClass}__icon`"/>
    </button>
    <div
    v-if="showList"
    :id="listboxId"
    role="listbox"
    aria-live="polite"
    :aria-labelledby="id"
    tabindex="-1"
    :class="[`${cmpClass}__listbox`, 'elevation-2']">
      <div
      v-for="(option, index) in options"
      :key="index"
      :class="[`${cmpClass}__option`]"
      :aria-selected="option.value === selectedItem?.value"
      role="option"
      tabindex="-1"
      @click="emitValue(option.value)"
      >
      <span>{{ option.label }}</span>
        <!-- <label :for="`option-${id}-${index}`">{{ option.label }}</label>
        <input
        type="radio"
        :name="`radio-group-${id}`"
        :id="`option-${id}-${index}`"
        :value="option.value"
        @change="emitValue"> -->
      </div>
    </div>
  </div>
</template>
