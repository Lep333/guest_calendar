<template>
  <div>
    <GuestCalendar
      :events="events"
      :start-of-the-week="1"
      :time-slots="4"
      @calendar-date-change="(year, month) => hey(year, month)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GuestCalendar from '../src/GuestCalendar.vue';

export default defineComponent ({
  name: "App",
  components: { GuestCalendar },
  data() {
    return {
      events: [
          {id: 2, room: 1, start: new Date(2025, 6, 3), end: new Date(2025, 7, 22)},
          {id: 4, room: 3, start: new Date(2025, 6, 10), end: new Date(2025, 7, 15)},
          {id: 3, room: 2, start: new Date(2025, 6, 17), end: new Date(2025, 6, 24)},
          {id: 5, room: 4, start: new Date(), end: new Date(2025, 7, 25)},
      ]
    }
  },
  methods: {
    hey(year: number, month: number) {
      this.events.push({id: 2, room: 3, start: new Date(year, month, month + 1), end: new Date(year, month, month + 3)})
    }
  }
})
</script>