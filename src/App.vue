<template>
  <div class="hello">
    <TimeLabel @prev-month="currMonth--" @next-month="currMonth++" :month="currMonth" :year="currYear"></TimeLabel>
    <div class="wrapperNew">
      <div
          v-for="(weekday, index) in 7"
          :key="weekday"
          :class="
            String(this.getDays[0][weekday - 1].toLocaleString('en-GB', {weekday: 'long'}))
          "
          class="weekdayCaption"
          :style="{'--start': index * 2 + 1, '--end': index * 2 + 3, '--row': 1}"
        >
          {{ this.getDayCaption[weekday - 1] }}
      </div>
      <div
          v-for="(weekday, index) in this.getDaysNew"
          :key="weekday"
          class="dateCaption weekdayCaption weekTd"
          :class="String(weekday.toLocaleString('en-GB', {weekday: 'long'}))"
          :style="{'--start': (index % 7) * 2 + 1, '--end': (index % 7) * 2 + 3, '--row': 2 + Math.floor(index / 7) * 4}"
        >
          {{ weekday.getDate() }}
        </div>
        <div
          v-for="event in this.setCalEventsNew"
          :key="event"
          class="event"
          :class="'room' + event.room"
          :style="this.getEventStyleNew(event)"
          >
        </div>
    </div>

    <table>
      <tr>
        <th
          v-for="weekday in 7"
          :key="weekday"
          :class="
            String(this.getDays[0][weekday - 1].toLocaleString('en-GB', {weekday: 'long'}))
          "
        >
          {{ this.getDayCaption[weekday - 1] }}
        </th>
      </tr>
      <tr>
        <td colspan="7">
          <table
            v-for="(week, weekNo) in this.getDays"
            :key="week"
            class="weekTable"
          >
            <tr>
              <td
                v-for="day of week"
                :key="day"
                :class="String(day.toLocaleString('en-GB', {weekday: 'long'}))"
                colspan="2"
                class="weekTd"
              >
                <div
                  class="dateCaption"
                  :class="{ currentMonth: day.getMonth() == this.currMonth }"
                >
                  {{ day.getDate() }}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="14">
                <div class="wrapper">
                  <div
                    v-for="event in this.setCalEvents[weekNo]"
                    :key="event"
                    class="event"
                    :class="'room' + event.room"
                    :style="this.getEventStyle(event)"
                  ></div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import TimeLabel from './components/TimeLabel.vue';

