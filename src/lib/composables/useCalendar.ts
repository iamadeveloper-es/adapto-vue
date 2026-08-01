import dayjs from 'dayjs';
import 'dayjs/locale/es'

dayjs.locale('es')
import { computed, ref, watch } from "vue"

export interface CalendarDay {
  date: ReturnType<typeof dayjs>
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

export type DateDays = string | number | Date | dayjs.Dayjs | null | undefined

export function useCalendar(){

  const weekDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  const inititialWeekDays = computed(() => weekDays.map(item => item.charAt(0).toUpperCase()))

  const getDate = (date?: DateDays): dayjs.Dayjs => {
    if(typeof date === 'undefined' || dayjs(date).isValid()){
      return dayjs(date)
    }
    throw new Error("Formato de fecha incorrecto!!! :(");
  }

  const formatDate = (date: DateDays, format: string) => {
    if(typeof date === 'undefined' || dayjs(date).isValid()){
      return dayjs(date).format(format)
    }
    throw new Error("Formato de fecha incorrecto!!! :(");
  }

  const currentMonth = ref(getDate())
  const currentMonthName = ref(months[currentMonth.value.month() - 1])

  const firstWeekDayMonday = computed(() => (currentMonth.value.startOf('month').day() + 6) % 7)

  const daysInCurrentMonth = computed(() => currentMonth.value?.daysInMonth())



  // const getMonthName = computed(() => months[currentMonth.value.month()])

  // const getCurrentYear = computed(() => currentMonth.value.year())

  const getCurrentMonth = computed(() => {
    return Array.from(
      { length: daysInCurrentMonth.value },
      (_, index) => currentMonth.value?.date(index + 1)
    )
  })

  const updateCurrentMonth = (date?: DateDays) => {
    currentMonth.value = getDate(date)
  }

  const previousMonth = computed(() => currentMonth.value.subtract(1, 'month'))

  const getPreviousMonth = computed(() => {
    return Array.from(
      { length: firstWeekDayMonday.value },
      (_, index) => {
        const day =
          previousMonth.value?.daysInMonth() -
          firstWeekDayMonday.value +
          index +
          1

        return previousMonth.value?.date(day)
      }
    )
  })

  const nextMonth = computed(() => currentMonth.value.add(1, 'month'))

  const getNextMonth = computed(() => {

    return Array.from(
      {
        length: 42 - getPreviousMonth.value?.length - getCurrentMonth.value?.length,
      },
      (_, index) => nextMonth.value.date(index + 1)
    )
  })

  const getCalendarDays = computed(() => {
    return [
      ...getPreviousMonth.value?.map(date => ({
        date,
        day: date.date(),
        isCurrentMonth: false,
        isToday: date.isSame(dayjs(), 'day')
      })),
      ...getCurrentMonth.value?.map(date => ({
        date,
        day: date.date(),
        isCurrentMonth: true,
        isToday: date.isSame(dayjs(), 'day')
      })),
      ...getNextMonth.value?.map(date => ({
        date,
        day: date.date(),
        isCurrentMonth: false,
        isToday: date.isSame(dayjs(), 'day')
      }))
    ]
  })

  const calendarMonthDaysToDisplay = computed(() => {
    const result = []

    for (let i = 0; i < getCalendarDays.value?.length; i += 7) {
      result.push(getCalendarDays.value?.slice(i, i + 7))
    }

    return result
  })

  const currentSelection = ref()

  const updateSelection = (date: CalendarDay) => {
    currentSelection.value = date
    if (!date.isCurrentMonth) {
      updateCurrentMonth(date.date)
    }
  }

  const goToPreviousMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
  }

  const goToNextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
  }

  const goToPreviousYear = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'year')
  }

  const goToNextYear = () => {
    currentMonth.value = currentMonth.value.add(1, 'year')
  }

  const isSameDay = (day: CalendarDay) => currentSelection.value?.date.isSame(day.date, 'day')

  return {
    inititialWeekDays,
    currentMonth,
    months,
    currentMonthName,
    previousMonth,
    nextMonth,
    getCalendarDays,
    calendarMonthDaysToDisplay,
    currentSelection,
    getDate,
    formatDate,
    updateCurrentMonth,
    updateSelection,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
    isSameDay
  }
}
