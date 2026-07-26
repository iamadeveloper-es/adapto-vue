<script setup lang="ts">
import { computed, ref, useSlots, onMounted, useId } from 'vue';
import { useFramework } from '@/lib/composables/useFramework';

const fw = useFramework()

const cmpClass = fw.cx('checkbox')

defineOptions({
  name: 'AdaptoCheckbox',
})

const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  modelValue: {
    type: [Array, Boolean]
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: false
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Checkbox label'
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

const emit = defineEmits(['update:modelValue', 'onChange', 'onFocus', 'onBlur']);

const id = ref('');
const checkboxRef = ref<HTMLInputElement | null>(null);
const slots = useSlots()
const isFocused = ref(false)

// const setActiveColor = computed(() => `${props.activeColor}`);
const hasSlot = computed(() => !!slots['label']);
const hasLink = computed(() => !!slots['link']);

// computed para manejar el v-model
const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
    emit('onChange', value);
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
  if (Array.isArray(model.value)) {
    return model.value.includes(props.value);
  }
  return !!model.value;
});

const configComponent = () => {
  id.value = useId();
};

onMounted(() => {
  configComponent();
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
          ref="checkboxRef"
          v-model="model"
          :class="`${fw.prefix}-check-radio__input`"
          type="checkbox"
          :name="name"
          :value="value"
          :disabled="disabled"
          role="checkbox"
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
      class="form-error-message"
      :data-validation-error="`error-message-${id}`"
    />
  </div>
</template>
