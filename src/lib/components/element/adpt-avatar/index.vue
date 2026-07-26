<script setup lang="ts">
import { computed, ref } from 'vue';
// import { Size } from '../../../types/components.global';
import { useFramework } from '@/lib/composables/useFramework';
// import { useComponentStyles } from '../../../composables/useComponentStyles';
// import { getAvatarCss } from './style.css';


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
    type: String,
    default: 'Avatar name'
  },
  alt: {
    type: String
  },
  text: {
    type: String
  },
  size: {
    type: String,
    default: 'xs'
  },
  clickable: {
    type: Boolean,
    default: false
  },
  isRounded: {
    type: Boolean,
    default: true
  },
  display: {
    type: String,
    validator(value) {
      return 'img' === value || 'name' === value;
    },
    default: 'img'
  },
  bgColor: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'white'
  },
  isBordered: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['clicked']);

const defaultSize: Size = 'md';
const imageError = ref(false);

const getBG = computed(() => {
  const colors = ['primary', 'info', 'success', 'warning', 'danger'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return props.bgColor ? props.bgColor : colors[randomIndex];
});

const initials = computed((): string => {
  const { name } = props;
  const firstChar = name.charAt(0).toUpperCase();
  const secondChar = name.split(' ')[1]?.charAt(0).toUpperCase();

  return secondChar ? `${firstChar}${secondChar}` : `${firstChar}`;
});

const isImageDisplay = computed(() => props.image && props.display === 'img' && !imageError.value);

const emitEvent = (ev: Event) => {
  emit('clicked', ev);
};

</script>

<template>
  <div :style="{
      width: `var(--${cmpClass}-size-${size}, var(--${cmpClass}-size-${defaultSize}))`,
      height: `var(--${cmpClass}-size-${size}, var(--${cmpClass}-size-${defaultSize}))`,
      color: isImageDisplay ? '' : `var(--${cmpClass}-${color})`,
      backgroundColor: isImageDisplay ? '' : `var(--${cmpClass}-${getBG})`,
      borderColor: !isBordered && !color ? '' : `var(--${cmpClass}-${color})`
    }"
    :class="[cmpClass, { 'is-clickable': clickable, 'radius-full': isRounded, [`${cmpClass}--bordered`]: isBordered}]"
    @click="emitEvent">
    <img v-if="isImageDisplay && !text && !imageError" :src="image" :alt="alt ? alt : name"
      :class="[`${cmpClass}__img`, { circle: isRounded }]" @error="imageError = true">
    <span v-else-if="display === 'name' || text" :class="`${cmpClass}__initials`" :style="{
      fontSize: `var(--${cmpClass}-text-${size}, var(--${cmpClass}-text-${defaultSize}))`,
      lineHeight: `var(--${cmpClass}-text-${size}, var(--${cmpClass}-text-${defaultSize}))`
    }">
      <span :class="`${cmpClass}__truncate`">{{ display === 'name' && !text ? initials : text }}</span>
    </span>
  </div>
</template>
