<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework';
import { computed, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue';


const fw = useFramework()

const cmpClass = fw.cx('tooltip')

defineOptions({
  name: 'AdaptoTooltip',
})

type TooltipPositions = 'top' | 'bottom' | 'left' | 'right'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  position: {
    type: String as PropType<TooltipPositions>,
    default: 'top'
  }
});

const availableValues = ['top', 'bottom', 'left', 'right'];
const trigger = ref<Element | null>(null);
const tooltip = ref<HTMLElement | null>(null);
const tooltipObserver = ref<IntersectionObserver | null>(null);
const showTooltip = ref(false);
const tooltipPosition = ref(props.position);

const tooltipInitialPosition = computed(() => {
  return availableValues.includes(props.position) ? props.position : 'top';
});

watch(showTooltip, async (newVal) => {
  if(newVal === true){
    observeTrigger();
  }
});

const show = () => {
  showTooltip.value = true;
};

const hide = () => {
  showTooltip.value = false;
};


const callback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    if (!tooltip.value) return;

    const tooltipRect = tooltip.value.getBoundingClientRect();
    const tooltipHeight = tooltipRect.height;
    const tooltipWidth = tooltipRect.width;

    const triggerRect = entry.boundingClientRect;

    const spaceTop = triggerRect.top;
    const spaceBottom = window.innerHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = window.innerWidth - triggerRect.right;

    if (entry.isIntersecting) {
      if (tooltipInitialPosition.value === 'top') {
        tooltipPosition.value = tooltipHeight > spaceTop ? 'bottom' : 'top';
      }

      if (tooltipInitialPosition.value === 'bottom') {
        tooltipPosition.value = tooltipHeight > spaceBottom ? 'top' : 'bottom';
      }

      if (tooltipInitialPosition.value === 'left') {
        tooltipPosition.value = tooltipWidth > spaceLeft ? 'right' : 'left';
      }

      if (tooltipInitialPosition.value === 'right') {
        tooltipPosition.value = tooltipWidth > spaceRight ? 'left' : 'right';
      }
    }
  });
};


const observeTrigger = () => {
  if(trigger.value){
    tooltipObserver.value = new IntersectionObserver(callback, {
      root: document,
      rootMargin: '0px',
      threshold: 0
    });

    tooltipObserver.value.observe(trigger.value);
  }
};

const stopObserving = () => {
  if (tooltipObserver.value && trigger.value) {
    tooltipObserver.value.unobserve(trigger.value);
    tooltipObserver.value.disconnect(); // opcional: también detiene todas las observaciones
    tooltipObserver.value = null;
  }
};

onMounted(() => {
  observeTrigger();
});

onBeforeUnmount(() => {
  stopObserving();
});


</script>

<template>
  <div
  ref="trigger"
  :class="[cmpClass, {'active': showTooltip}, `${cmpClass}--${tooltipPosition}`]"
  @mouseenter="show"
  @mouseleave="hide">
    <div :class="`${cmpClass}__content`"
    ref="tooltip">{{ content }}</div>
    <slot name="content"></slot>
  </div>
</template>
