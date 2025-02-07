<template>
  <div class="hello">
    <TimeLabel @prev-month="goToLastMonth()" @next-month="goToNextMonth()" :month="currMonth" :year="currYear"></TimeLabel>
    <div class="wrapper" :style="{'--no-rows': (this.getDaysToShow / 7) * 4 + 1}">
      <div
          v-for="(weekday, index) in 7"
          :key="weekday"
          :class="
            String(this.getDays[weekday - 1].toLocaleString('en-GB', {weekday: 'long'}))
          "
          class="weekdayCaption"
          :style="{'--start': index * 2 + 1, '--end': index * 2 + 3, '--row': 1}"
        >
          {{ this.weekdayCaptions[weekday - 1] }}
      </div>
      <div
          v-for="(weekday, index) in this.getDays"
          :key="weekday"
          class="dayCaption weekTd"
          :class="[
            weekday.toLocaleString('en-GB', { weekday: 'long' }),
            weekday.getMonth() === currMonth ? 'currentMonth' : ''
          ]"
          :style="{'--start': (index % 7) * 2 + 1, '--end': (index % 7) * 2 + 3, '--row': 2 + Math.floor(index / 7) * 4}"
        >
          {{ weekday.getDate() }}
        </div>
        <div
          v-for="event in this.setCalEvents"
          :key="event"
          class="event"
          :class="'room' + event.room"
          :style="this.getEventStyle(event)"
          @click="this.setSelectedEvent($event, event)"
          >
        </div>
        <div v-if="this.selectedEvent" ref="eventWindow" class="eventWindow" :style="{'--top': this.y + 'px', '--left': this.x + 'px'}">
          <img id="imgClose" @click="this.selectedEvent = null" src="./assets/close.svg" alt="close">
          <template v-for="(value, key) in this.printEvent()" :key="key">
            <div class="eventDetail">
              {{ key }}
            </div>
            <div class="eventDetail">
              {{ value }}
            </div>
          </template>
        </div>
      </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import TimeLabel from './components/TimeLabel.vue';

