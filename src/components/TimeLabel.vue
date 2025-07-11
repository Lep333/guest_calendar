<template>
    <div id="root">
        <div id="month">
            <img id="prevMonth" class="monthButton" @click="$emit('prev-month')" src="../assets/arrow_left.svg" alt="Previous Month">
            <div class="monthCaption">
                {{
                new Date(year, month).toLocaleString("default", {month: "long"})
                }}
            </div>
            <img id="nextMonth" class="monthButton" @click="$emit('next-month')" src="../assets/arrow_right.svg" alt="Next Month">
        </div>
        <div id="yearParent">
            <div @click="showYearSelector=true" ref="yearLabel" class="yearCaption">
                {{
                new Date(year, month).toLocaleString("default", {year: "numeric"})
                }}
            </div>
            <YearSelector v-if="showYearSelector" id="yearSelector" :year="this.year"></YearSelector>
        </div>
    </div>
</template>

<script>
import YearSelector from './YearSelector.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    components: { YearSelector },
    props: ["month", "year"],
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