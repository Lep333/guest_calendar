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
    font-size: 5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 30rem;
}

.yearCaption{
    font-size: 5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 13rem;
    display: inline-block;
    background-color: black;
    color: white;
}

.monthButton {
    width: 4rem;
    height: 100%;
    background-color: blue;
    display: inline-block;
}

#root {
    height: 6rem;
    display: flex;
    align-items: center;
}
</style>