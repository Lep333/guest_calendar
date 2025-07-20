<template>
  <div>
    <GuestCalendar
      :events="[
        {id: 2, room: 1, start: new Date(2025, 6, 20), end: new Date(2025, 7, 22)},
        {id: 4, room: 3, start: new Date(2025, 6, 20), end: new Date(2025, 7, 22)},
        {id: 3, room: 2, start: new Date(2025, 6, 20), end: new Date(2025, 7, 24)},
        {id: 5, room: 4, start: new Date(), end: new Date(2025, 7, 25)},
      ]"
      :start-of-the-week="1"
      :time-slots="4"
    />
  </div>
</template>

<script lang="ts" setup>
import GuestCalendar from '../src/GuestCalendar.vue';
</script>