export default {
  components: { TimeLabel },
  name: "GuestCalendar",
  data() {
    return {
      currMonth: new Date().getMonth(),
      currYear: new Date().getFullYear(),
      weekdayCaptions: [],
      startOfTheWeek: 1, // "Monday"
      rooms: 3,
      selectedEvent : null,
      x: 0,
      y: 0,
      events: [
        { id: 1, room: 1, start: new Date(2023, 10, 15), end: new Date(2023, 10, 16) },
        {
          id: 2,
          room: 2,
          start: new Date(2023, 10, 23),
          end: new Date(2023, 10, 28),
        },
        { id: 3, room: 1, start: new Date(2023, 10, 3), end: new Date(2023, 10, 6) },
        { id: 4, room: 2, start: new Date(2023, 10, 3), end: new Date(2023, 10, 6) },
        { id: 5, room: 3, start: new Date(2023, 10, 3), end: new Date(2023, 10, 6) },
        { id: 6, room: 1, start: new Date(2023, 10, 6), end: new Date(2023, 10, 8) },
        { id: 7, room: 1, start: new Date(2023, 10, 30), end: new Date(2023, 11, 12) },
        { id: 8, room: 1, start: new Date(2024, 1, 8), end: new Date(2024, 1, 10) },
        { id: 9, room: 1, prename: "Hier Könnte", name: "Ihr Name Stehen", start: new Date(2024, 8, 3), end: new Date(2024, 8, 10) },
      ],
    };
  },
  mounted() {
    let desktop = window.matchMedia("(min-width: 768px)");
    this.getDayCaption(desktop);
    desktop.addEventListener("change", this.getDayCaption);
  },
  methods: {
    setSelectedEvent(payload, e) {
      this.selectedEvent = e;
      this.x = payload.x + window.scrollX;
      this.y = payload.y + window.scrollY;

      nextTick(() => {
        const el = this.$refs.eventWindow;
        const rect = el.getBoundingClientRect();
        const viewportX = window.innerWidth;
        const viewportY = window.innerHeight;
        if (rect.right > viewportX) {
          this.x = this.x - (rect.right - rect.left);
        }
        if (rect.bottom > viewportY) {
          this.y = this.y - (rect.bottom - rect.top);
        }
      })
    },
    dayToActualCalendarDay(day) {
      return (day.getDay() - this.startOfTheWeek + 7) % 7;
    },
    getEventStyle(event) {
      let duration = event.duration - event.startSlot;
      let eventStyle = `polygon(${
        event.start ? (1 / (duration * 2)) * 100 : 0
      }% 0%, 100% 0%, ${
        event.end ? 100 - (1 / (duration * 2)) * 100 : 100
      }% 100%, 0% 100%)`;
      return `--start: ${event.startSlot}; --end: ${event.duration}; --row: ${(2 + event.room) + event.startWeek * 4 }; --poly: ${eventStyle}`;
    },
    getDayCaption() {
      let desktop = window.matchMedia("(min-width: 768px)");

      let option = desktop.matches? "long": "short";
      let weekdayCaptions = []
      let i = 0;
      while (i < 7) {
        let day = this.getDays[i]
        weekdayCaptions.push(day.toLocaleString("default", {weekday: option}));
        i++;
      }
      this.weekdayCaptions =  weekdayCaptions;
    },
    goToLastMonth() {
      if (this.currMonth == 0) {
        this.currYear--;
        this.currMonth = 11;
      } else {
        this.currMonth--;
      }
    }, 
    goToNextMonth() {
      if (this.currMonth == 11) {
        this.currYear++;
        this.currMonth = 0;
      } else {
        this.currMonth++;
      }
    },
    printEvent() {
      if (this.selectedEvent == null)
        return
      let eventDetails = {};
      let event = null;
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      for (let el of this.events) {
        if (this.selectedEvent.id == el.id) {
          event = el;
          break;
        }
      }
      for (const key in event) {
        if (typeof(event[key]) == typeof(new Date())) {
          eventDetails[key] = `${event[key].toLocaleString(undefined, options)}`;
        } else {
          eventDetails[key] = `${event[key]}`;
        }
      }
      return eventDetails;
    },
  },
  computed: {
    currStartOfTheMonth() {
      return new Date(this.currYear, this.currMonth, 1);
    },
    getDays() {
      let weeks = [];
      let daysBeforeMonth =
        Math.abs(this.currStartOfTheMonth.getDay() - this.startOfTheWeek + 7) %
        7;

      let dayOffset = -daysBeforeMonth;

      for (let index = 0; index < this.getDaysToShow; index++) {
        weeks.push(
            new Date(this.currYear, this.currMonth, 1 + dayOffset + index)
          );
      }
      return weeks;
    },
    getDaysToShow() {
      let daysBeforeMonth =
        Math.abs(7 + (this.currStartOfTheMonth.getDay() - this.startOfTheWeek)) % 7;
      let daysTillEndOfMonth = new Date(
        this.currYear,
        this.currMonth + 1,
        0
      ).getDate();
      let weeksToShow = Math.ceil((daysBeforeMonth + daysTillEndOfMonth) / 7);

      return weeksToShow * 7;
    },
    setCalEvents() {
      let calEvents = [];
      let calObj;

      let firstCalMonth = this.getDays[0];
      let lastCalMonth = this.getDays[this.getDays.length - 1];

      let events_this_month = this.events.filter((event) => (event.start <= lastCalMonth || event.end >= firstCalMonth));
      
      for (let event of events_this_month) {
        for (let i = 0; i < this.getDays.length / 7; i++) {
          let startOfWeek = this.getDays[i * 7];
          let endOfWeek = this.getDays[i * 7 + 6];
          
          let startWeek = false;
            
          if (event.start <= endOfWeek && event.end >= startOfWeek) {
            let startSlot;
            let duration;
            let endWeek;
            if (event.start >= startOfWeek && event.start <= endOfWeek) {
              startWeek = true;
              startSlot = this.dayToActualCalendarDay(event.start) * 2 + 2;
            } else {
              startSlot = 1;
            }
            if (event.end >= startOfWeek && event.end <= endOfWeek) {
              endWeek = true;
              duration = this.dayToActualCalendarDay(event.end) * 2 + 2;
            } else {
              endWeek = false;
              duration = 15;
            }
            calObj = { 
              id: event.id,
              room: event.room,
              startWeek: i,
              startSlot: startSlot,
              duration: duration,
              start: startWeek,
              end: endWeek,
            };
            calEvents.push(calObj);
          }
        }
      }
      return calEvents;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  grid-row: 100%;
  grid-template-rows: repeat(var(--no-rows), 1fr);
  height: 100%;
}
span {
  display: inline-block;
  padding-left: 15px;
}
.currentMonth {
  font-weight: bold;
}
.event {
  background-color: #c1666b;
  grid-column-start: var(--start);
  grid-column-end: var(--end);
  grid-row: var(--row);
  height: 30;
  clip-path: var(--poly);
}
.room1 {
  background-color: #c1666b;
}
.room2 {
  background-color: #d4b483;
}
.room3 {
  background-color: #508991;
}
.monthCaption {
  grid-column-start: var(--start);
  grid-column-end: var(--end);
  text-align: center;
  font-size: 30px;
  height: 50px;
}
.weekdayCaption {
  display: flex;
  grid-column-start: var(--start);
  grid-column-end: var(--end);
  grid-row: var(--row);
  text-align: center;
  font-weight: bold;;
  border-top: 1px;
  border-left: 1px;
  border-right: 0px;
  border-bottom: 0px;
  border-style: solid;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}
.weekdayCaption:nth-child(7n) {
  border-bottom: none;
  border-right: 1px solid black;
}
.dayCaption {
  display: flex;
  grid-column-start: var(--start);
  grid-column-end: var(--end);
  grid-row: var(--row);
  text-align: left;
  border-top: 1px black;
  border-left: 1px black;
  border-right: 0px black;
  border-bottom: 1px black;
  border-style: solid;
  box-sizing: border-box;
  padding-left: 3px;
  font-size: 20px;
  align-items: center;
}
.dayCaption:nth-child(7n) {
  border-right: 1px solid black;
}
.Saturday,
.Sunday {
  background-color: #e4dfda;
}
.start {
  clip-path: polygon(75% 0%, 100% 0%, 100% 100%, 50% 100%);
  box-shadow: 20px, 20px, blue;
}
.end {
  clip-path: polygon(0% 0%, 50% 0%, 25% 100%, 0% 100%);
  filter: drop-shadow(5px, 5px);
}
.weekTable {
  width: 100%;
  table-layout: fixed;
}
.weekTd {
  width: 1/7;
}
#prevMonth {
  width: 40px;
  height: 40px;
}
.eventWindow {
  position: absolute;
  top: var(--top);
  left: var(--left);
  right: var(--right);
  background-color: white;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5vh;
  padding: 2vw;
  font-size: large;
  border-radius: 2%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
#imgClose {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
  width: max(40px, 2vw);
  height: max(40px, 2vw);
}
@media only screen and (min-width: 768px) {
 .wrapper {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  grid-row: 100%;
  grid-template-rows: repeat(var(--no-rows), 1fr);
  height: 100%;
  }
}

@media only screen and (max-width: 768px) {
  .eventWindow {
    margin-left: 2vw;
    margin-right: 2vw;
    position: absolute;
    top: var(--top);
    left: 0px;
    z-index: 1;
    padding: 2vw;
    width: 91.8vw;
    font-size: large;
    border-radius: 10px;
  }
  #imgClose {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
  width: max(40px, 4vw);
  height: max(40px, 4vw);
}
}
</style>
