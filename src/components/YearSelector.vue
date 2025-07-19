<template>
  <div id="yearSelector">
    <template
      v-for="i in 9"
      :key="i"
    >
      <div 
        :id="setSelectedYear(year + i - 5)"
        class="year"
        @click="triggerYear(year + i - 5)"
      >
        {{ year + i - 5 }}
      </div>
    </template>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
    props: {
      year: {
        type: Number,
        default: new Date().getFullYear(),
      }
    },
    setup() {
        const yearChange = inject("set-year");
        
        function triggerYear(year) {
            yearChange(year);
        }

        return { triggerYear };
    },
    methods: {
        setSelectedYear(year) {
            if (this.year == year) {
                return "currentlySelected";
            }
        },
    }
}
</script>

<style>
#yearSelector {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    place-items: center;
    text-align: center;
    background-color: black;
    color: white;
    z-index: 100;
}
#currentlySelected {
    border: 0.1rem;
    border-style: solid;
    border-color: white;
}
.year {
    height: 100%;
    width: 100%;
    display: grid;
    place-items: center; 
}
</style>