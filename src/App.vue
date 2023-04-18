<template>
  <router-view></router-view>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data(){
    return{
      xinwenList:[]
    }
  },
  methods:{
    getData(){
      axios.post(`http://47.115.231.184:5555/api/login`).then((response)=>{
        this.xinwenList = response.data
        console.log('我是数据TEST33',this.xinwenList)
      })
    }
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
