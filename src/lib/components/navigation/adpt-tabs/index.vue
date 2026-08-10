<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, useId, type PropType } from 'vue'
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import AdaptoIcon from '../../element/adpt-icon/index.vue'
import type { Radius, Size, TabItem, Variant } from '@/lib/types/globals.ts'

const fw = useFramework()

useStyle('tabs', css)

const cmpClass = fw.cx('tabs')

defineOptions({
  name: 'AdaptoTabs',
})

type TabsVariant = Extract<Variant, 'outlined' | 'fussy' | 'soft'> | 'underlined'
type TabsAlign = 'start' | 'center' | 'end'
const availableVariants = ['outlined', 'fussy', 'soft', 'underlined']
const availableTabsAlign = ['start', 'center', 'end']

const props = defineProps({
  tabs: {
    type: Array as PropType<TabItem[]>,
    required: true
  },
  modelValue: {
    type: [String, Number],
  },
  variant: {
    type: String as PropType<TabsVariant>,
    default: 'underlined',
    validator: (value: string) => ['outlined', 'fussy', 'soft', 'underlined'].includes(value),
  },
  // El color debe ser o un token primitivo o un token semántico
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<Size>,
    default: 'xs'
  },
  radius: {
    type: String as PropType<Radius>,
    default: 'sm'
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Tabs'
  },
  disableRipple: {
    type: Boolean,
    default: false
  },
  tabsAlign: {
    type: String as PropType<TabsAlign>
  },
  divider: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const id = useId()
const tabRefs = ref<(HTMLElement | null)[]>([])
const indicatorStyle = ref({ transform: 'translateX(0px)', width: '0px' })
const panelDirection = ref<'prev' | 'next'>('next')

const setTabRef = (el: unknown, index: number) => {
  tabRefs.value[index] = el as HTMLElement | null
}

const activeValue = computed(() => {
  const isValid = props.tabs.some(tab => tab.value === props.modelValue)
  return isValid ? props.modelValue : props.tabs.find(tab => !tab.disabled)?.value
})

const activeTab = computed(() => props.tabs.find(tab => tab.value === activeValue.value))

const normalizedVariant = computed((): string => {
  return availableVariants.includes(String(props.variant)) ?
    `${cmpClass}--${props.variant}` : `${cmpClass}--underlined`
})

const tabsClasses = computed(() => [
  cmpClass,
  normalizedVariant.value,
  `${cmpClass}--${props.size}`,
  {
    [`${cmpClass}--full-width`]: props.fullWidth
  }
])

const tabListClasses = computed(() => [
  `${cmpClass}__list`,
  {
    [`align-${props.tabsAlign}`]: props.tabsAlign && availableTabsAlign.includes(props.tabsAlign),
    ['divider']: props.divider,
  }
])

const isUnderlined = computed(() => normalizedVariant.value === `${cmpClass}--underlined`)

const getColor = computed(() => props.color ? fw.cv(props.color) : fw.cv('primary-700'))

// El indicador es un único elemento que se desplaza y redimensiona hasta el tab
// activo, en vez de que cada botón dibuje su propio borde inferior estático.
const updateIndicator = () => {
  const index = props.tabs.findIndex(tab => tab.value === activeValue.value)
  const tabEl = tabRefs.value[index]
  if (!tabEl) return

  indicatorStyle.value = {
    transform: `translateX(${tabEl.offsetLeft}px)`,
    width: `${tabEl.offsetWidth}px`
  }
}

const selectTab = (tab: TabItem) => {
  if (tab.disabled) return
  emit('update:modelValue', tab.value)
}

// Recorre los tabs desde `from` en la dirección `delta`, saltando los deshabilitados,
// hasta encontrar uno válido (o volver al punto de partida si todos lo están).
const stepIndex = (from: number, delta: number) => {
  const total = props.tabs.length
  let index = from
  for (let step = 0; step < total; step++) {
    index = (index + delta + total) % total
    if (!props.tabs[index]?.disabled) return index
  }
  return from
}

const focusTabAt = (index: number) => {
  const tab = props.tabs[index]
  if (!tab) return
  tabRefs.value[index]?.focus()
  selectTab(tab)
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      focusTabAt(stepIndex(index, 1))
      break
    case 'ArrowLeft':
      event.preventDefault()
      focusTabAt(stepIndex(index, -1))
      break
    case 'Home':
      event.preventDefault()
      focusTabAt(stepIndex(-1, 1))
      break
    case 'End':
      event.preventDefault()
      focusTabAt(stepIndex(0, -1))
      break
  }
}

watch([activeValue, () => props.tabs], () => nextTick(updateIndicator))

// El tab activo entrante determina hacia dónde "empuja" la animación del panel:
// si está a la izquierda del anterior, el contenido entra desde la izquierda
// (empuja de izquierda a derecha); si está a la derecha, entra desde la derecha.
watch(activeValue, (newValue, oldValue) => {
  const newIndex = props.tabs.findIndex(tab => tab.value === newValue)
  const oldIndex = props.tabs.findIndex(tab => tab.value === oldValue)
  if (newIndex === -1 || oldIndex === -1) return

  panelDirection.value = newIndex < oldIndex ? 'prev' : 'next'
})

onMounted(() => {
  const isValid = props.tabs.some(tab => tab.value === props.modelValue)
  if (!isValid) {
    const fallback = props.tabs.find(tab => !tab.disabled)
    if (fallback) emit('update:modelValue', fallback.value)
  }

  nextTick(updateIndicator)
  window.addEventListener('resize', updateIndicator)
})

onBeforeUnmount(() => window.removeEventListener('resize', updateIndicator))

</script>

<template>
  <div :style="{ color: getColor }" :class="tabsClasses">
    <div
    role="tablist"
    :aria-label="label"
    :class="tabListClasses">
      <button
      v-ripple="disableRipple"
      v-for="(tab, index) in tabs"
      :key="tab.value"
      :id="`${id}-tab-${tab.value}`"
      :ref="(el) => setTabRef(el, index)"
      type="button"
      role="tab"
      :class="[`${cmpClass}__tab`, `rounded--${radius}`, { 'is-active': tab.value === activeValue }]"
      :aria-selected="tab.value === activeValue"
      :aria-controls="`${id}-panel-${tab.value}`"
      :tabindex="tab.value === activeValue ? 0 : -1"
      :disabled="tab.disabled"
      @click="selectTab(tab)"
      @keydown="handleKeydown($event, index)">
        <AdaptoIcon
        v-if="tab.icon"
        v-bind="tab.icon"
        :class="`${cmpClass}__icon`"
        aria-hidden="true"/>
        <span>{{ tab.label }}</span>
      </button>
      <span
      v-if="isUnderlined"
      aria-hidden="true"
      :class="`${cmpClass}__indicator`"
      :style="indicatorStyle"></span>
    </div>
    <div :class="`${cmpClass}__panel-wrapper`">
      <Transition :name="`${cmpClass}-panel-${panelDirection}`" mode="out-in">
        <div
        :key="activeValue"
        :id="`${id}-panel-${activeValue}`"
        role="tabpanel"
        :aria-labelledby="`${id}-tab-${activeValue}`"
        tabindex="0"
        :class="`${cmpClass}__panel`">
          <slot :name="String(activeValue)" :tab="activeTab">{{ activeTab?.label }}</slot>
        </div>
      </Transition>
    </div>
  </div>
</template>
