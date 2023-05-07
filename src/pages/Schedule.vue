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
        animated
        no-active-date
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
        <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
          <template
            v-for="event in getEvents(timestamp.date)"
            :key="event.id"
          >
            <div
              v-if="event.time !== undefined"
              class="my-event"
              :class="badgeClasses(event, 'body')"
              :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
            >
              <span class="title q-calendar__ellipsis">
                {{ event.title }}
                <q-tooltip style="white-space: pre-wrap;">{{ event.details }}</q-tooltip>
              </span>
            </div>
          </template>
        </template>

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
import { QCalendarDay, addToDate,parseTimestamp, isBetweenDates, today, parsed, parseDate, parseTime } from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import moment from 'moment'

const BASEURL = 'http://localhost:3000/clients';
const months = ['January', 'February', 'March',
                'April', 'May', 'June', 'July',
                'August', 'September', 'October',
                'November', 'December']

export default defineComponent({
  name: 'WeekSlotDayBody',
  components: {
    QCalendarDay
  },
  data () {
    return {
      selectedDate: today(),
      timeStartPos: 0,
      currentDate: null,
      currentTime: null,
      intervalId: null,
      numDays: 5,
      curMonth: parseInt(today()[5] + today()[6]),
      clients: [],
      events: []
    }
  },

  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      // this.events.forEach(event => (map[ event.date ] = map[ event.date ] || []).push(event))
      this.events.forEach(event => {
        if (!map[ event.date ]) {
          map[ event.date ] = []
        }
        map[ event.date ].push(event)
        if (event.days) {
          let timestamp = parseTimestamp(event.date)
          let days = event.days
          do {
            timestamp = addToDate(timestamp, { day: 1 })
            if (!map[ timestamp.date ]) {
              map[ timestamp.date ] = []
            }
            map[ timestamp.date ].push(event)
          } while (--days > 0)
        }
      })
      return map
    },
    style () {
      return {
        top: this.timeStartPos + 'px'
      }
    }
  },
  methods: {
    badgeClasses (event, type) {
      const isHeader = type === 'header'
      return {
        [ `text-white bg-${ event.bgcolor }` ]: true,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right',
        'rounded-border': true
      }
    },

    badgeStyles (event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
      const s = {}
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(event.time) + 'px'
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s[ 'align-items' ] = 'flex-start'
      return s
    },

    getEvents (dt) {
      // get all events for the specified date
      const events = this.eventsMap[ dt ] || []

      if (events.length === 1) {
        events[ 0 ].side = 'full'
      }
      else if (events.length === 2) {
        // this example does no more than 2 events per day
        // check if the two events overlap and if so, select
        // left or right side alignment to prevent overlap
        const startTime = addToDate(parsed(events[ 0 ].date), { minute: parseTime(events[ 0 ].time) })
        const endTime = addToDate(startTime, { minute: events[ 0 ].duration })
        const startTime2 = addToDate(parsed(events[ 1 ].date), { minute: parseTime(events[ 1 ].time) })
        const endTime2 = addToDate(startTime2, { minute: events[ 1 ].duration })
        if (isBetweenDates(startTime2, startTime, endTime, true) || isBetweenDates(endTime2, startTime, endTime, true)) {
          events[ 0 ].side = 'left'
          events[ 1 ].side = 'right'
        }
        else {
          events[ 0 ].side = 'full'
          events[ 1 ].side = 'full'
        }
      }

      return events
    },

    scrollToEvent (event) {
      this.$refs.calendar.scrollToTime(event.time, 350)
    },

    hasDate (days) {
      return this.currentDate
        ? days.find(day => day.date === this.currentDate)
        : false
    },

    adjustCurrentTime () {
      const now = parseDate(new Date())
      this.currentDate = now.date
      this.currentTime = now.time
      this.timeStartPos = this.$refs.calendar.timeStartPos(this.currentTime, false)
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
      this.curMonth = months[data.days[0].month - 1]
    },
    onClickDate (data) {
      console.log('onClickDate', data)
      console.log ('Client: ', this.clients)
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
    },
    TimeConversion(time12h) {
      return moment(time12h, 'hh:mm A').format('HH:mm')
    },
    PopulateCalendar() {
      let eventID = 0
      for(const client of this.clients)
      {
        if (this.clients.length >= 0)
        {
          for(const appointment of client.appointment)
          {
            // console.log(client, appointment)
            let background = (appointment.service == 'House Cleaning') ? 'blue':'green'
            let appDetails = client.name + ', ' + client.phone + '\n'
            appDetails = appDetails + client.street + '\n'
            appDetails = appDetails + client.city + ', ' + client.state + ', ' + client.zip
            this.events.push(
            {
              id: eventID,
              title: appointment.service,
              details: appDetails,
              date: appointment.date,
              time: this.TimeConversion(appointment.time),
              duration: appointment.duration,
              bgcolor: background,
            })
            eventID = eventID + 1
          }
        }
      }
    }
  },
  async mounted(){
    const $q = useQuasar()

    try {
      const res = await axios.get(BASEURL);
      this.clients = res.data;
      this.PopulateCalendar()
    } catch (error) {
      console.error(error);
    }

    // Set the number of days displayed
    if ($q.platform.is.mobile)
    {
      this.numDays = 3
    }
    else
    {
      this.numDays = 5
    }

    // this.adjustCurrentTime()
    // // now, adjust the time every minute
    // this.intervalId = setInterval(() => {
    //   this.adjustCurrentTime()
    // }, 60000)
  }
})
</script>
<style lang="sass" scoped>
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

.my-event
  position: absolute
  font-size: 12px
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.full-width
  left: 0
  width: calc(100% - 2px)

.left-side
  left: 0
  width: calc(50% - 3px)

.right-side
  left: 50%
  width: calc(50% - 3px)

.rounded-border
  border-radius: 2px

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
