<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework';
import type { Elevation, ItemAlignment, Radius, TextAlignment, Variant } from '@/lib/types/globals';
import { computed, useId, useSlots, type PropType } from 'vue';

const fw = useFramework()

const cmpClass = fw.cx('card')

defineOptions({
  name: 'AdaptoCard',
})

type CardVariant = Extract<Variant, 'outlined' | 'fussy' | 'soft'> | 'default'
const availableVariants = ['outlined', 'fussy', 'soft', 'default']

const props = defineProps({
  // El color debe ser o un token primitivo o un token semántico
  color: {
    type: String,
    default: '',
  },
  // El color debe ser o un token primitivo o un token semántico
  titleColor: {
    type: String,
    default: '',
  },
  // El color debe ser o un token primitivo o un token semántico
  subtitleColor: {
    type: String,
    default: '',
  },
  radius: {
    type: String as PropType<Radius>,
    default: 'sm'
  },
  variant: {
    type: String as PropType<CardVariant>,
    default: 'default',
    validator: (value: string) => ['default', 'outlined', 'fussy', 'soft'].includes(value),
  },
  elevation: {
    type: String as PropType<Elevation>,
    default: ''
  },
  imageOverlap: {
    type: Boolean,
    default: false
  },
  titleOverlapPosition: {
    type: String as PropType<ItemAlignment>,
    default: ''
  },
  titleOverlapTextAlign:{
    type: String as PropType<TextAlignment>,
    default: ''
  },
  titleReverse: {
    type: Boolean,
    default: false
  },
})

const slots = useSlots()

const titleId = useId()
const subtitleId = useId()

const hasTitle = computed(() => !!slots['title'])
const hasSubtitle = computed(() => !!slots['subtitle'])
const hasMedia = computed(() => !!slots['media'])
const hasBody = computed(() => !!slots['body'])
const hasFooter = computed(() => !!slots['footer'])

const normalizedVariant = computed((): string => {
  return availableVariants.includes(String(props.variant)) ?
    `${cmpClass}--${props.variant}` : `${cmpClass}--default`
})

const cardClasses = computed(() => [
  cmpClass,
  normalizedVariant.value,
  {
    [`rounded--${props.radius}`] : props.radius,
    [`elevation-${props.elevation}`] : props.elevation
  }
])

const headerClasses = computed(() => {
  const classes = [
    `${cmpClass}__header`,
    {
      'overlap' : props.imageOverlap,
      'media' : hasMedia.value && !props.imageOverlap,
      [props.titleOverlapPosition] : props.imageOverlap && props.titleOverlapPosition,
      [`text-${props.titleOverlapTextAlign}`] : props.imageOverlap && props.titleOverlapTextAlign,
      'title-reverse' : hasMedia.value && props.titleReverse && !props.imageOverlap
    }]

  return classes
})

const getColor = computed(() => props.color ? `var(--${fw.prefix}-${props.color})` : '')
const getTitleColor = computed(() => props.titleColor ? `var(--${fw.prefix}-${props.titleColor})` : '')
const getSubtitleColor = computed(() => props.subtitleColor ? `var(--${fw.prefix}-${props.subtitleColor})` : '')

</script>

<template>
  <article
  :style="{color: getColor}"
  :class="cardClasses"
  :aria-labelledby="hasTitle ? titleId : undefined"
  :aria-describedby="hasSubtitle ? subtitleId : undefined">
    <div
    v-if="hasTitle || hasSubtitle"
    :class="headerClasses">
      <div
      v-if="hasMedia"
      :class="[`${cmpClass}__media`]">
        <slot name="media"></slot>
      </div>
      <div :class="`${cmpClass}__title-wrapper`">
        <div
        v-if="hasTitle"
        :id="titleId"
        :style="{color: getTitleColor}"
        :class="`${cmpClass}__title`">
          <slot name="title"></slot>
        </div>
        <div
        v-if="hasSubtitle"
        :id="subtitleId"
        :style="{color: getSubtitleColor}"
        :class="`${cmpClass}__subtitle`">
          <slot name="subtitle"></slot>
        </div>
      </div>
    </div>
    <div
    v-if="hasBody"
    :class="`${cmpClass}__body`">
      <slot name="body"></slot>
    </div>
    <div
    v-if="hasFooter"
    :class="`${cmpClass}__footer`">
      <slot name="footer"></slot>
    </div>
  </article>
</template>
