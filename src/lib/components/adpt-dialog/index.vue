<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, useId, useSlots } from 'vue';
import AdptButton from '../adpt-button/index.vue';
import { useFramework } from '@/lib/composables/useFramework.ts';

const fw = useFramework();

const cmpClass = fw.cx('dialog');

const transitionDuration = 240;

defineOptions({
  name: 'VkDialog'
});

const props = defineProps({
  blockBackdrop: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
});

const emit = defineEmits<{
  opened: [];
  closed: [];
  'update:modelValue': [value: boolean];
}>();

const modal = ref<HTMLDialogElement | null>(null);
const isVisible = ref(false);
const isClosing = ref(false);
let lastFocusedElement: HTMLElement | null = null;
let closingTimer: number | null = null;
let openingTimer: number | null = null;

const headerId = useId();
const bodyId = useId();

const slots = useSlots();

const hasHeader = computed(() => !!slots['header']);
const hasBody = computed(() => !!slots['body']);
const hasFooter = computed(() => !!slots['footer']);

const clearTimers = () => {
  if (closingTimer) {
    window.clearTimeout(closingTimer);
    closingTimer = null;
  }

  if (openingTimer) {
    window.clearTimeout(openingTimer);
    openingTimer = null;
  }
};

const isDialogOpen = () => !!modal.value && (modal.value.open || modal.value.hasAttribute('open'));

const open = () => {
  clearTimers();
  isClosing.value = false;
  isVisible.value = false;
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.value?.showModal();
  modal.value?.focus();
  emit('update:modelValue', true);

  openingTimer = window.setTimeout(() => {
    if (isDialogOpen()) {
      isVisible.value = true;
      emit('opened');
    }
  }, 16);
};

const close = () => {
  if (!modal.value || !isDialogOpen() || isClosing.value) {
    return;
  }

  isClosing.value = true;
  isVisible.value = false;
  emit('update:modelValue', false);

  clearTimers();
  closingTimer = window.setTimeout(() => {
    modal.value?.close();
    isClosing.value = false;
    lastFocusedElement?.focus();
    clearTimers();
    emit('closed');
  }, transitionDuration);
};

function handleBackdrop(e: MouseEvent) {
  if (!modal.value || props.blockBackdrop) {
    return;
  }

  const rect = modal.value.getBoundingClientRect();
  const isInDialog =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (!isInDialog) {
    close();
  }
}

function handleCancel(event: Event) {
  event.preventDefault();
  close();
}

onMounted(() => {
  if (modal.value) {
    modal.value.addEventListener('cancel', handleCancel);
    modal.value.addEventListener('click', handleBackdrop);
  }
});

onUnmounted(() => {
  clearTimers();
  if (modal.value) {
    modal.value.removeEventListener('cancel', handleCancel);
    modal.value.removeEventListener('click', handleBackdrop);
  }
});

defineExpose({ open, close });
</script>

<template>
  <dialog
    ref="modal"
    :class="[cmpClass, { 'is-visible': isVisible, 'is-closing': isClosing }]"
    aria-modal="true"
    :aria-labelledby="hasHeader ? headerId : undefined"
    :aria-label="!hasHeader && label ? label : undefined"
    :aria-describedby="hasBody ? bodyId : undefined"
  >
    <div :class="`${cmpClass}__close`">
      <AdptButton label="Close dialog" :hide-label="true" variant="soft" size="sm" radius="full" :icon="{ name: 'x' }"
        @clicked="close" />
    </div>
    <div :class="`${cmpClass}__content`">
      <div v-if="hasHeader" :id="headerId" :class="`${cmpClass}__header`">
        <slot name="header" />
      </div>
      <div v-if="hasBody" :id="bodyId" :class="`${cmpClass}__body`">
        <slot name="body" />
      </div>
      <div v-if="hasFooter" :class="`${cmpClass}__footer`">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>
