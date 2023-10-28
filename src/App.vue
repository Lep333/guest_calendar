<template>
  <div>
    <div class="wrapper">
      <div class="monthCaption" style="--start: 1; --end: 8">
        {{ this.months[this.currMonth] }}
      </div>
      <div
        v-for="weekday in 7"
        :key="weekday"
        :class="String(this.weekdays[(weekday - 1 + this.startOfTheWeek) % 7])"
        class="weekDayCaption"
      >
        {{ this.weekdays[(weekday - 1 + this.startOfTheWeek) % 7] }}
      </div>
      <div
        v-for="(day, dayNo) in this.getDays"
        :key="day"
        :class="this.getDateCaptionClass(day)"
        class="dateCaption calElement"
        :style="this.getDateCaption(day, dayNo)"
      >
        {{ day.getDate() }}
      </div>
      <!-- <div
            class="event"
            :class="this.dayStartsEvent('north', day)"
            :rowspan="1"
          ></div>

          <div
            class="event"
            :class="this.dayStartsEvent('south', day)"
            :rowspan="1"
          ></div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      weekdays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      months: [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      currMonth: new Date().getMonth(),
      currYear: new Date().getFullYear(),
      startOfTheWeek: 1, // "Monday"
      events: [
        { slot: "north", start: new Date(), end: new Date(2023, 9, 31) },
        {
          slot: "south",
          start: new Date(2023, 9, 23),
          end: new Date(2023, 9, 28),
        },
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
    dayStartsEvent(slot, day) {
      let startsEvent = false;
      let duringEvent = false;
      let endsEvent = false;
      let cssClasses = false;

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
    getDateCaption(day, dayNo) {
      let weekNo = Math.ceil((dayNo + 1) / 7);
      let x = `--colStart: ${
        Math.abs((7 + day.getDay() - this.startOfTheWeek) % 7) + 1
      }; --rowStart: ${weekNo * 3}`;
      console.log(x);
      return x;
    },
    getDateCaptionClass(day) {
      let bla = String(this.weekdays[day.getDay()]);
      console.log(day.getMonth() == this.currMonth);
      return { [bla]: true, currentMonth: day.getMonth() == this.currMonth };
    },
  },
  computed: {
    currStartOfTheMonth() {
      return new Date(this.currYear, this.currMonth, 1);
    },
    getDays() {
      //let numberOfWeeks = this.getDaysToShow / 7;
      let days = [];
      let daysBeforeMonth =
        Math.abs(this.currStartOfTheMonth.getDay() - this.startOfTheWeek + 7) %
        7;

      let dayOffset = -daysBeforeMonth;

      for (let day = 0; day < this.getDaysToShow; day++) {
        days.push(new Date(this.currYear, this.currMonth, 1 + dayOffset));
        dayOffset++;
      }
      return days;
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(20px, auto);
}
table,
th,
td {
  padding-left: 0px;
  padding-right: 0px;
}
table {
  width: 50%;
  padding-left: 0px;
  padding-right: 0px;
  border-collapse: collapse;
  border-style: solid;
  border-width: 2px;
}
th,
td {
  width: 150px;
}
th {
  height: 30px;
}
td {
  border-style: solid;
  border-collapse: collapse;
  border-color: grey;
  border-width: 1px;
  font-size: 30px;
  margin: 0%;
  padding: 0%;
}
.currentMonth {
  font-weight: bold;
}
.event {
  height: 30px;
}
.north {
  background-color: #c1666b;
}
.south {
  background-color: #d4b483;
}
.monthCaption {
  grid-column-start: var(--start);
  grid-column-end: var(--end);
  text-align: center;
  font-size: 30px;
  height: 50px;
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
.calElement {
  grid-column-start: var(--colStart);
  grid-column-end: var(--colEnd);
  grid-row-start: var(--rowStart);
  grid-row-end: var(--rowEnd);
}
.dateCaption {
  font-size: 20px;
}
.weekDayCaption {
  text-align: center;
}
grid-item {
  height: 50px;
}
</style>
