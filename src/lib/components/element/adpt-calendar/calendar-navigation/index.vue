<script setup lang="ts">
import { useFramework } from '@/lib/composables/useFramework.ts';
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import AdaptoIcon from '../../adpt-icon/index.vue'

const fw = useFramework()

useStyle('calendar-navigation', css)

const cmpClass = fw.cx('calendar-navigation')

defineOptions({
  name: 'AdaptoCalendarNavigation',
})

type ActionType = 'first' | 'previous' | 'next' | 'last'

defineProps({
  month: {
    type: String
  },
  year: {
    type: Number
  }
})

const emit = defineEmits(['first', 'previous', 'next', 'last'])

const emitEvent = (ev: Event, action: ActionType) => {
  emit(action, ev);
};
</script>
<template>
  <div :class="cmpClass">
    <ul>
      <li>
        <button type="button" @click="emitEvent($event, 'first')">
          <AdaptoIcon name="chevron-first" :size="14" />
        </button>
      </li>
      <li>
        <button type="button" @click="emitEvent($event, 'previous')">
          <AdaptoIcon name="chevron-left" :size="14" />
        </button>
      </li>
      <li>
        <button type="button">{{ month }} {{ year }}</button>
      </li>
      <li>
        <button type="button" @click="emitEvent($event, 'next')">
          <AdaptoIcon name="chevron-right" :size="14" />
        </button>
      </li>
      <li>
        <button type="button" @click="emitEvent($event, 'last')">
          <AdaptoIcon name="chevron-last" :size="14" />
        </button>
      </li>
    </ul>
  </div>
</template>
