<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import { computed, type PropType } from 'vue'


const fw = useFramework()

useStyle('image', css)

const cmpClass = fw.cx('image')

defineOptions({
  name: 'AdaptoImage',
})

type ObjectFit = 'contain' | 'cover'
type AspectRatio = '16/9' | '4/3' | '1/1' | '9/16'
const availableObjectFit = ['contain', 'cover']
const availableAspectRatio = ['16/9', '4/3', '1/1', '9/16']

const props = defineProps({
  width: {
    type: String
  },
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String
  },
  fit: {
    type: String as PropType<ObjectFit>,
    default: 'cover',
    validator: (value: string) => ['contain', 'cover'].includes(value)
  },
  aspectRatio: {
    type: String as PropType<AspectRatio>,
    validator: (value: string) => ['16/9', '4/3', '1/1', '9/16'].includes(value)
  }
})

const emit = defineEmits(['on-error'])

const classes = computed(() => {
  const classes = [
    cmpClass,
    availableObjectFit.includes(props.fit) ? `${cmpClass}--${props.fit}` : `${cmpClass}--cover`
  ]

  return classes
})

const imageClasses = computed(() => {
  const classes = [
    `${cmpClass}__img`
  ]

  return classes
})

const validAspectRatio = computed(() => props.aspectRatio && availableAspectRatio.includes(props.aspectRatio) ? props.aspectRatio : '')

const emitError = (event: Event) => {
  emit('on-error', event)
}

</script>

<template>
  <div :style="{ width: width, aspectRatio:  validAspectRatio}" :class="classes">
    <img @error="emitError" :class="imageClasses" :src="src" :alt="alt">
  </div>
</template>
