<template>
  <q-page>
    <h3 class="q-ma-sm row justify-center">{{ curMonth }}</h3>
    <div class="row justify-center full-width">
        <q-btn class="q-ma-sm" push label="Today" @click="onToday" />
        <q-btn class="q-ma-sm" push label="Prev" @click="onPrev" />
        <q-btn class="q-ma-sm" push label="Next" @click="onNext" />
    </div>

    <div class="row full-width full-height">
      <q-calendar-day
        ref="calendar"
        v-model="selectedDate"
        view="day"
        :max-days="numDays"
        bordered
        :hour24-format="toggled"
        :interval-minutes="15"
        :interval-count="96"
        :interval-height="10"
        animated
        transition-next="slide-left"
        transition-prev="slide-right"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-time="onClickTime"
        @click-interval="onClickInterval"
        @click-head-intervals="onClickHeadIntervals"
        @click-head-day="onClickHeadDay"
      >
        <template #day-container="{ scope: { days }}">
          <template v-if="hasDate(days)">
            <div
              class="day-view-current-time-indicator"
              :style="style"
            />
            <div
              class="day-view-current-time-line"
              :style="style"
            />
          </template>
        </template>
      </q-calendar-day>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" :to="{name: 'AppointmentEdit', query: {newAppointment: true}}" color="accent" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { QCalendarDay, today, parseDate } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { useQuasar } from 'quasar'
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'WeekDateType',
  components: {
    QCalendarDay
  },
  setup () {
    // Internal Variables
    const $q = useQuasar()
    const months = ['January', 'February', 'March',
                    'April', 'May', 'June', 'July',
                    'August', 'September', 'October',
                    'November', 'December']
    let intervalId = null

    // Exposed Variables
    const style = computed(() => {
      return {
        top: timeStartPos.value + 'px'
      }
    })
    const selectedDate = ref(today())
    const calendar = ref(null)
    const toggled = ref(false)
    const currentDate = ref(null)
    const currentTime = ref(null)
    const timeStartPos = ref(0)
    const numDays = ref(5)
    const curMonth = ref(parseInt(today()[5] + today()[6]))

    // Lifecycle Hooks
    onMounted(() => {
      adjustCurrentTime()
      // now, adjust the time every minute
      intervalId = setInterval(() => {
        adjustCurrentTime()
      }, 60000)

      // Set the number of days displayed
      if ($q.platform.is.mobile)
      {
        numDays.value = 3
      }
      else
      {
        numDays.value = 5
      }
    })



    onBeforeUnmount(() => {
      clearInterval(intervalId)
    })

    // Internal Functions

    // Exposed Functions
    function hasDate (days) {
      return currentDate.value
        ? days.find(day => day.date === currentDate.value)
        : false
    }
    function onNext () {
      calendar.value.next()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onToday () {
      calendar.value.moveToToday()
    }
    function onMoved (data) {
      console.log('onMoved', data)
    }
    function onChange (data) {
      console.log('onChange', data)
      curMonth.value = months[data.days[0].month - 1]
    }
    function onClickDate (data) {
      console.log('onClickDate', data)
    }
    function onClickTime (data) {
      console.log('onClickTime', data)
    }
    function onClickInterval (data) {
      console.log('onClickInterval', data)
    }
    function onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }

    function adjustCurrentTime () {
      const now = parseDate(new Date())
      currentDate.value = now.date
      currentTime.value = now.time
      timeStartPos.value = calendar.value.timeStartPos(currentTime.value, false)
    }

    return {
      // From QCalendar
      selectedDate,
      calendar,
      toggled,
      style,
      hasDate,
      onNext,
      onPrev,
      onToday,
      onMoved,
      onChange,
      onClickDate,
      onClickTime,
      onClickInterval,
      onClickHeadIntervals,
      onClickHeadDay,
      // Mine
      curMonth,
      numDays
    }
  }
})
</script>
<style lang="sass">
.day-view-current-time-indicator
  position: absolute
  left: -5px
  height: 10px
  width: 10px
  margin-top: -4px
  background-color: rgba(0, 0, 255, .5)
  border-radius: 50%

.day-view-current-time-line
  position: absolute
  left: 5px
  border-top: rgba(0, 0, 255, .5) 2px solid
  width: calc(100% - 5px)

.q-dark,
.body--dark,
.q-calendar--dark
  .day-view-current-time-indicator
    background-color: rgba(255, 255, 0, .85)

  .day-view-current-time-line
    border-top: rgba(255, 255, 0, .85) 2px solid

</style>
