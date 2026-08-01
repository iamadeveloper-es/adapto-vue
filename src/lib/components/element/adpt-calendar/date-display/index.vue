<script setup lang="ts">
import { useFramework } from '@/lib/composables/useFramework.ts';
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import { computed } from 'vue';

const fw = useFramework()

useStyle('date-display', css)

const cmpClass = fw.cx('date-display')

defineOptions({
  name: 'AdaptoDateDisplay',
})

const props = defineProps({
  date: {
    type: String
  },
})

const displayText = computed(() => props.date ? props.date : 'Selecciona fecha')

</script>
<template>
  <div :class="cmpClass" v-if="displayText">
    <!-- {{ displayText }} -->
    <Transition name="slide-month" mode="out-in">
  <span :key="displayText">
    {{ displayText }}
  </span>
</Transition>
  </div>
</template>