export default {
  components: { TimeLabel },
  name: "HelloWorld",
  data() {
    return {
      currMonth: new Date().getMonth(),
      currYear: new Date().getFullYear(),
      startOfTheWeek: 1, // "Monday"
      rooms: 3,
      events: [
        { room: 1, start: new Date(2023, 10, 15), end: new Date(2023, 10, 16) },
        {
          room: 2,
          start: new Date(2023, 10, 23),
          end: new Date(2023, 10, 28),
        },
        { room: 1, start: new Date(2023, 10, 3), end: new Date(2023, 10, 6) },
        { room: 2, start: new Date(2023, 10, 3), end: new Date(2023, 10, 6) },
        { room: 3, start: new Date(2023, 10, 3), end: new Date(2023, 10, 6) },
        { room: 1, start: new Date(2023, 10, 6), end: new Date(2023, 10, 8) },
        { room: 1, start: new Date(2023, 10, 30), end: new Date(2023, 11, 12) },
        { room: 1, start: new Date(2024, 1, 8), end: new Date(2024, 1, 10) },
      ],
    };
  },
  props: {
    msg: String,
  },
  methods: {
    setDayCaptionClass(day) {
      return `${day.getDate()}.${day.getMonth()}`;
    },
    dayStartsEvent(slot, slotNo, currWeek) {
      let startsEvent = false;
      let duringEvent = false;
      let endsEvent = false;
      let cssClasses = false;
      let day = currWeek[0] + Math.floor(slotNo / 7);

      for (let event of this.events) {
        if (slot == event.slot) {
          if (this.equalDay(event.start, day)) {
            startsEvent = true;
            break;
          } else if (this.equalDay(event.end, day)) {
            endsEvent = true;
            break;
          } else if (
            event.start.getTime() < day.getTime() &&
            day.getTime() < event.end.getTime()
          ) {
            duringEvent = true;
            break;
          }
        }
      }

      if (slot == "north") {
        cssClasses = {
          north: startsEvent || duringEvent || endsEvent,
          start: startsEvent,
          end: endsEvent,
        };
      } else if (slot == "south") {
        cssClasses = {
          south: startsEvent || duringEvent || endsEvent,
          start: startsEvent,
          end: endsEvent,
        };
      }

      return cssClasses;
    },
    equalDay(day1, day2) {
      return day1.getFullYear() == day2.getFullYear() &&
        day1.getMonth() == day2.getMonth() &&
        day1.getDate() == day2.getDate()
        ? true
        : false;
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
      return `--start: ${event.startSlot}; --end: ${event.duration}; --row: ${event.room}; --poly: ${eventStyle}`;
    },
    getEventStyleNew(event) {
      let duration = event.duration - event.startSlot;
      let eventStyle = `polygon(${
        event.start ? (1 / (duration * 2)) * 100 : 0
      }% 0%, 100% 0%, ${
        event.end ? 100 - (1 / (duration * 2)) * 100 : 100
      }% 100%, 0% 100%)`;
      return `--start: ${event.startSlot}; --end: ${event.duration}; --row: ${(2 + event.room) + event.startWeek * 4 }; --poly: ${eventStyle}`;
    },
    getWeekOfDay(day) {
      for (let [weekNo, week] of this.getDays.entries()) {
        for (let sameDay of week) {
          if (this.equalDay(day, sameDay)) {
            return weekNo;
          }
        }
      }
    },
  },
  computed: {
    currStartOfTheMonth() {
      return new Date(this.currYear, this.currMonth, 1);
    },
    getDays() {
      let numberOfWeeks = this.getDaysToShow / 7;
      let weeks = [];
      let daysBeforeMonth =
        Math.abs(this.currStartOfTheMonth.getDay() - this.startOfTheWeek + 7) %
        7;

      let dayOffset = -daysBeforeMonth;

      for (let week = 0; week < numberOfWeeks; week++) {
        for (let day = 0; day < 7; day++) {
          if (day == 0) weeks[week] = [];
          weeks[week].push(
            new Date(this.currYear, this.currMonth, 1 + dayOffset)
          );
          dayOffset++;
        }
      }
      return weeks;
    },
    getDaysNew() {
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
        Math.abs(7 - this.currStartOfTheMonth.getDay() - this.startOfTheWeek) %
        7;
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

      let firstCalMonth = this.getDays[0][0];
      let lastCalMonth = this.getDays[this.getDays.length -1][6];

      let events_this_month = this.events.filter((event) => (event.start <= lastCalMonth || event.end >= firstCalMonth));
      
      for (let event of events_this_month) {
        for (let [index, week] of this.getDays.entries()) {
          let startWeek = false;
          if (!calEvents[index]) {
            calEvents[index] = [];
          }
          
          if (event.start <= week[6] && event.end >= week[0]) {
            let startSlot;
            let duration;
            let endWeek;
            if (event.start >= week[0] && event.start <= week[6]) {
              startWeek = true;
              startSlot = this.dayToActualCalendarDay(event.start) * 2 + 2;
            } else {
              startSlot = 1;
            }
            if (event.end >= week[0] && event.end <= week[6]) {
              endWeek = true;
              duration = this.dayToActualCalendarDay(event.end) * 2 + 2;
            } else {
              endWeek = false;
              duration = 15;
            }
            calObj = { 
              room: event.room,
              startWeek: index,
              startSlot: startSlot,
              duration: duration,
              start: startWeek,
              end: endWeek,
            };
            calEvents[index].push(calObj);
          }
        }
      }
      return calEvents;
    },
    setCalEventsNew() {
      let calEvents = [];
      let calObj;

      let firstCalMonth = this.getDays[0][0];
      let lastCalMonth = this.getDays[this.getDays.length -1][6];

      let events_this_month = this.events.filter((event) => (event.start <= lastCalMonth || event.end >= firstCalMonth));
      
      for (let event of events_this_month) {
        for (let [index, week] of this.getDays.entries()) {
          let startWeek = false;
          
          if (event.start <= week[6] && event.end >= week[0]) {
            let startSlot;
            let duration;
            let endWeek;
            if (event.start >= week[0] && event.start <= week[6]) {
              startWeek = true;
              startSlot = this.dayToActualCalendarDay(event.start) * 2 + 2;
            } else {
              startSlot = 1;
            }
            if (event.end >= week[0] && event.end <= week[6]) {
              endWeek = true;
              duration = this.dayToActualCalendarDay(event.end) * 2 + 2;
            } else {
              endWeek = false;
              duration = 15;
            }
            calObj = { 
              room: event.room,
              startWeek: index,
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
    getDayCaption() {
      let desktop = window.matchMedia("(min-width: 768px)");

      let option = desktop.matches? "long": "short";
      let weekdayCaptions = []
      for (let day of this.getDays[0]) {
        weekdayCaptions.push(day.toLocaleString("default", {weekday: option}));
      }
      return weekdayCaptions;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  grid-row: 100%;
  grid-template-rows: repeat(3, 1fr);
  height: 50px;
}
.wrapperNew {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  grid-row: 100%;
  grid-template-rows: repeat(21, 1fr);
  height: 750px;
}
span {
  display: inline-block;
  padding-left: 15px;
}
table,
th,
td {
  padding-left: 0px;
  padding-right: 0px;
}
table {
  padding-left: 0px;
  padding-right: 0px;
  border-collapse: collapse;
  border-style: solid;
  border-width: 2px;
}
th,
td {
  width: 1/7 * 100%;
}
th {
  height: 30px;
}
td {
  border-style: solid;
  border-collapse: collapse;
  border-color: grey;
  border-width: 1px;
  font-size: 17px;
  margin: 0%;
  padding: 0%;
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
  grid-column-start: var(--start);
  grid-column-end: var(--end);
  grid-row: var(--row);
  text-align: center;
  font-weight: bold;
  border: black;
  border-style: solid;
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
@media only screen and (min-width: 768px) {
td {
  border-style: solid;
  border-collapse: collapse;
  border-color: grey;
  border-width: 1px;
  font-size: 30px;
  margin: 0%;
  padding: 0%;
}
 .wrapper {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  grid-row: 100%;
  grid-template-rows: repeat(3, 1fr);
  height: 90px;
}
}
</style>
