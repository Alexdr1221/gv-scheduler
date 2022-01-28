<template>
  <q-page>
    <q-resize-observer @resize="onResize"/>
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
      <!-- <q-calendar-day
        v-else
        ref="calendar"
        v-model="selectedDate"
        view="week"
        date-type="round"
        animated
        bordered
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-time="onClickTime"
        @click-interval="onClickInterval"
        @click-head-intervals="onClickHeadIntervals"
        @click-head-day="onClickHeadDay"/> -->
    </div>
  </q-page>
</template>

<script>
import { QCalendarDay, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WeekDateType',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      dateType: 'square',
      numDays: 0
    }
  },

  methods: {
    onResize() {
      const $q = useQuasar()

      if ($q.screen.lt.md)
      {
        this.numDays = 3
      }
      else
      {
        this.numDays = 5
      }
    },
    onToday () {
      this.$refs.calendar.moveToToday()
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
