<template>
  <div class="box">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
.box {
  height: 100%;
}
html,body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>