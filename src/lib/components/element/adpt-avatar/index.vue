<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useFramework } from '@/lib/composables/useFramework';
import type { Size } from '@/lib/types/globals';


const fw = useFramework()

const cmpClass = fw.cx('avatar')

defineOptions({
  name: 'AdaptoAvatar',
})


const props = defineProps({
  image: {
    type: String
  },
  name: {
    type: String
  },
  size: {
    type: String as PropType<Size>,
    default: 'md',
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  showInitials: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{ clicked: [event: MouseEvent | KeyboardEvent] }>();

const sizeMap: Record<Size, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64
}

const avatarSize = computed(() => sizeMap[props.size] ?? sizeMap.md)

const avatarClases = computed(() => [
  cmpClass,
  sizeMap[props.size] ? `${cmpClass}--${props.size}` : `${cmpClass}--md`
])

const initials = computed((): string => {
  const { name } = props;
  if (!name) return '';

  const firstChar = name.charAt(0).toUpperCase();
  const secondChar = name.split(' ')[1]?.charAt(0).toUpperCase();

  return secondChar ? `${firstChar}${secondChar}` : firstChar;
});

const showText = computed(() => !props.image && !props.showInitials)

const emitEvent = (ev: MouseEvent | KeyboardEvent) => {
  emit('clicked', ev);
};

</script>

<template>
  <div
    :style="{ [`--${fw.prefix}-avatar-size`]: `${avatarSize}px` }"
    :class="avatarClases"
    role="button"
    tabindex="0"
    :aria-label="name"
    @click="emitEvent"
    @keydown.enter="emitEvent"
    @keydown.space.prevent="emitEvent">
    <img
    v-if="image && !showInitials"
    :src="image"
    :alt="name ?? ''"
    :class="[`${cmpClass}__img`]">
    <span
    v-else
    aria-hidden="true"
    :class="{'truncate' : showText}"
    >{{ showText ? name : initials }}</span>
  </div>
</template>
