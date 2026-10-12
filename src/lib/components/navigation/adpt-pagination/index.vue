<script lang="ts" setup>
import { computed} from 'vue'
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import AdaptoButton from '../../element/adpt-button/index.vue'
// import AdaptoIcon from '../../element/adpt-icon/index.vue'


const fw = useFramework()

useStyle('pagination', css)

const cmpClass = fw.cx('pagination')

defineOptions({
  name: 'AdaptoPagination',
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  length: {
    type: Number,
    default: 0,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: 'Paginación'
  },
  showLastFirst: {
    type: Boolean,
    default: false
  },
  totalVisible: {
    type: Number,
    default: 0
  },
  itemsVariant: {
    type: String,
    default: 'soul'
  },
  // El color debe ser o un token primitivo o un token semántico
  color: {
    type: String,
    default: 'secondary-400',
  },
  activeColor: {
    type: String,
    default: 'secondary-500',
  },
  size: {
    type: String,
    default: 'xs'
  },
  firstPageIcon: {
    type: String,
    default: 'chevron-first'
  },
  lastPageIcon: {
    type: String,
    default: 'chevron-last'
  },
  previousIcon: {
    type: String,
    default: 'chevron-left'
  },
  nextIcon: {
    type: String,
    default: 'chevron-right'
  }
})

const emit = defineEmits(['updateValue', 'update:modelValue'])

const computedClasses = computed(() => [
  cmpClass
])


const areFirstDisabled = computed(() => props.modelValue === 1)
const areLastDisabled = computed(() => props.modelValue === props.length)

//TODO: Controlar páginas visibles
// const visiblePages = computed(() => {
//   const total = props.length
//   const current = props.modelValue
//   const visible = props.totalVisible

//   if (visible <= 0 || visible >= total) {
//     return Array.from({ length: total }, (_, i) => i + 1)
//   }

//   const start = Math.max(1, Math.min(current - Math.floor(visible / 2), total - visible + 1))

//   return Array.from({ length: visible }, (_, i) => start + i)
// })

// const isFirstEllipsisVisible = computed(() => visiblePages.value[0] > 1)
// const isLastEllipsisVisible = computed(() => visiblePages.value.at(-1)! < props.length)

const setButtonColor = (index: number) => {
  return index + 1 === props.modelValue ?
    props.activeColor :
    props.color ?
    props.color :
    `on-${props.color}`
}

const updateValue = (page: number) => {
  // emit('updateValue', event)
  emit('update:modelValue', page)
}

const updatePrev = () => {
  if(props.modelValue > 1 ){
    const prevPage = props.modelValue - 1
    emit('update:modelValue', prevPage)
  }
}

const updateNext = () => {
  if(props.modelValue < props.length){
    const prevPage = props.modelValue + 1
    emit('update:modelValue', prevPage)
  }
}

const goToFirstPage = () => {
  if(props.modelValue > 1 ){
    emit('update:modelValue', 1)
  }
}

const goToLastPage = () => {
  if(props.modelValue < props.length){
    emit('update:modelValue', props.length)
  }
}

</script>

<template>
  <nav role="navigation" :aria-label="ariaLabel" :class="computedClasses">
    <ul :class="[`${cmpClass}__list`]">
      <li v-if="showLastFirst" :class="[`${cmpClass}__item`]">
        <AdaptoButton @clicked="goToFirstPage()" :disabled="areFirstDisabled || disabled" :color="color" :size="size" :variant="itemsVariant" hide-label :icon="{name: firstPageIcon}"/>
      </li>
      <li :class="[`${cmpClass}__item`]">
        <AdaptoButton @clicked="updatePrev()" :disabled="areFirstDisabled || disabled" :color="color" :size="size" :variant="itemsVariant" hide-label :icon="{name: previousIcon}"/>
      </li>
      <!-- //TODO: Controlar páginas visibles -->
      <!-- <li :class="[`${cmpClass}__item`]">
        <AdaptoIcon v-if="isFirstEllipsisVisible" name="ellipsis" :color="`var(--${fw.prefix}-${color})`"/>
      </li> -->
      <li v-for="(page, index) in length" :key="index"
        :class="[`${cmpClass}__item`, { 'active': index + 1 === modelValue }]">
        <AdaptoButton @clicked="updateValue(page)" :disabled="disabled" :label="String(page)"
          :color="setButtonColor(index)"  :size="size" :variant="itemsVariant" />
      </li>
      <!-- //TODO: Controlar páginas visibles -->
      <!-- <li :class="[`${cmpClass}__item`]">
        <AdaptoIcon v-if="isLastEllipsisVisible" name="ellipsis" :color="`var(--${fw.prefix}-${color})`"/>
      </li> -->
      <li :class="[`${cmpClass}__item`]">
        <AdaptoButton @clicked="updateNext()" :disabled="areLastDisabled || disabled" :color="color" :size="size" :variant="itemsVariant" hide-label :icon="{name: nextIcon}"/>
      </li>
      <li v-if="showLastFirst" :class="[`${cmpClass}__item`]">
        <AdaptoButton @clicked="goToLastPage()" :disabled="areLastDisabled || disabled" :color="color" :size="size" :variant="itemsVariant" hide-label :icon="{name: lastPageIcon}"/>
      </li>
    </ul>
  </nav>
</template>
