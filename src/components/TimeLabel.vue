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
        <div class="yearCaption">
            {{
            new Date(year, month).toLocaleString("default", {year: "numeric"})
            }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['month', "year"],
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
</style>