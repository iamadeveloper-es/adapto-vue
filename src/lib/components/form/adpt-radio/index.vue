<script setup lang="ts">
import { computed, ref, useSlots, useId, type PropType } from 'vue';
import { useFramework } from '@/lib/composables/useFramework';
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'

const fw = useFramework()

useStyle('radio', css)

const cmpClass = fw.cx('radio')

defineOptions({
  name: 'AdaptoRadio',
})

type RadioValue = string | number | boolean | Record<string, unknown>

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object] as PropType<RadioValue>
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number, Boolean, Object] as PropType<RadioValue>,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Radio label'
  },
  hideLabel: {
    type: Boolean,
    default: false
  },
  activeColor: {
    type: String,
    default: 'secondary-400'
  },
  validations: String
});

const emit = defineEmits<{
  'update:modelValue': [value: RadioValue]
  onFocus: [event: FocusEvent]
  onBlur: [event: FocusEvent]
}>();

const id = useId();
const slots = useSlots()
const isFocused = ref(false)

const hasSlot = computed(() => !!slots['label']);
const hasLink = computed(() => !!slots['link']);

// computed para manejar el v-model
const model = computed<RadioValue | undefined>({
  get() {
    return props.modelValue;
  },
  set(value: RadioValue | undefined) {
    // native radio input always yields a value, never undefined
    emit('update:modelValue', value as RadioValue);
  }
});

const emitFocus = (ev: FocusEvent) => {
  isFocused.value = true;
  emit('onFocus', ev);
}

const emitBlur = (ev: FocusEvent) => {
  isFocused.value = false;
  emit('onBlur', ev);
}

// estado seleccionado según el modelValue
const isChecked = computed(() => {
  return props.modelValue === props.value ||
      JSON.stringify(props.modelValue) === JSON.stringify(props.value);
});

</script>

<template>
  <div
    :class="[`${fw.prefix}-check-radio`, cmpClass, { disabled: disabled, [`${cmpClass}--no-label`]: hideLabel, 'focused' : isFocused }]"
  >
    <div :class="`${cmpClass}__inner`">
      <div :class="`${fw.prefix}-check-radio__wrapper`">
        <span
          aria-hidden="true"
          :style="{color: isChecked ? `${fw.getVar(activeColor)}` : undefined}"
          :class="[`${fw.prefix}-check-radio__icon`]"
        >
          <svg
            class="v-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              v-if="!isChecked"
              d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"
            />
            <path
              v-else
              d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z"
            />
          </svg>
        </span>

        <input
          :id="id"
          v-model="model"
          :class="`${fw.prefix}-check-radio__input`"
          type="radio"
          :name="name"
          :value="value"
          :disabled="disabled"
          :aria-label="label"
          :aria-describedby="validations ? `${id}-error` : undefined"
          @focus="emitFocus"
          @blur="emitBlur"
        >
      </div>

      <label
        v-if="!hideLabel"
        :class="`${fw.prefix}-check-radio__label`"
        :for="id"
      >
        <span v-if="!hasSlot">{{ label }}</span>
        <slot
          v-else
          name="label"
        />
        <slot
          v-if="hasLink"
          name="link"
        />
      </label>
    </div>

    <span
      v-if="validations"
      :id="`${id}-error`"
      class="form-error-message show"
      role="alert"
    >{{ validations }}</span>
  </div>
</template>
