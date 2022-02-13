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
        date-type="round"
        bordered
        animated
        transition-next="slide-left"
        transition-prev="slide-right"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-time="onClickTime"
        @click-interval="onClickInterval"
        @click-head-intervals="onClickHeadIntervals"
        @click-head-day="onClickHeadDay"/>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="edit" :to="{name: 'AppointmentEdit', query: {newAppointment: true}}" color="accent" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { QCalendarDay, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'

const months = ['January', 'February', 'March',
                'April', 'May', 'June', 'July',
                'August', 'September', 'October',
                'November', 'December']

export default defineComponent({
  name: 'WeekDateType',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      dateType: 'square',
      numDays: 5,
      curMonth: parseInt(today()[5] + today()[6])
    }
  },
  mounted() {
      const $q = useQuasar()

      // Set the number of days displayed
      if ($q.platform.is.mobile)
      {
        this.numDays = 3
      }
      else
      {
        this.numDays = 5
      }
  },

  methods: {
    onToday () {
      this.$refs.calendar.moveToToday()
      console.log(this.curMonth)
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },

    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
      this.curMonth = months[data.days[0].month - 1]
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    },
    onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>
