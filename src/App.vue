<template>
  <div class="hello">
    <table>
      <caption class="monthCaption">
        {{
          this.months[this.currMonth]
        }}
      </caption>
      <tr>
        <th
          v-for="weekday in 7"
          :key="weekday"
          :class="
            String(this.weekdays[(weekday - 1 + this.startOfTheWeek) % 7])
          "
        >
          {{ this.weekdays[(weekday - 1 + this.startOfTheWeek) % 7] }}
        </th>
      </tr>
      <tr v-for="week in this.getDays" :key="week">
        <td
          v-for="day in week"
          :key="day"
          :class="String(weekdays[day.getDay()])"
        >
          <div
            class="dateCaption"
            :class="{ currentMonth: day.getMonth() == this.currMonth }"
          >
            {{ day.getDate() }}
          </div>
          <div
            class="event"
            :class="this.dayStartsEvent('north', day)"
            :rowspan="1"
          ></div>

          <div
            class="event"
            :class="this.dayStartsEvent('south', day)"
            :rowspan="1"
          ></div>
        </td>
      </tr>
    </table>
    <div class="wrapper">
      <div class="north"></div>
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
</style>
