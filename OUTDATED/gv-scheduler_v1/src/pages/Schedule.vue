<template>
  <q-page class="abosute full-width full-height">
    <div class="row justify-center items-center">
      <q-btn flat label="<" @click="calendarPrev" />
      <q-separator vertical />
      <label class="q-ma-md" style=""></label>
      <q-separator vertical />
      <q-btn flat label=">" @click="calendarNext" />
    </div>
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      class="lightCalendar"
      view="day"
      locale="en-us"
      animated
      month-label
      transition-prev="slide-right"
      transition-next="slide-left"
      interval-minutes="15"
      interval-start="23"
      interval-count="50"
    >
      <template #day-container="{ /* timestamp */ }">
        <div class="day-view-current-time-indicator" :style="style" />
        <div class="day-view-current-time-line" :style="style" />
      </template>
    </q-calendar>
  </q-page>
</template>

<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default {
  data () {
    return {
      selectedDate: '',
      currentDate: undefined,
      currentTime: undefined,
      intervalId: null,
      timeStartPos: 0
    }
  },
  mounted() {
    this.adjustCurrentTime();
    // now, adjust the time every minute
    this.intervalId = setInterval(() => {
      this.adjustCurrentTime();
    }, 60000);
  },

  beforeDestroy() {
    clearInterval(this.intervalId);
  },

  computed: {
    style() {
      return {
        top: this.timeStartPos + "px",
      }
    }
  },

  methods: {
    calendarNext() {
      this.$refs.calendar.next();
      this.selectedDate
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    },
    adjustCurrentTime() {
      const now = new Date();
      const p = QCalendar.parseDate(now);
      this.currentDate = p.date;
      this.currentTime = p.time;
      this.timeStartPos = this.$refs.calendar.timeStartPos(this.currentTime);
    }
  }
}
</script>

<style>
.lightCalendar {
  width: 100%;
  height: 800px;
}

.day-view-current-time-indicator {
  position: absolute;
  left: 45px;
  height: 10px;
  width: 10px;
  margin-top: -4px;
  background-color: rgba(0, 0, 255, 0.5);
  border-radius: 50%;
}

.day-view-current-time-line {
  position: absolute;
  left: 55px;
  border-top: rgba(0, 0, 255, 0.5) 2px solid;
  width: calc(100% - 50px - 5px);
}

.body--dark {
  .day-view-current-time-indicator {
    background-color: rgba(255, 255, 0, 0.85);
  }
  .day-view-current-time-line {
    border-top: rgba(255, 255, 0, 0.85) 2px solid;
  }
}
</style>
