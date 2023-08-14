<template>
  <router-view></router-view>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data() {
    return {
    }
  },
  methods: {

  }

}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
