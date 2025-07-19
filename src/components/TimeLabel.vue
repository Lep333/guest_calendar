<template>
  <div id="root">
    <div id="month">
      <img
        id="prevMonth"
        class="monthButton"
        src="../assets/arrow_left.svg"
        alt="Previous Month"
        @click="$emit('prev-month')"
      >
      <div class="monthCaption">
        {{
          new Date(year, month).toLocaleString("default", {month: "long"})
        }}
      </div>
      <img
        id="nextMonth"
        class="monthButton"
        src="../assets/arrow_right.svg"
        alt="Next Month"
        @click="$emit('next-month')"
      >
    </div>
    <div id="yearParent">
      <div
        ref="yearLabel"
        class="yearCaption"
        @click="showYearSelector=true"
      >
        {{
          new Date(year, month).toLocaleString("default", {year: "numeric"})
        }}
      </div>
      <YearSelector
        v-if="showYearSelector"
        id="yearSelector"
        :year="year"
      />
    </div>
  </div>
</template>

<script>
import YearSelector from './YearSelector.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    components: { YearSelector },
    props: {
      month: {
        type: Number,
        default: 0,
      },
      year: {
        type: Number,
        default: new Date().getFullYear(),
      }
    },
    emits: ["prev-month", "next-month"],
    setup() {
        const showYearSelector = ref(false);
        const yearLabel = ref(null);

        function handleClick(event) {
            if (yearLabel.value && !yearLabel.value.contains(event.target)) {
                showYearSelector.value = false;
            }
        }

        onMounted(() => {
            document.addEventListener('click', handleClick);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClick);
        });

        return {
            showYearSelector,
            yearLabel,
        }
    },
}
</script>

<style>
.monthCaption{
    font-size: 8vw;
    padding-left: 1rem;
    padding-right: 1rem;
    min-width: fit-content;
    justify-content: center;
    text-align: center;
}

.yearCaption{
    font-size: 8vw;
    min-width: fit-content;
    height: 100%;
    display: flex;
    background-color: black;
    color: white;
    text-align: center;
    align-items: center;
    justify-content: center;
}

.monthButton {
    width: 10vw;
    height: 100%;
    display: inline-block;
    min-width: 10vw;
}

#root {
    height: 12vw;
    display: grid;
    grid-template-columns: 5fr 2fr;
}

#month {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    align-items: center;
    justify-content: center;
}

#yearSelector {
    position: absolute;
    top: 100%;
    right: 0rem;
    height: 100%;
    width: 100%;
    font-size: 2vw;
}

#yearParent {
    position: relative;
}

@media only screen and (max-width: 768px) {
    #yearSelector {
        position: absolute;
        top: 100%;
        right: 0rem;
        height: 150%;
        width: 100vw;
        font-size: 3vw;
    }
}
</style>