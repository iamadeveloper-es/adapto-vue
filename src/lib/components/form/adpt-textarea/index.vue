<script setup lang="ts">
import { computed, onMounted, type PropType, ref, useId } from 'vue'
import AdptButton from '../../element/adpt-button/index.vue'
import { useFramework } from '@/lib/composables/useFramework.ts'
import type { Icon, Variant } from '@/lib/types/globals.ts'


const fw = useFramework()

const cmpClass = fw.cx('textarea')

defineOptions({
  name: 'AdaptoTextarea',
})

type InputVariant = Extract<Variant, 'outlined' | 'fussy' | 'soft'> | 'underlined'
type LabelVariant = 'float' | 'outlined'
const availableVariants = ['outlined', 'fussy', 'soft', 'underlined']
const availableLabelVariants = ['float', 'outlined']

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number
  },
  rows: {
    type: Number,
    default: 4
  },
  // El color debe ser o un token primitivo o un token semántico
  color: {
    type: String,
    default: 'primary-600',
  },
  variant: {
    type: String as PropType<InputVariant>,
    default: 'underlined',
    validator: (value: string) => ['outlined', 'fussy', 'soft', 'underlined'].includes(value),
  },
  hideLabel: {
    type: Boolean,
    default: false
  },
  labelVariant: {
    type: String as PropType<LabelVariant>,
    default: 'float'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  trailingIcon: {
    type: Object as PropType<Icon>,
    default: () => ({
      name: 'x'
    })
  }
})

const isFocused = ref(false)
const id = useId()

const emit = defineEmits(['update:modelValue', 'onFocus', 'onBlur']);

const emitValue = (ev: Event) => {
  const target = ev.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

const emitFocus = (ev: FocusEvent) => {
  isFocused.value = true;
  emit('onFocus', ev);
}

const emitBlur = (ev: FocusEvent) => {
  isFocused.value = props.modelValue.length > 0 ? true : false;
  emit('onBlur', ev);
}

const normalizedVariant = computed((): string => {
  return availableVariants.includes(String(props.variant)) ?
    `${cmpClass}--${props.variant}` : 'outlined'
})

const normalizedLabelVariant = computed((): string => {
  return availableLabelVariants.includes(String(props.labelVariant)) ?
    `${fw.prefix}-label--${props.labelVariant}` : ''
})

const labelClasses = computed(() => {
  const classes = [
    `${fw.prefix}-label`,
    {'accesible-hidden' : props.hideLabel},
  ]

  if(props.labelVariant){
    classes.push(normalizedLabelVariant.value)
  }

  return classes
})

const formFieldWrapperClasses = computed(() => [
  {'is-focused': !!normalizedLabelVariant.value && isFocused.value}
])

const inputClasses = computed(() => {
  const classes = [
    cmpClass
  ]

  if(normalizedVariant.value){
    classes.push(normalizedVariant.value)
  }

  if(props.labelVariant === 'float' && isFocused.value){
    classes.push(`${cmpClass}--on-floating-label`)
  }

  return classes
})

const getColor = computed(() => fw.cv(props.color))

const clearField = () => {
  isFocused.value = false;
  emit('update:modelValue', '');
}

const configComponent = () => {
  isFocused.value = props.modelValue.length > 0;
}

onMounted(() => {
  configComponent();
})

</script>

<template>
  <div
  class="form-field-wrapper"
  :class="formFieldWrapperClasses">
  <label
    v-if="label"
    :for="id"
    :style="{color: getColor}"
    :class="labelClasses">{{ label }}</label>
    <div class="form-field-inner">
      <textarea
        :style="{color: getColor}"
        :class="inputClasses"
        :id="id"
        :value="modelValue"
        :rows="rows"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="emitValue"
        @focus="emitFocus"
        @blur="emitBlur"></textarea>
        <AdptButton
        v-if="modelValue.length && clearable && !disabled"
        :icon="trailingIcon"
        label="Limpiar campo"
        type="button"
        hide-label
        radius="full"
        size="xs"
        variant="link"
        :color="color"
        :class="`${cmpClass}__trailing-icon`"
        @clicked="clearField"
        />
    </div>
  </div>
</template>

<style></style>
