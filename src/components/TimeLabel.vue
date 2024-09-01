<template>
    <div id="root">
        <div id="prevMonth" class="monthButton" @click="$emit('prev-month')"></div>
        <div class="monthCaption">
        {{
        new Date(year, month).toLocaleString("default", {month: "long"})
        }}
        </div>
        <div class="yearCaption">
        {{
        new Date(year, month).toLocaleString("default", {year: "numeric"})
        }}
        </div>
        
        
        <div id="nextMonth" class="monthButton" @click="$emit('next-month')"></div>
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
    width: 60vw;
}

.yearCaption{
    font-size: 8vw;
    padding-left: 5rem;
    padding-right: 1rem;
    width: 20vw;
    height: 100%;
    display: flex;
    background-color: black;
    color: white;
    text-align: center;
    align-items: center;
}

.monthButton {
    width: 10vw;
    height: 100%;
    background-color: blue;
    display: inline-block;
}

#root {
    height: 12vw;
    display: flex;
    align-items: center;
}
</style>