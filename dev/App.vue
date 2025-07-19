<template>
  <div>
    <GuestCalendar :events="[{id: 1, room: 2, start: new Date(), end: new Date(2025, 7, 22)}]" />
  </div>
</template>

<script lang="ts" setup>
import GuestCalendar from '../src/GuestCalendar.vue';
// Nothing needed here for basic test
</script>
