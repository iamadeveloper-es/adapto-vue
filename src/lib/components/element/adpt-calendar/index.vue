<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework'

import { useCalendar, type CalendarDay } from '@/lib/composables/useCalendar.ts'
import AdptCalendarNavigation from './calendar-navigation/index.vue'
import DateDisplay from './date-display/index.vue'
import { watch, type PropType } from 'vue'
import type dayjs from 'dayjs'

const {
  currentMonth,
  inititialWeekDays,
  months,
  calendarMonthDaysToDisplay,
  currentSelection,
  getDate,
  formatDate,
  isSameDay,
  goToPreviousMonth,
  goToNextMonth,
  goToPreviousYear,
  goToNextYear,
  updateSelection
} = useCalendar()

const fw = useFramework()

const cmpClass = fw.cx('calendar')

defineOptions({
  name: 'AdaptoCalendar',
})

const props = defineProps({
  // modelValue: {
  //   type: Object as PropType<dayjs.Dayjs | null>,
  //   default: null
  // }
  modelValue: {
    type: [Date, String] as PropType<Date | string | null>,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const selectDay = (day: CalendarDay) => {
  updateSelection(day)
  emit('update:modelValue', day.date)
}

watch(
  () => props.modelValue,
  value => {
    if (value) {
      currentSelection.value = getDate(value)
      // currentSelection.value = value
    }
  },
  { immediate: true }
)

const setDisplayDate = () => {
  return currentSelection.value && Object.keys(currentSelection.value).length > 0 ? formatDate(currentSelection.value?.date, 'ddd, MMM D').replace(/\./g, '')
  .replace(/\b\w/g, l => l.toUpperCase()) : ''
}

</script>

<template>
  <div :class="[cmpClass, 'elevation-2', 'rounded--sm']">
    <DateDisplay :date="setDisplayDate()"/>
    <AdptCalendarNavigation
    :month="months[currentMonth.month()]"
    :year="currentMonth.year()"
    @first="goToPreviousYear"
    @previous="goToPreviousMonth()"
    @next="goToNextMonth()"
    @last="goToNextYear"/>
    <table>
      <thead :class="`${cmpClass}-week-days`">
        <tr class="calendar-grid">
          <th v-for="(item, index) in inititialWeekDays" :key="index" :class="`${cmpClass}-week-day`">{{ item }}</th>
        </tr>
      </thead>
      <tbody :class="`${cmpClass}-month-days`">
        <tr class="calendar-grid" v-for="(week, weekIndex) in calendarMonthDaysToDisplay" :key="weekIndex">
          <td v-for="day in week" :key="day.date.format('YYYY-MM-DD')"
            :class="{
              'is-today': day.isToday,
              'is-day-current-month': day.isCurrentMonth,
              'is-active': isSameDay(day)}"
            @click="selectDay(day)">
            {{ day.day }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
