<template>
  <div class="hello">
    <table>
      <tr>
        <th v-for="weekday in weekdays">{{ weekday }}</th>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data: {
    weekdays: ["Mon", "Tue", "Wed"],
  },
  props: {
    msg: String,
  },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
